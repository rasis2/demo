const { build } = require("esbuild");
const { execSync } = require("child_process");

console.log("Building Tailwind CSS...");
execSync("npx tailwindcss -i src/input.css -o tailwind.css --minify", { stdio: "inherit" });

console.log("Bundling app...");
build({
  entryPoints: ["src/entry.jsx"],
  bundle: true,
  minify: true,
  platform: "browser",
  target: ["es2018"],
  jsx: "automatic",
  outfile: "app.js",
  logLevel: "info",
}).catch(() => {
  console.error("Bundle failed");
  process.exit(1);
});
