import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Skeleton, Box } from "@mui/material";
import AdComponent, { type AdComponentProps } from "./AdComponent";
import { HmacSHA256 } from "crypto-js";
import hex from "crypto-js/enc-hex";

export interface AdStreamPropsWithZone
  extends Omit<AdComponentProps, "htmlContent"> {
  /**
   * The zone ID used to fetch the ad HTML.
   */
  zoneId: number;

  /**
   * Secret key provided by Add-Stream team for API authentication.
   * Contact Add-Stream support to obtain your key.
   */
  adstreamKey: string;

  /**
   * Optional custom loading component instead of Skeleton.
   */
  loader?: React.ReactNode;

  /**
   * Optional custom error message to show if ad fails to load.
   * @default "Failed to load ad."
   */
  errorText?: React.ReactNode;
}

// Methods exposed via `ref`
export interface AdStreamRef {
  setAdstreamKey: (key: string) => void;
}

/**
 * Single Ad with Zone ID
 */
const AdStream = forwardRef<AdStreamRef, AdStreamPropsWithZone>(
  (
    {
      zoneId,
      adstreamKey,
      loader,
      aspectRatio = "600 / 336",
      height = { xs: 200, sm: 225, md: 275, lg: 336 },
      width = "100%",
      boxShadow = 1,
      errorText = "Failed to load ad.",
      sx = { borderRadius: 1 },
    },
    ref
  ) => {
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const [key, setKey] = useState<string | undefined>(adstreamKey);

    // ✅ Expose setAdstreamKey via ref
    useImperativeHandle(ref, () => ({
      setAdstreamKey: (newKey: string) => setKey(newKey),
    }));

    useEffect(() => {
      if (!key) return;

      const fetchAd = async () => {
        try {
          const timestamp = Math.floor(Date.now() / 1000);
          const signature = HmacSHA256(`timestamp=${timestamp}`, key).toString(
            hex
          );
          const res = await fetch(
            `https://addstream.net/www/delivery/afr.php?zoneid=${zoneId}&cb=${Math.floor(
              Math.random() * 999999
            )}`,
            {
              method: "GET",
              headers: {
                signature,
                timestamp: String(timestamp),
              },
            }
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
          setHtmlContent(fullHTML);
        } catch (err) {
          console.error("Failed to fetch ad for zone", zoneId, err);
          setError(true);
        }
      };

      fetchAd();
    }, [zoneId, key]);

    if (error) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height,
            width,
            boxShadow,
            bgcolor: "grey.100",
            ...sx,
          }}
        >
          {errorText}
        </Box>
      );
    }

    if (!htmlContent) {
      return (
        loader || (
          <Skeleton
            variant="rectangular"
            sx={{
              aspectRatio,
              height,
              width,
              boxShadow,
              ...sx,
            }}
          />
        )
      );
    }

    return (
      <AdComponent
        aspectRatio={aspectRatio}
        boxShadow={boxShadow}
        width={width}
        height={height}
        sx={{ ...sx }}
        htmlContent={htmlContent}
      />
    );
  }
);

export default AdStream;
