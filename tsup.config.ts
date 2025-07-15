import { defineConfig } from "tsup";

export default defineConfig([
  // ✅ Build for React/Angular/Vue apps (ESM + CJS, externalized React)
  {
    entry: ["src/index.tsx"],
    format: ["esm", "cjs"],
    dts: true,
    bundle: true,
    splitting: false,
    clean: true,
    external: ["react", "react-dom"],
    treeshake: true,
    outDir: "dist",
  },

  // ✅ Browser build (Web Component with React + ReactDOM bundled)
  {
    entry: {
      "browser/web-component": "src/web-component.tsx",
    },
    format: ["iife"],
    globalName: "AdStreamComponent", // Not critical but required by tsup for IIFE
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    bundle: true,
    minify: true,
    dts: false,
    clean: false,
    outDir: "dist",
    external: [], // ← Everything is bundled in!
    treeshake: true,
  },
]);
