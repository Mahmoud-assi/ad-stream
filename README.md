# AdStream

[![npm version](https://img.shields.io/npm/v/adstream.svg)](https://www.npmjs.com/package/adstream)
[![license](https://img.shields.io/npm/l/adstream.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue.svg)](#)

A simple and flexible ad-streaming component for React. Supports both single ad display and multi-zone ad carousels.

---

## ✨ Features

- ✔ Display ads by zone ID
- ✔ Responsive single ad (`<AdStream />`)
- ✔ Carousel for multiple zones (`<AdStreamCarousel />`)
- ✔ Custom loader and error fallback
- ✔ Modular ad fetching utility and React hook (`useAdStream` / `fetchAds`)
- ✔ Can be used in plain HTML via Web Components
- ✔ Can be embedded in `Flutter` using WebView
- ✔ Use `useAdStream` directly with `AdComponent` for advanced layouts

---

## 🚀 Installation

```bash
npm install adstream
# or
yarn add adstream
```

---

## 📦 Usage

### Carousel (Multiple Ads)

```tsx
import React from "react";
import { AdStreamCarousel } from "adstream";

function App() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <AdStreamCarousel zoneIds={[100, 200, 300]} />
    </div>
  );
}

export default App;
```

### Carousel (Multiple Ads) - all props example

```tsx
import React from "react";
import { AdStreamCarousel } from "adstream";
import { Box, Button } from "@mui/material";

const CustomDots = ({
  selectedStep,
  steps,
  onClick,
}: {
  selectedStep: number;
  steps: number;
  onClick: (idx: number) => void;
}) => (
  <Box display="flex" justifyContent="center" mt={2} gap={2}>
    {Array.from({ length: steps }).map((_, idx) => (
      <Box
        key={idx}
        onClick={() => onClick(idx)}
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: selectedStep === idx ? "blue" : "gray",
          cursor: "pointer",
          border: "2px solid black",
        }}
      />
    ))}
  </Box>
);

const CustomNavigation = ({
  onPrev,
  onNext,
  disabledPrev,
  disabledNext,
  currentSlide,
  totalSlides,
}: {
  onPrev: () => void;
  onNext: () => void;
  disabledPrev: boolean;
  disabledNext: boolean;
  currentSlide: number;
  totalSlides: number;
}) => (
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      px: 2,
      pointerEvents: "auto",
      zIndex: 10,
      alignItems: "center",
    }}
  >
    <Button onClick={onPrev} disabled={disabledPrev} variant="outlined">
      Prev
    </Button>

    <Box sx={{ color: arrowColor, fontWeight: "bold" }}>
      {currentSlide + 1} / {totalSlides}
    </Box>

    <Button
      onClick={onNext}
      disabled={disabledNext}
      sx={{ color: arrowColor }}
      variant="outlined"
    >
      Next
    </Button>
  </Box>
);

export default function Demo() {
  return (
    <Box maxWidth={600} margin="0 auto">
      <AdStreamCarousel
        zoneIds={[100, 200, 300]} // example ad zones
        autoplay={true}
        autoplayInterval={3000}
        sliderOptions={{
          loop: false,
          slides: { perView: 1, spacing: 12 },
        }}
        slotProps={{
          ad: {
            aspectRatio: "16 / 9",
            boxShadow: 3,
          },
          navigation: {
            arrowColor: "green", // color of the arrows if there is no custom navigations!
            bgcolor: "grey", // background of the steps!
            unselectedColor: "lightgray",
            selectedColor: "darkgreen",
          },
        }}
        // example slots: optional!
        slots={{
          dots: ({ selectedStep, steps, onClick }) => (
            <CustomDots
              selectedStep={selectedStep}
              steps={steps}
              onClick={onClick}
            />
          ),
          navigation: ({
            onPrev,
            onNext,
            disabledPrev,
            disabledNext,
            currentSlide,
            totalSlides,
          }) => (
            <CustomNavigation
              onPrev={onPrev}
              onNext={onNext}
              disabledPrev={disabledPrev}
              disabledNext={disabledNext}
              currentSlide={currentSlide}
              totalSlides={totalSlides}
            />
          ),
        }}
      />
    </Box>
  );
}
```

### Single Ad with Zone ID

```tsx
import React from "react";
import { AdStream } from "adstream";

function App() {
  return <AdStream zoneId={200} />;
}

export default App;
```

### Single Ad with Zone ID - all props example

```tsx
import React from "react";
import { AdStream } from "adstream";

function App() {
  return (
    <AdStream
      zoneId={200}
      height={{ xs: 200, md: 300, lg: 400, xl: 500 }}
      width="100%"
      aspectRatio="4 / 3"
      boxShadow={4}
      sx={{ borderRadius: 12, backgroundColor: "#fafafa" }}
      loader={<div>Loading single ad...</div>}
      errorText={<div>Oops! Could not load the ad.</div>}
    />
  );
}

export default App;
```

### integration with Next.js, both for:

✅ Pages Router (with SSR-safe dynamic import)
Use `next/dynamic` to safely render AdStream client-side only:

```tsx
// components/SafeAdStreamWrapper.tsx
import React from "react";
import { AdStreamCarousel } from "adstream";
import { useTheme } from "@emotion/react";

const SafeAdStreamWrapper = () => {
  const { colors } = useTheme();
  return (
    <AdStreamCarousel
      zoneIds={[100, 200, 300]}
      slotProps={{
        ad: {
          height: { xs: 200, md: 336 },
          aspectRatio: "16 / 9",
          boxShadow: 2,
          sx: { borderRadius: 0 },
          width: "100%",
        },
        navigation: {
          selectedColor: colors.secondary,
          bgColor: "",
        },
      }}
      slots={{
        navigation: () => null,
      }}
      sliderOptions={{
        loop: true,
        slides: { perView: 1, spacing: 10 },
      }}
      autoplay
      autoplayInterval={3000}
    />
  );
};

export default SafeAdStreamWrapper;

// Then import it dynamically in your page:

// pages/index.tsx or any route
import dynamic from "next/dynamic";

const SafeAdStreamCarousel = dynamic(
  () => import("../components/SafeAdStreamWrapper"),
  {
    ssr: false,
    loading: () => <div>Loading ads...</div>,
  }
);

export default function HomePage() {
  return (
    <div>
      <h2>Dashboard</h2>
      <SafeAdStreamCarousel />
    </div>
  );
}
```

---

✅ App Router (`/app/page.tsx`)
With App Router, make sure to mark the component with `"use client"` and import AdStream normally:

```tsx
// app/demo/page.tsx
"use client";

import { AdStreamCarousel } from "adstream";
import { Stack } from "@mui/material";

export default function Demo() {
  return (
    <Stack spacing={2} maxWidth={600} margin="0 auto">
      <AdStreamCarousel
        zoneIds={[100, 200, 300]}
        autoplay
        autoplayInterval={3000}
        sliderOptions={{
          loop: false,
          slides: { perView: 1, spacing: 12 },
        }}
        slotProps={{
          ad: {
            aspectRatio: "16 / 9",
            boxShadow: 3,
          },
        }}
      />
    </Stack>
  );
}
```

---

### Using `useAdStream` with `AdComponent`

If you prefer manual control or want a custom layout (instead of using `AdStreamCarousel`), you can use `useAdStream` along with `AdComponent` directly:

```tsx
import React from "react";
import { useAdStream, AdComponent } from "adstream";

function CustomLayout() {
  const { ads, loading } = useAdStream([6, 17, 18]);

  if (loading) return <div>Loading ads...</div>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {ads.map(
        (html, index) =>
          html && (
            <AdComponent key={index} htmlContent={html} aspectRatio="16 / 9" />
          )
      )}
    </div>
  );
}

export default CustomLayout;
```

---

## 🎛️ Hooks & Utilities

### `useAdStream(zoneIds: number[])`

React hook that returns a list of ad HTML strings for given zone IDs.

```tsx
import { useAdStream } from "adstream";
const zoneIds = useMemo(() => [100, 200, 300], []);
const { ads, loading } = useAdStream(zoneIds);
```

### `fetchAds(zoneIds: number[])`

Async utility function to fetch raw ad HTML strings (used internally by the hook).

```ts
import { fetchAds } from "adstream";

const ads = await fetchAds([100, 200, 300]);
```

---

## 🎛️ Customization

### AdStreamCarousel Props

| Prop                                   | Type                        | Description                                                                                    |
| -------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| `zoneIds`                              | `number[]`                  | List of ad zone IDs                                                                            |
| `direction`                            | `"ltr"` \| `"rtl"`          | Optional layout direction override. If not provided, defaults to MUI theme direction.          |
| `slotProps.ad`                         | `Partial<AdComponentProps>` | Customize individual ads inside the carousel (e.g. `height`, `aspectRatio`, `boxShadow`, etc.) |
| `slotProps.navigation.arrowColor`      | `string`                    | Override left/right arrow color                                                                |
| `slotProps.navigation.unselectedColor` | `string`                    | Inactive pagination dot color                                                                  |
| `slotProps.navigation.selectedColor`   | `string`                    | Active pagination dot color                                                                    |
| `slotProps.navigation.bgColor`         | `string`                    | Background color behind pagination dots                                                        |
| `sliderOptions`                        | `KeenSliderOptions`         | Override Keen Slider behavior (e.g. `loop`, `slides.perView`, `spacing`, etc.)                 |
| `autoplay`                             | `boolean`                   | Enable or disable autoplay                                                                     |
| `autoplayInterval`                     | `number`                    | Interval in milliseconds for autoplay                                                          |
| `slots.dots`                           | `ReactNode` or `function`   | Custom pagination dots. Can be a component or render function                                  |
| `slots.navigation`                     | `ReactNode` or `function`   | Custom navigation arrows. Can be a component or render function                                |
|                                        |

---

### AdStream Props

| Prop          | Type             | Description                            |                           |
| ------------- | ---------------- | -------------------------------------- | ------------------------- |
| `zoneId`      | `number`         | The ad zone ID                         |                           |
| `loader`      | `ReactNode`      | Optional loader fallback               |                           |
| `height`      | \`number         | object\`                               | Responsive height         |
| `width`       | \`number         | string\`                               | Width of the ad component |
| `aspectRatio` | `string`         | CSS aspect ratio for responsive layout |                           |
| `boxShadow`   | `number`         | MUI shadow level                       |                           |
| `sx`          | `SxProps<Theme>` | Additional style overrides             |                           |
| `errorText`   | `ReactNode`      | Error message if ad fails to load      |                           |

---

## 🌐 Using in Plain HTML via Web Components

You can use `adstream` in any HTML file by loading the built-in Web Component.

```html
<script src="https://unpkg.com/adstream/dist/browser/web-component.global.js"></script>
```

### Example: Carousel with Web Component

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Add Stream Demo</title>
  </head>
  <body>
    <script src="https://unpkg.com/adstream/dist/browser/web-component.global.js"></script>
    <div style="max-width: 600px; margin: 0 auto">
      <ad-stream-carousel
        zoneids="[100, 200, 300]"
        slotprops='{
        "ad": {
          "aspectRatio": "600 / 336",
          "height": {"xs": 200, "sm": 225, "md": 275, "lg": 336},
          "width": "100%",
          "boxShadow": 2,
          "sx": {"borderRadius": 2}
        },
        "navigation": {
          "bgColor": "rgba(0,0,0,0.2)",
          "selectedColor": "primary.main",
          "unselectedColor": "grey.300",
          "arrowColor": "blue"
          }
        },
        "wrapper": { "px": 2, "py": 3 },
        "steps": { "mt": 2 }'
        slideroptions='{
          "initial": 0,
          "loop": true,
          "slides": {"perView": 1, "spacing": 10}
        }'
        autoplay="true"
        autoplayinterval="4000"
        direction="ltr"
      ></ad-stream-carousel>
    </div>
  </body>
</html>
```

### Example: Single Ad with Web Component

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Add Stream Demo</title>
  </head>
  <body>
    <script src="https://unpkg.com/adstream/dist/browser/web-component.global.js"></script>
    <div style="max-width: 600px; margin: 0 auto">
      <ad-stream
        zoneid="200"
        aspectratio="16 / 9"
        height='{"xs": 200, "md": 300}'
        width="100%"
        box-shadow="2"
        sx='{"borderRadius":3,"backgroundColor":"#fafafa"}'
        error-text="Oops! Could not load the ad."
      ></ad-stream>
    </div>
  </body>
</html>
```

### Example: Bootstrap Carousel Integration

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Add Stream Demo</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
    />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <script src="https://unpkg.com/adstream/dist/browser/web-component.global.js"></script>
  </head>
  <body>
    <div class="container">
      <h2>Add Stream Demo</h2>
      <div id="myCarousel" class="carousel slide" data-ride="carousel">
        <!-- Indicators -->
        <ol class="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
          <li data-target="#myCarousel" data-slide-to="1"></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner">
          <div class="item active">
            <ad-stream zoneid="100"></ad-stream>
          </div>
          <div class="item">
            <ad-stream zoneid="200"></ad-stream>
          </div>
        </div>

        <!-- Controls -->
        <a class="left carousel-control" href="#myCarousel" data-slide="prev">
          <span class="glyphicon glyphicon-chevron-left"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="right carousel-control" href="#myCarousel" data-slide="next">
          <span class="glyphicon glyphicon-chevron-right"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div>
  </body>
</html>
```

---

## 📱 Use with Flutter WebView

AdStream Web Components work in any mobile app that can render HTML — including **Flutter apps** using a WebView.

### ✅ Example using `webview_flutter`

Install the package:

```bash
flutter pub add webview_flutter
```

Then use the widget:

```dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class AdStreamWebView extends StatelessWidget {
  final int zoneId;

  const AdStreamWebView({super.key, required this.zoneId});

  @override
  Widget build(BuildContext context) {
    final html = '''
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/adstream/dist/browser/web-component.global.js"></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <ad-stream
        zoneid="200"
        aspectratio="16 / 9"
        height='{"xs": 200, "md": 300}'
        width="100%"
        sx='{"borderRadius": 1}'
        ></ad-stream>
      </body>
    </html>
    ''';

    return WebViewWidget(
      controller: WebViewController()
        ..loadHtmlString(html)
        ..setJavaScriptMode(JavaScriptMode.unrestricted),
    );
  }
}
```

✅ This can be used in both Android and iOS. Just be sure you:

- Enable **JavaScript**
- Set proper height on the WebView
- Use `ad-stream-carousel` instead of `ad-stream` if you want rotating zones

---
