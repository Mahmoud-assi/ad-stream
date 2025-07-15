import React from "react";
import { Box, type Breakpoint, type SxProps, type Theme } from "@mui/material";

export interface AdComponentProps {
  /**
   * The full HTML content of the ad to be rendered inside the iframe.
   */
  htmlContent: string;

  /**
   * The CSS aspect ratio to maintain for the ad container.
   * Default: "600 / 336"
   */
  aspectRatio?: string;

  /**
   * The height of the ad container, can be responsive breakpoints.
   * Applied as both minHeight and maxHeight.
   * Default: { xs: 200, sm: 225, md: 275, lg: 336 }
   */
  height?: Partial<Record<Breakpoint, number>>;

  /**
   * The width of the ad container.
   * Default: "100%"
   */
  width?: string;

  /**
   * The box shadow level or CSS value applied to the ad container.
   * Default: 1 (MUI boxShadow level)
   */
  boxShadow?: number | string;

  /**
   * Additional system styles to apply to the outer container Box.
   */
  sx?: SxProps<Theme>;
}

const AdComponent: React.FC<AdComponentProps> = ({
  htmlContent,
  aspectRatio = "600 / 336",
  height = { xs: 200, sm: 225, md: 275, lg: 336 },
  width = "100%",
  boxShadow = 1,
  sx,
}) => {
  const blob = new Blob([htmlContent], { type: "text/html" });
  const blobUrl = URL.createObjectURL(blob);

  return (
    <Box
      sx={{
        aspectRatio,
        overflow: "hidden",
        borderRadius: 4,
        width,
        maxHeight: height,
        minHeight: height,
        boxShadow,
        position: "relative",
        ...sx,
      }}
    >
      <Box
        component="iframe"
        src={blobUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Ad Stream"
        scrolling="no"
        aria-label="Advertisement"
      />
    </Box>
  );
};

export default React.memo(AdComponent);
