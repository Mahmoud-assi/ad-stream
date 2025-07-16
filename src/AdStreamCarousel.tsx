import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { Box, Skeleton, Stack } from "@mui/material";
import AdComponent, { type AdComponentProps } from "./AdComponent";
import useAdStream from "./useAdStream";
import type { KeenSliderOptions } from "keen-slider";
import "keen-slider/keen-slider.min.css";

// Component Props Interface
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
     * Props passed to <AdStream />
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
    /** Custom dot indicators */
    dots?: React.ReactNode;

    /** Custom navigation arrows */
    navigation?: React.ReactNode;
  };

  /**
   * Keen Slider configuration override
   */
  sliderOptions?: KeenSliderOptions;

  /** Enables or disables autoplay
   *  Default: "true"
   */
  autoplay?: boolean;

  /** Interval in ms between slides
   *  Default: "4000"
   */
  autoplayInterval?: number;
}

//  Default values
const defaultAdProps: Partial<AdComponentProps> = {
  aspectRatio: "600 / 336",
  height: { xs: 200, sm: 225, md: 275, lg: 336 },
  width: "100%",
  boxShadow: 1,
};

const defaultNavColors = {
  arrowColor: "rgba(0, 0, 0, 0.6)",
  dotColor: "rgba(0, 0, 0, 0.3)",
  dotActiveColor: "primary.main",
};

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

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

  const { ads, loading } = useAdStream(zoneIds);
  const [sliderRef, instanceRef] =
    useKeenSlider<HTMLDivElement>(mergedSliderOptions);

  useEffect(() => {
    if (!autoplay || !instanceRef.current) return;

    const id = setInterval(() => {
      instanceRef.current?.next();
    }, autoplayInterval ?? 4000);

    return () => clearInterval(id);
  }, [autoplay, autoplayInterval, instanceRef.current]);

  return (
    <Stack position="relative">
      {loading ? (
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
            slots.navigation
          ) : (
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
            slots.dots
          ) : (
            <Stack mt={1} direction="row" spacing={1} justifyContent="center">
              {Array.from({
                length: instanceRef.current.track.details?.slides.length ?? 0,
              }).map((_, idx) => (
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

// ✅ SVG Arrow Component (reused from your original)
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
