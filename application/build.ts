const esbuild = require("esbuild");
const postcss = require("@deanc/esbuild-plugin-postcss");
const fs = require("node:fs");

esbuild
  .build({
    entryPoints: ["vapar/static/vapar.tsx"],
    bundle: true,
    metafile: true,
    outdir: "build",
    loader: {
      ".js": "jsx",
      ".tsx": "tsx",
      ".svg": "text"
    },
    target: ["esnext"],
    define: {
      "process.env.NODE_ENV": "'production'",
    },
    minify: true,
    splitting: false,
    format: "esm",
    sourcemap: true,
    plugins: [
      postcss({
        plugins: [
            require("@tailwindcss/postcss")
        ],
      }),
    ],
  })
