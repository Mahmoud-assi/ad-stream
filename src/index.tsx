// Export React components for React users
export { default as AdComponent } from "./AdComponent";
export { default as AdStream } from "./AdStream";
export { default as AdStreamCarousel } from "./AdStreamCarousel";
export { default as useAdStream } from "./useAdStream";
export { default as fetchAds } from "./fetchAds";

// Register the Web Components (side effect)
// import "./web-component";
// Only import web-component if in browser (avoids SSR crash)
if (typeof window !== "undefined") {
  import("./web-component");
}
