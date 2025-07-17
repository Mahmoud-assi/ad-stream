import { Box, Stack } from "@mui/material";

/**
 * Props for the Steps indicator component.
 */
export interface StepsProps {
  /** Currently selected step index (zero-based) */
  selectedStep: number;

  /** Total number of steps to render */
  steps: number;

  /** Callback when a step is clicked */
  onClick(step: number): void;

  /** Background color of the step container */
  bgColor?: string;

  /** Color of the currently selected step */
  selectedColor?: string;

  /** Color of unselected steps */
  unselectedColor?: string;
}

/**
 * A simple step indicator (e.g., for carousels).
 * Renders dots or bars for each step, highlighting the selected one.
 */
export default function Steps({
  selectedStep,
  steps,
  onClick,
  bgColor = "rgba(0,0,0,0.125)",
  selectedColor = "primary.main",
  unselectedColor = "grey.500",
}: StepsProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={0.75}
      position="absolute"
      bottom={12}
      left="50%"
      sx={{
        transform: "translateX(-50%)",
        backgroundColor: bgColor,
        borderRadius: 2,
        px: 1,
        py: 0.5,
        backdropFilter: "blur(4px)",
      }}
    >
      {Array.from({ length: steps }).map((_, idx) => {
        const isSelected = selectedStep === idx;

        return (
          <Box
            key={idx}
            role="button"
            aria-label={`Step ${idx + 1}`}
            title={`Go to step ${idx + 1}`}
            onClick={() => onClick(idx)}
            width={isSelected ? 16 : 8}
            height=".5rem"
            borderRadius={isSelected ? 2 : "50%"}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s",
              bgcolor: isSelected ? selectedColor : unselectedColor,
            }}
          />
        );
      })}
    </Stack>
  );
}
