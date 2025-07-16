import { useEffect } from "react";

export default function useInjectKeenSliderStyles() {
  useEffect(() => {
    if (typeof document === "undefined") return; // SSR safety
    if (!document.getElementById("keen-slider-css")) {
      const link = document.createElement("link");
      link.id = "keen-slider-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/keen-slider@6.8.6/keen-slider.min.css";
      document.head.appendChild(link);
    }
  }, []);
}
