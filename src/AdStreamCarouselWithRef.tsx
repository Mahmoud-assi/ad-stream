import { forwardRef, useImperativeHandle, useState } from "react";
import AdStreamCarousel, { AdStreamCarouselProps } from "./AdStreamCarousel";

export interface AdStreamCarouselRef {
  setAdstreamKey: (key: string) => void;
}

const AdStreamCarouselWithRef = forwardRef<
  AdStreamCarouselRef,
  Omit<AdStreamCarouselProps, "adstreamKey">
>((props, ref) => {
  const [key, setKey] = useState<string | undefined>(undefined);

  useImperativeHandle(ref, () => ({
    setAdstreamKey: setKey,
  }));

  return <AdStreamCarousel {...props} adstreamKey={key ?? ""} />;
});

export default AdStreamCarouselWithRef;
