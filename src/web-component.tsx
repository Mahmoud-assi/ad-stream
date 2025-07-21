// src/web-component.tsx
import React from "react";
import * as ReactDOMClient from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import AdStreamCarousel from "./AdStreamCarousel";
import AdComponent from "./AdComponent";
import { AdStreamElement } from "./ad-stream-element";

// // Define <ad-stream>
// const AddStreamElement = reactToWebComponent(AdStream, React, ReactDOMClient, {
//   props: {
//     zoneId: "number",
//     aspectRatio: "string",
//     height: "json",
//     width: "string",
//     boxShadow: "number",
//     sx: "json",
//     errorText: "string",
//     // adstreamKey: "string",
//   },
// });
// customElements.define("ad-stream", AddStreamElement);

customElements.define("ad-stream", AdStreamElement);

// Define <ad-stream-carousel>
const CarouselElement = reactToWebComponent(
  AdStreamCarousel,
  React,
  ReactDOMClient,
  {
    props: {
      zoneIds: "json", // Required
      slotProps: "json", // Pass nested ad props, nav colors
      slots: "json", // Optional custom elements
      sliderOptions: "json",
      autoplay: "boolean",
      autoplayInterval: "number",
      direction: "string",
      // adstreamKey: "string",
    },
  }
);
customElements.define("ad-stream-carousel", CarouselElement);

// Define <ad-component>
const AdComponentElement = reactToWebComponent(
  AdComponent,
  React,
  ReactDOMClient,
  {
    props: {
      htmlContent: "string",
      aspectRatio: "string",
      height: "json",
      width: "string",
      boxShadow: "number",
      sx: "json",
    },
  }
);

customElements.define("ad-component", AdComponentElement);

/* Example usage!

  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Ad Components Demo</title>
    <script type="module" src="/dist/your-bundle.js"></script>
    <!-- Replace with the actual path to your compiled bundle -->
    <style>
      body {
        font-family: sans-serif;
        padding: 2rem;
        background: #f5f5f5;
      }

      ad-stream,
      ad-stream-carousel,
      ad-component {
        display: block;
        margin-bottom: 3rem;
      }
    </style>
  </head>
  <body>
    <h2>&lt;ad-stream&gt; - Single Ad</h2>
    <ad-stream
      zoneid="123"
      aspectratio="600 / 336"
      height='{"xs": 200, "sm": 225, "md": 275, "lg": 336}'
      width="100%"
      boxshadow="2"
      sx='{"borderRadius": 8, "bgcolor": "grey.100"}'
    ></ad-stream>

    <h2>&lt;ad-stream-carousel&gt; - Carousel</h2>
    <ad-stream-carousel
      zoneids='[123, 124, 125]'
      slotprops='{
        "ad": {
          "aspectRatio": "16 / 9",
          "height": { "xs": 200, "md": 250 },
          "width": "100%",
          "boxShadow": 1
        },
        "navigation": {
          "arrowColor": "red",
          "dotColor": "gray",
          "dotActiveColor": "blue"
        }
      }'
      slots='{}'
      slideroptions='{
        "loop": true,
        "slides": { "perView": 1, "spacing": 12 }
      }'
      autoplay="true"
      autoplayinterval="5000"
    ></ad-stream-carousel>

    <h2>&lt;ad-component&gt; - Direct HTML Ad</h2>
    <ad-component
      htmlcontent="&lt;div&gt;&lt;img src='https://via.placeholder.com/300x150' /&gt;&lt;/div&gt;"
      aspectratio="600 / 336"
      height='{"xs": 200, "sm": 225, "md": 275, "lg": 336}'
      width="100%"
      boxshadow="3"
      sx='{
        "borderRadius": 12,
        "bgcolor": "white",
        "border": "1px solid #ccc"
      }'
    ></ad-component>
  </body>
</html>
*/
