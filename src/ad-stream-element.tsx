import React, { createRef } from "react";
import AdStream, { AdStreamPropsWithZone } from "./AdStream";
import * as ReactDOMClient from "react-dom/client";

// 🛠 Cast to allow refs
const AdStreamWithRef = AdStream as React.ForwardRefExoticComponent<
  AdStreamPropsWithZone & React.RefAttributes<any>
>;

export class AdStreamElement extends HTMLElement {
  private ref = createRef<{ setAdstreamKey: (key: string) => void }>();

  connectedCallback() {
    // Parse and validate zoneId
    const zoneIdAttr = this.getAttribute("zoneid");
    if (!zoneIdAttr) {
      console.error("Missing required attribute: zoneid");
      return;
    }

    const zoneId = parseInt(zoneIdAttr, 10);
    if (isNaN(zoneId)) {
      console.error("Invalid zoneid");
      return;
    }

    const props: AdStreamPropsWithZone = {
      zoneId,
      adstreamKey: "", // initially empty, to be set later via setter
      aspectRatio: this.getAttribute("aspectratio") ?? "600 / 336",
      height: this.parseJsonAttribute("height"),
      width: this.getAttribute("width") ?? "100%",
      boxShadow: Number(this.getAttribute("boxshadow") ?? "1"),
      sx: this.parseJsonAttribute("sx"),
      errorText: this.getAttribute("errortext") ?? "Failed to load ad.",
    };

    const element = React.createElement(AdStreamWithRef, {
      ...props,
      ref: this.ref,
    });

    const root = ReactDOMClient.createRoot(this);
    root.render(element);
  }

  setAdstreamKey(key: string) {
    if (this.ref.current?.setAdstreamKey) {
      this.ref.current.setAdstreamKey(key);
    } else {
      console.warn("AdStream component not ready yet.");
    }
  }

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
