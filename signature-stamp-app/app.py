import io
import json
import os
import shutil
import tempfile
import time
import uuid

import pymupdf
from flask import Flask, jsonify, request, send_file, send_from_directory
from PIL import Image

APP_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.join(tempfile.gettempdir(), "opencode", "stamp_sessions")

app = Flask(__name__, static_folder="static")
app.config["MAX_CONTENT_LENGTH"] = 200 * 1024 * 1024  # 200 MB

PAGE_PREVIEW_SCALE = 2  # render previews at 2x for sharpness


# ---------------------------------------------------------------- helpers
def session_dir(sid):
    return os.path.join(BASE_DIR, sid)


def purge_old_sessions(max_age_seconds=7200):
    if not os.path.isdir(BASE_DIR):
        return
    now = time.time()
    for name in os.listdir(BASE_DIR):
        path = os.path.join(BASE_DIR, name)
        try:
            if os.path.isdir(path) and now - os.path.getmtime(path) > max_age_seconds:
                shutil.rmtree(path, ignore_errors=True)
        except OSError:
            pass


def _hex_to_rgb(value, default=(0, 0, 0)):
    value = (value or "").strip().lstrip("#")
    if len(value) == 6:
        try:
            return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))
        except ValueError:
            pass
    return default


def _sample_corner_brightness(img):
    lum = img.convert("L")
    px = lum.load()
    w, h = lum.size
    pts = [(3, 3), (w - 4, 3), (3, h - 4), (w - 4, h - 4)]
    vals = [px[x, y] for x, y in pts if x >= 0 and y >= 0]
    return sum(vals) / len(vals)


def remove_background(img):
    """Make the uniform background transparent.

    Auto-detects dark vs light background. Bright strokes on dark background
    become opaque; dark strokes on light background become opaque too.
    """
    img = img.convert("RGBA")
    lum = img.convert("L")
    if _sample_corner_brightness(img) < 128:
        alpha = lum  # bright strokes on dark bg
    else:
        alpha = lum.point(lambda v: 255 - v)  # dark strokes on light bg
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.putalpha(alpha)
    return out


def crop_to_content(img, padding=4):
    bbox = img.getbbox()  # based on alpha channel
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    w, h = img.size
    box = (
        max(0, x0 - padding),
        max(0, y0 - padding),
        min(w, x1 + padding),
        min(h, y1 + padding),
    )
    return img.crop(box)


def process_signature(sig_path, opts):
    """Produce a clean RGBA PNG (transparent background) from the uploaded image."""
    img = Image.open(sig_path).convert("RGBA")

    # Only auto-remove background when the image is fully opaque (e.g. JPG
    # photo). Already-transparent images (drawn signatures / PNG with alpha)
    # are kept as-is.
    has_transparency = img.getchannel("A").getextrema()[0] < 255
    if opts.get("remove_bg", True) and not has_transparency:
        img = remove_background(img)

    rot = int(opts.get("rotate", 0) or 0) % 360
    if rot:
        img = img.rotate(rot, expand=True, fillcolor=(0, 0, 0, 0))

    img = crop_to_content(img)

    r, g, b = _hex_to_rgb(opts.get("color"))
    opacity = float(opts.get("opacity", 1.0))
    opacity = max(0.0, min(1.0, opacity))
    alpha = img.getchannel("A")
    if opacity < 1.0:
        alpha = alpha.point(lambda v: int(v * opacity))

    out = Image.new("RGBA", img.size, (r, g, b, 0))
    out.putalpha(alpha)
    return out


# ---------------------------------------------------------------- routes
@app.get("/")
def index():
    return app.send_static_file("index.html")


@app.get("/index.html")
def landing():
    # Landing page (auto-detects server) when the folder is opened directly.
    return send_from_directory(APP_DIR, "index.html")


