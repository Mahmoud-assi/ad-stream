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

<!-- ### Carousel (Multiple Ads)

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
``` -->

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
import { CircularProgress, Box } from "@mui/material";

function App() {
  return (
    <AdStream
      zoneId={18}
      height={{ xs: 200, md: 300 }}
      boxShadow={3}
      aspectRatio="16 / 9"
      loader={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            backgroundColor: "#f0f0f0",
            borderRadius: 2,
          }}
        >
          <CircularProgress />
        </Box>
      }
    />
  );
}

export default App;
```

---

## 🎛️ Customization

<!-- ### AdStreamCarousel Props

| Prop               | Type                                      | Description                                                                                                                                                                                                                     |
| ------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zoneIds`          | `number[]`                                | List of ad zone IDs                                                                                                                                                                                                             |
| `sx`               | `SxProps<Theme>`                          | MUI style overrides for the carousel wrapper                                                                                                                                                                                    |
| `slotProps.ad`     | `Partial<AdStreamProps>`                  | Custom styling and behavior for ads. **Defaults:** `{ aspectRatio: "600 / 336", height: { xs: 200, sm: 225, md: 275, lg: 336 }, width: "100%", boxShadow: 1 }`                                                                  |
| `slotProps.steps`  | `Partial<StepsProps>`                     | Custom styles for step indicators. **Defaults:** `{ bgColor: "rgba(0,0,0,0.125)", selectedColor: "primary.main", unselectedColor: "grey.500" }`                                                                                 |
| `slotProps.slider` | `Partial<import('react-slick').Settings>` | Props to customize the `react-slick` slider. **Defaults:** `{ initialSlide: 0, autoplay: true, autoplaySpeed: 5000, arrows: false, infinite: true, pauseOnHover: true, swipe: true, draggable: true, lazyLoad: "anticipated" }` | -->

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
