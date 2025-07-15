import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Skeleton, type SxProps, type Theme } from "@mui/material";
import Slider, { type Settings } from "react-slick";
import AdComponent, { type AdComponentProps } from "./AdComponent";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Steps, { type StepsProps } from "./Steps";

/**
 * Props for the AdStreamCarousel component.
 */
export interface AdStreamCarouselProps {
  /**
   * Array of zone IDs for which ads should be fetched.
   */
  zoneIds: number[];

  /**
   * Optional custom styling for the carousel wrapper.
   */
  sx?: SxProps<Theme>;

  /**
   * Optional slotProps to customize sub-components like ads, step indicators, and slider.
   */
  slotProps?: {
    /**
     * Props for the internal <AdComponent /> used for each ad.
     * Defaults:
     * {
     *   aspectRatio: "600 / 336",
     *   height: { xs: 200, sm: 225, md: 275, lg: 336 },
     *   width: "100%",
     *   boxShadow: 1
     * }
     */
    ad?: Omit<AdComponentProps, "htmlContent">;

    /**
     * Props for the <Steps /> indicator component.
     * Defaults:
     * {
     *   bgColor: "rgba(0,0,0,0.125)",
     *   selectedColor: "primary.main",
     *   unselectedColor: "grey.500"
     * }
     */
    steps?: Partial<Omit<StepsProps, "selectedStep" | "steps" | "onClick">>;

    /**
     * Props for the react-slick <Slider /> component.
     * Defaults:
     * {
     *   initialSlide: 0,
     *   autoplay: true,
     *   autoplaySpeed: 5000,
     *   arrows: false,
     *   infinite: true,
     *   pauseOnHover: true,
     *   swipe: true,
     *   draggable: true,
     *   lazyLoad: "anticipated"
     * }
     */
    slider?: Partial<Settings>;
  };
}

/**
 * A carousel that displays multiple ads retrieved from a remote server.
 */
const AdStreamCarousel: React.FC<AdStreamCarouselProps> = ({
  zoneIds,
  sx,
  slotProps = {},
}) => {
  const { ad: adProps, steps: stepsProps, slider: sliderProps } = slotProps;

  const [ads, setAds] = useState<(string | null)[]>([]);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const slideRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      const results = await Promise.all(
        zoneIds.map(async (zoneId) => {
          try {
            const res = await fetch(
              `https://addstream.net/www/delivery/afr.php?zoneid=${zoneId}&cb=${Math.floor(
                Math.random() * 999999
              )}`
            );
            const data = await res.text();
            const fullHTML = `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <style>
                    body { margin: 0; padding: 0; overflow: hidden; }
                    img { width: 100%; height: 100%; object-fit: fill; }
                  </style>
                </head>
                <body>${data}</body>
              </html>
            `;
            return fullHTML;
          } catch (e) {
            console.error("Ad fetch error for zone:", zoneId, e);
            return null;
          }
        })
      );
      setAds(results);
    };

    fetchAds();
  }, [zoneIds]);

  // Default slider settings merged with user-provided sliderProps
  const defaultSliderSettings: Settings = {
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000, // 5 seconds
    arrows: false,
    infinite: true,
    pauseOnHover: true,
    swipe: true,
    draggable: true,
    lazyLoad: "anticipated",
    beforeChange: (_: number, next: number) => setSelectedSlide(next),
  };

  const sliderSettings = { ...defaultSliderSettings, ...sliderProps };

  return (
    <Box position="relative" sx={{ width: "100%", ...sx }}>
      <Slider ref={slideRef} {...sliderSettings}>
        {ads.length === 0
          ? zoneIds.map((_, idx) => (
              <Box key={idx}>
                <Skeleton
                  variant="rectangular"
                  sx={{
                    borderRadius: 2,
                    minHeight: adProps?.height ?? {
                      xs: 200,
                      sm: 225,
                      md: 275,
                      lg: 336,
                    },
                    maxHeight: adProps?.height ?? {
                      xs: 200,
                      sm: 225,
                      md: 275,
                      lg: 336,
                    },
                    width: adProps?.width ?? "100%",
                    boxShadow: adProps?.boxShadow ?? 1,
                  }}
                />
              </Box>
            ))
          : ads.map((html, idx) =>
              html ? (
                <Stack direction="row" key={idx}>
                  <AdComponent {...adProps} htmlContent={html} />
                </Stack>
              ) : (
                <Box key={idx}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      borderRadius: 2,
                      minHeight: adProps?.height ?? {
                        xs: 200,
                        sm: 225,
                        md: 275,
                        lg: 336,
                      },
                      maxHeight: adProps?.height ?? {
                        xs: 200,
                        sm: 225,
                        md: 275,
                        lg: 336,
                      },
                      width: adProps?.width ?? "100%",
                      boxShadow: adProps?.boxShadow ?? 1,
                    }}
                  />
                </Box>
              )
            )}
      </Slider>

      <Steps
        selectedStep={selectedSlide}
        steps={zoneIds.length}
        onClick={(step) => {
          setSelectedSlide(step);
          slideRef.current?.slickGoTo(step);
        }}
        {...stepsProps}
      />
    </Box>
  );
};

export default AdStreamCarousel;
