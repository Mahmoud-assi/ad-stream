import React, { createRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { AdStreamCarouselProps } from "./AdStreamCarousel";
import AdStreamCarouselWithRef from "./AdStreamCarouselWithRef";

export class AdStreamCarouselElement extends HTMLElement {
  private ref = createRef<{ setAdstreamKey: (key: string) => void }>();
  private root: ReactDOMClient.Root | null = null;

  connectedCallback() {
    // Parse zoneIds (JSON array)
    const zoneIdsAttr = this.getAttribute("zoneids");
    if (!zoneIdsAttr) {
      console.error("Missing required attribute: zoneids");
      return;
    }

    let zoneIds: number[];
    try {
      zoneIds = JSON.parse(zoneIdsAttr);
      if (
        !Array.isArray(zoneIds) ||
        !zoneIds.every((id) => typeof id === "number")
      ) {
        console.error("Invalid zoneids: must be an array of numbers");
        return;
      }
    } catch {
      console.error("Invalid JSON for zoneids");
      return;
    }

    const props: Omit<AdStreamCarouselProps, "adstreamKey"> = {
      zoneIds,
      slotProps: this.parseJsonAttribute("slotprops"),
      slots: this.parseJsonAttribute("slots"),
      sliderOptions: this.parseJsonAttribute("slideroptions"),
      autoplay: this.hasAttribute("autoplay")
        ? this.getAttribute("autoplay") === "true"
        : true,
      autoplayInterval: this.hasAttribute("autoplayinterval")
        ? Number(this.getAttribute("autoplayinterval"))
        : 4000,
      direction: (this.getAttribute("direction") as "rtl" | "ltr") ?? "ltr",
    };

    // Render React element with ref
    const element = React.createElement(AdStreamCarouselWithRef, {
      ...props,
      ref: this.ref,
    });

    this.root = ReactDOMClient.createRoot(this);
    this.root.render(element);
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }

  /**
   * Setter for adstreamKey to update React component dynamically
   */
  setAdstreamKey(key: string) {
    if (this.ref.current?.setAdstreamKey) {
      this.ref.current.setAdstreamKey(key);
    } else {
      console.warn("AdStreamCarousel component not ready yet.");
    }
  }

  /**
   * Helper: safely parse JSON attribute or return undefined
   */
  private parseJsonAttribute(attrName: string): any {
    const val = this.getAttribute(attrName);
    if (!val) return undefined;
    try {
      return JSON.parse(val);
    } catch {
      console.warn(`Invalid JSON for attribute '${attrName}':`, val);
      return undefined;
    }
  }
}
