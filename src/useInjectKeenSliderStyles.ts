import { useEffect } from "react";

export default function useInjectKeenSliderStyles() {
  useEffect(() => {
    if (!document.getElementById("keen-slider-css")) {
      const link = document.createElement("link");
      link.id = "keen-slider-css";
      link.rel = "stylesheet";
      // Use CDN or package local URL if you bundle the CSS in your package's dist
      link.href =
        "https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css";
      document.head.appendChild(link);
    }
  }, []);
}