@app.post("/api/upload")
def upload():
    purge_old_sessions()
    pdf = request.files.get("pdf")
    if not pdf:
        return jsonify(error="Perlu upload fail PDF."), 400

    sid = uuid.uuid4().hex
    d = session_dir(sid)
    os.makedirs(d, exist_ok=True)
    pdf.save(os.path.join(d, "upload.pdf"))
    sig = request.files.get("sig")
    if sig:
        sig.save(os.path.join(d, "signature"))

    try:
        doc = pymupdf.open(os.path.join(d, "upload.pdf"))
    except Exception:
        shutil.rmtree(d, ignore_errors=True)
        return jsonify(error="Fail PDF tidak sah."), 400

    width, height = doc[0].rect.width, doc[0].rect.height
    page_count = doc.page_count
    doc.close()

    return jsonify(sid=sid, page_count=page_count, width=width, height=height)


@app.get("/api/session/<sid>/page/<int:n>.png")
def page_png(sid, n):
    doc_path = os.path.join(session_dir(sid), "upload.pdf")
    if not os.path.exists(doc_path):
        return jsonify(error="Sesi tidak dijumpai."), 404
    doc = pymupdf.open(doc_path)
    if n < 1 or n > doc.page_count:
        doc.close()
        return jsonify(error="Muka surat tidak sah."), 400
    page = doc[n - 1]
    pix = page.get_pixmap(matrix=pymupdf.Matrix(PAGE_PREVIEW_SCALE, PAGE_PREVIEW_SCALE))
    buf = pix.tobytes("png")
    doc.close()
    return send_file(io.BytesIO(buf), mimetype="image/png")


@app.get("/api/session/<sid>/sig.png")
def sig_png(sid):
    sig_path = os.path.join(session_dir(sid), "signature")
    if not os.path.exists(sig_path):
        return jsonify(error="Tandatangan tidak dijumpai."), 404
    opts = json.loads(request.args.get("opts", "{}"))
    img = process_signature(sig_path, opts)
    buf = io.BytesIO()
    img.save(buf, "PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png")


@app.post("/api/signature")
def signature():
    sid = request.form.get("sid")
    if not sid or not os.path.isdir(session_dir(sid)):
        return jsonify(error="Sesi tidak dijumpai."), 404
    img = request.files.get("image")
    if not img:
        return jsonify(error="Tiada imej tandatangan."), 400
    img.save(os.path.join(session_dir(sid), "signature"))
    return jsonify(ok=True)


@app.delete("/api/session/<sid>")
def delete_session(sid):
    d = session_dir(sid)
    if os.path.isdir(d):
        shutil.rmtree(d, ignore_errors=True)
    return jsonify(ok=True)


@app.post("/api/sign")
def sign():
    data = request.get_json(silent=True) or {}
    sid = data.get("sid")
    d = session_dir(sid)
    doc_path = os.path.join(d, "upload.pdf")
    if not os.path.exists(doc_path):
        return jsonify(error="Sesi tidak dijumpai."), 404

    rect = data.get("rect")
    if not rect or not all(k in rect for k in ("x0", "y0", "x1", "y1")):
        return jsonify(error="Posisi tandatangan tidak sah."), 400

    opts = data.get("options", {})
    target = data.get("pages", "all")

    try:
        proc = process_signature(os.path.join(d, "signature"), opts)
    except Exception:
        return jsonify(error="Gagal memproses gambar tandatangan."), 400
    proc_path = os.path.join(d, "processed.png")
    proc.save(proc_path)

    r = pymupdf.Rect(rect["x0"], rect["y0"], rect["x1"], rect["y1"])
    pix = pymupdf.Pixmap(proc_path)

    doc = pymupdf.open(doc_path)
    if target == "all":
        for page in doc:
            page.insert_image(r, pixmap=pix)
    else:
        try:
            n = int(target)
        except (TypeError, ValueError):
            n = 1
        if 1 <= n <= doc.page_count:
            doc[n - 1].insert_image(r, pixmap=pix)

    buf = doc.tobytes(garbage=3, deflate=True)
    doc.close()
    return send_file(
        io.BytesIO(buf),
        mimetype="application/pdf",
        as_attachment=True,
        download_name="signed.pdf",
    )


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5000"))
    debug = os.environ.get("DEBUG", "1") == "1"
    app.run(host=host, port=port, debug=debug)
