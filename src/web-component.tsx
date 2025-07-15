// src/web-component.tsx
import React from "react";
import * as ReactDOMClient from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AdStream from "./AdStream";
import AdStreamCarousel from "./AdStreamCarousel";

// Define <add-stream>
const AddStreamElement = reactToWebComponent(AdStream, React, ReactDOMClient, {
  props: {
    zoneId: "number",
  },
});
customElements.define("ad-stream", AddStreamElement);

// Define <ad-stream-carousel>
const CarouselElement = reactToWebComponent(
  AdStreamCarousel,
  React,
  ReactDOMClient,
  {
    props: {
      zoneIds: "json", // Use "json" for arrays/objects
    },
  }
);
customElements.define("ad-stream-carousel", CarouselElement);
