# AdStream

[![npm version](https://img.shields.io/npm/v/adstream.svg)](https://www.npmjs.com/package/adstream)
[![license](https://img.shields.io/npm/l/adstream.svg)](LICENSE)

A simple and flexible ad-streaming component for React. Supports both single ad display and multi-zone ad carousels.

---

## ✨ Features

- ✔ Display ads by zone ID
- ✔ Responsive single ad (`<AdStream />`)
- ✔ Carousel for multiple zones (`<AdStreamCarousel />`)
- ✔ Custom loader and error fallback
- ✔ Modular ad fetching utility and React hook (`useAdStream` / `fetchAds`)
- ✔ Can be used in plain HTML via Web Components

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
      <AdStreamCarousel zoneIds={[6, 17, 18]} />
    </div>
  );
}

export default App;
```

### Single Ad with Zone ID

```tsx
import React from "react";
import { AdStream } from "adstream";

function App() {
  return <AdStream zoneId={18} />;
}

export default App;
```

### Single Ad with Custom Loader and Styling

```tsx
import React from "react";
import { AdStream } from "adstream";

function App() {
  return (
    <AdStream
      zoneId={18}
      height={{ xs: 200, md: 300 }}
      boxShadow={3}
      aspectRatio="16 / 9"
      loader={<div>Loading...</div>}
    />
  );
}

export default App;
```

---

## 🎛️ Hooks & Utilities

### `useAdStream(zoneIds: number[])`

React hook that returns a list of ad HTML strings for given zone IDs.

```tsx
import { useAdStream } from "adstream";

const { ads, loading } = useAdStream([6, 17, 18]);
```

### `fetchAds(zoneIds: number[])`

Async utility function to fetch raw ad HTML strings (used internally by the hook).

```ts
import { fetchAds } from "adstream";

const ads = await fetchAds([6, 17, 18]);
```

---

## 🎛️ Customization

### AdStreamCarousel Props

| Prop                                  | Type                        | Description                                                                                    |
| ------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| `zoneIds`                             | `number[]`                  | List of ad zone IDs                                                                            |
| `slotProps.ad`                        | `Partial<AdComponentProps>` | Customize individual ads inside the carousel (e.g. `height`, `aspectRatio`, `boxShadow`, etc.) |
| `slotProps.navigation.arrowColor`     | `string`                    | Override left/right arrow color                                                                |
| `slotProps.navigation.dotColor`       | `string`                    | Inactive pagination dot color                                                                  |
| `slotProps.navigation.dotActiveColor` | `string`                    | Active pagination dot color                                                                    |
| `sliderOptions`                       | `KeenSliderOptions`         | Override Keen Slider behavior (e.g. `loop`, `slides.perView`, `spacing`, etc.)                 |

### AdStream Props

| Prop          | Type             | Description                            |                           |     |
| ------------- | ---------------- | -------------------------------------- | ------------------------- | --- |
| `zoneId`      | `number`         | The ad zone ID                         |                           |     |
| `loader`      | `ReactNode`      | Optional loader fallback               |                           |     |
| `height`      | \`number         | object\`                               | Responsive height         |     |
| `width`       | \`number         | string\`                               | Width of the ad component |     |
| `aspectRatio` | `string`         | CSS aspect ratio for responsive layout |                           |     |
| `boxShadow`   | `number`         | MUI shadow level                       |                           |     |
| `sx`          | `SxProps<Theme>` | Additional style overrides             |                           |     |
| `errorText`   | `ReactNode`      | Error message if ad fails to load      |                           |     |

---

## 🌐 Using in Plain HTML via Web Components

You can use `adstream` in any HTML file by loading the built-in Web Component.

```html
<script src="https://unpkg.com/adstream@1.0.13/dist/browser/web-component.global.js"></script>
```

### Example: Carousel with Web Component

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Add Stream Demo</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/keen-slider@6.8.5/keen-slider.min.css"
    />
  </head>
  <body>
    <script src="https://unpkg.com/adstream@1.0.13/dist/browser/web-component.global.js"></script>
    <div style="max-width: 600px; margin: 0 auto">
      <ad-stream-carousel zone-ids="[18,17]"></ad-stream-carousel>
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
    <script src="https://unpkg.com/adstream@1.0.13/dist/browser/web-component.global.js"></script>
    <div style="max-width: 600px; margin: 0 auto">
      <ad-stream zone-id="17"></ad-stream>
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
    <script src="https://unpkg.com/adstream@1.0.13/dist/browser/web-component.global.js"></script>
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
            <ad-stream zone-id="18"></ad-stream>
          </div>
          <div class="item">
            <ad-stream zone-id="17"></ad-stream>
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
