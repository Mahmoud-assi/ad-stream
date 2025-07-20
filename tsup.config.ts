import { defineConfig } from "tsup";

export default defineConfig([
  // ✅ React/Next/Vue builds (ESM + CJS)
  {
    entry: ["src/index.tsx"],
    format: ["esm", "cjs"],
    dts: true,
    bundle: true,
    splitting: false,
    clean: true,
    external: ["react", "react-dom"], // ✅ Do not bundle React
    treeshake: true,
    outDir: "dist",
  },

  // ✅ Browser (Web Component) build — bundles everything including React
  {
    entry: {
      "browser/web-component": "src/web-component.tsx",
    },
    format: ["iife"],
    globalName: "AdStreamComponent",
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
    },
    bundle: true,
    minify: true,
    dts: false,
    clean: false,
    outDir: "dist",
    external: [], // ✅ Bundle everything
    treeshake: true,
    platform: "browser",
  },
]);
