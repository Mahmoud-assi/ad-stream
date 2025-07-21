// src/web-components/ad-stream-element.tsx
import React, { createRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import AdStream, { AdStreamPropsWithZone } from "./AdStream"; // adjust path if needed

// Helper: safely parse JSON attributes
const parseJSONAttr = (value: string | null): unknown => {
  try {
    return value ? JSON.parse(value) : undefined;
  } catch {
    console.warn("Invalid JSON:", value);
    return undefined;
  }
};

export class AdStreamElement extends HTMLElement {
  private root: ReactDOMClient.Root | null = null;
  private ref = createRef<{ setAdstreamKey: (key: string) => void }>();
  private props: Partial<AdStreamPropsWithZone> = {};

  static get observedAttributes() {
    return [
      "zoneid",
      "aspectratio",
      "height",
      "width",
      "boxshadow",
      "sx",
      "errortext",
      "adstreamkey",
    ];
  }

  constructor() {
    super();
    this.setAdstreamKey = this.setAdstreamKey.bind(this);
  }

  connectedCallback() {
    this.loadPropsFromAttributes();
    this.mountReactComponent();
  }

  disconnectedCallback() {
    this.root?.unmount();
  }

  attributeChangedCallback() {
    this.loadPropsFromAttributes();
    this.mountReactComponent();
  }

  private loadPropsFromAttributes() {
    const zoneIdAttr = this.getAttribute("zoneid");
    if (zoneIdAttr) {
      const parsedZoneId = parseInt(zoneIdAttr, 10);
      if (!isNaN(parsedZoneId)) {
        this.props.zoneId = parsedZoneId;
      } else {
        console.warn("Invalid 'zoneid' attribute, must be a number");
        this.props.zoneId = undefined;
      }
    } else {
      this.props.zoneId = undefined;
    }

    this.props.adstreamKey = this.getAttribute("adstreamkey") ?? undefined;
    this.props.aspectRatio = this.getAttribute("aspectratio") ?? undefined;
    this.props.width = this.getAttribute("width") ?? undefined;
    this.props.boxShadow = this.getAttribute("boxshadow")
      ? Number(this.getAttribute("boxshadow"))
      : undefined;
    this.props.errorText = this.getAttribute("errortext") ?? undefined;

    this.props.height = parseJSONAttr(this.getAttribute("height")) as
      | Partial<Record<string, number>>
      | undefined;
    this.props.sx = parseJSONAttr(this.getAttribute("sx")) as
      | import("@mui/system").SxProps<import("@mui/system").Theme>
      | undefined;
  }

  private mountReactComponent() {
    if (!this.root) {
      this.root = ReactDOMClient.createRoot(this);
    }

    if (typeof this.props.zoneId !== "number" || !this.props.adstreamKey) {
      console.warn(
        "Missing required 'zoneId' or 'adstreamKey' for AdStream component."
      );
      // Optionally render a fallback UI or clear the container
      this.root.render(null);
      return;
    }

    // Cast to full props since we validated required fields
    const element = React.createElement(AdStream, {
      ...(this.props as AdStreamPropsWithZone),
      ref: this.ref,
    });

    this.root.render(element);

    this.dispatchEvent(new CustomEvent("adstream-ready", { bubbles: true }));
  }

  // Public method to update adstreamKey dynamically
  public setAdstreamKey(key: string) {
    if (this.ref.current?.setAdstreamKey) {
      this.ref.current.setAdstreamKey(key);
    } else {
      console.warn("AdStream component not ready yet.");
    }
  }
}
