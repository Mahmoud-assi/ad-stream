# AdStream

[![npm version](https://img.shields.io/npm/v/adstream.svg)](https://www.npmjs.com/package/adstream)
[![license](https://img.shields.io/npm/l/adstream.svg)](LICENSE)

A simple and flexible ad-streaming component for React. Supports both single ad display and multi-zone ad carousels.

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
      loader={<div>Loading...<div/>}
    />
  );
}

export default App;
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

| Prop          | Type               | Description                            |
| ------------- | ------------------ | -------------------------------------- |
| `zoneId`      | `number`           | The ad zone ID                         |
| `loader`      | `ReactNode`        | Optional loader fallback               |
| `height`      | `number \| object` | Responsive height                      |
| `width`       | `number \| string` | Width of the ad component              |
| `aspectRatio` | `string`           | CSS aspect ratio for responsive layout |
| `boxShadow`   | `number`           | MUI shadow level                       |
| `sx`          | `SxProps<Theme>`   | Additional style overrides             |

---
