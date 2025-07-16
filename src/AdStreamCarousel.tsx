import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react.js";
import { Box, Skeleton, Stack } from "@mui/material";
import AdComponent, { AdComponentProps } from "./AdComponent";
import useAdStream from "./useAdStream";
import { KeenSliderOptions } from "keen-slider";
import useInjectKeenSliderStyles from "./useInjectKeenSliderStyles";
// import "keen-slider/keen-slider.min.css";

/**
 * Props for AdStreamCarousel component
 */
export interface AdStreamCarouselProps {
  /**
   * Array of Ad zone IDs to fetch ads for
   */
  zoneIds: number[];

  /**
   * Props to customize inner components and styles
   */
  slotProps?: {
    /**
     * Props passed to <AdComponent />
     */
    ad?: Partial<AdComponentProps>;

    /**
     * Navigation color overrides
     */
    navigation?: {
      arrowColor?: string;
      dotColor?: string;
      dotActiveColor?: string;
    };
  };

  /**
   * Override internal components like dots and navigation arrows
   */
  slots?: {
    /**
     * Custom dot indicators
     * Can be ReactNode or render function with control props
     */
    dots?:
      | React.ReactNode
      | ((props: {
          selectedStep: number;
          steps: number;
          onClick: (idx: number) => void;
        }) => React.ReactNode);

    /**
     * Custom navigation arrows
     * Can be ReactNode or render function with navigation callbacks and info
     */
    navigation?:
      | React.ReactNode
      | ((props: {
          onPrev: () => void;
          onNext: () => void;
          disabledPrev: boolean;
          disabledNext: boolean;
          currentSlide: number;
          totalSlides: number;
          arrowColor?: string;
        }) => React.ReactNode);
  };

  /**
   * Keen Slider configuration override
   */
  sliderOptions?: KeenSliderOptions;

  /**
   * Enables or disables autoplay
   * Default: true
   */
  autoplay?: boolean;

  /**
   * Interval in ms between slides
   * Default: 4000
   */
  autoplayInterval?: number;
}

// Default props for the ads
const defaultAdProps: Partial<AdComponentProps> = {
  aspectRatio: "600 / 336",
  height: { xs: 200, sm: 225, md: 275, lg: 336 },
  width: "100%",
  boxShadow: 1,
};

// Default colors for navigation arrows and dots
const defaultNavColors = {
  arrowColor: "rgba(0, 0, 0, 0.6)",
  dotColor: "rgba(0, 0, 0, 0.3)",
  dotActiveColor: "primary.main",
};

// Default Keen Slider options
const defaultSliderOptions: KeenSliderOptions = {
  initial: 0,
  loop: true,
  slides: {
    perView: 1,
    spacing: 8,
  },
};

const AdStreamCarousel: React.FC<AdStreamCarouselProps> = ({
  zoneIds,
  slotProps = {},
  sliderOptions = {},
  autoplay = true,
  autoplayInterval = 4000,
  slots = {},
}) => {
  const { ad: adProps = {}, navigation = {} } = slotProps;
  const mergedAdProps = { ...defaultAdProps, ...adProps };
  const navColors = { ...defaultNavColors, ...navigation };

  useInjectKeenSliderStyles();

  // State for current active slide index
  const [currentSlide, setCurrentSlide] = useState(0);
  // State to know when slider is initialized
  const [loaded, setLoaded] = useState(false);

  // Merge slider options with event handlers
  const mergedSliderOptions: KeenSliderOptions = {
    ...defaultSliderOptions,
    ...sliderOptions,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      sliderOptions.slideChanged?.(slider);
    },
    created(slider) {
      setLoaded(true);
      sliderOptions?.created?.(slider);
    },
  };

  // Fetch ads for given zone IDs
  const { ads, loading } = useAdStream(zoneIds);
  // Initialize Keen Slider hook
  const [sliderRef, instanceRef] =
    useKeenSlider<HTMLDivElement>(mergedSliderOptions);

  // Autoplay effect using interval
  useEffect(() => {
    if (!autoplay || !instanceRef.current) return;

    const id = setInterval(() => {
      instanceRef.current?.next();
    }, autoplayInterval ?? 4000);

    return () => clearInterval(id);
  }, [autoplay, autoplayInterval, instanceRef.current]);

  // Total number of slides available
  const totalSlides = instanceRef.current?.track.details.slides.length ?? 0;

  return (
    <Stack position="relative">
      {loading ? (
        // Show skeleton loader while ads are loading
        <Skeleton
          variant="rectangular"
          sx={{
            minHeight: mergedAdProps.height,
            maxHeight: mergedAdProps.height,
            width: mergedAdProps.width,
            boxShadow: mergedAdProps.boxShadow,
            ...mergedAdProps.sx,
          }}
        />
      ) : (
        // Render Keen Slider with fetched ads
        <Box ref={sliderRef} className="keen-slider">
          {ads.map(
            (html, idx) =>
              html && (
                <Box key={idx} className="keen-slider__slide">
                  <AdComponent {...mergedAdProps} htmlContent={html} />
                </Box>
              )
          )}
        </Box>
      )}

      {/* Render custom or default navigation arrows */}
      {loaded && instanceRef.current && (
        <>
          {slots.navigation ? (
            // If navigation slot is a function, call it with handlers and state
            typeof slots.navigation === "function" ? (
              slots.navigation({
                onPrev: () => instanceRef.current?.prev(),
                onNext: () => instanceRef.current?.next(),
                disabledPrev: false, // You can implement real disable logic here if needed
                disabledNext: false,
                currentSlide,
                totalSlides,
                arrowColor: navColors.arrowColor,
              })
            ) : (
              // If it's a ReactNode, render directly
              slots.navigation
            )
          ) : (
            // Default arrows
            <>
              <Arrow
                left
                onClick={(e) => {
                  e.stopPropagation();
                  instanceRef.current?.prev();
                }}
                disabled={false}
                color={navColors.arrowColor}
              />
              <Arrow
                onClick={(e) => {
                  e.stopPropagation();
                  instanceRef.current?.next();
                }}
                disabled={false}
                color={navColors.arrowColor}
              />
            </>
          )}
        </>
      )}

      {/* Render custom or default dots */}
      {loaded && instanceRef.current && (
        <>
          {slots.dots ? (
            // If dots slot is a function, call it with props
            typeof slots.dots === "function" ? (
              slots.dots({
                selectedStep: currentSlide,
                steps: totalSlides,
                onClick: (idx: number) => instanceRef.current?.moveToIdx(idx),
              })
            ) : (
              // If ReactNode, render as is
              slots.dots
            )
          ) : (
            // Default dots implementation
            <Stack mt={1} direction="row" spacing={1} justifyContent="center">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor:
                      currentSlide === idx
                        ? navColors.dotActiveColor
                        : navColors.dotColor,
                    cursor: "pointer",
                  }}
                />
              ))}
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
};

/**
 * SVG Arrow Component used for default navigation arrows
 */
function Arrow({
  disabled,
  left,
  onClick,
  color = "black",
}: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
  color?: string;
}) {
  const positionStyle = left ? { left: 8 } : { right: 8 };

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        ...positionStyle,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 1,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width="28"
        height="28"
      >
        {left ? (
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
        ) : (
          <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
        )}
      </svg>
    </Box>
  );
}

export default AdStreamCarousel;
