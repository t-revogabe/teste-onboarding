import type { ComponentType } from "react";

// Register your icon components here.
// Each key must match the `icon` field in your schema's select options.
//
// Example:
//   import { YouTubeIcon } from "@/assets/svgs";
//   export const ONBOARDING_ICON_REGISTRY: Record<string, ComponentType<{ width: number; height: number }>> = {
//     youtube: YouTubeIcon,
//   };

export const ONBOARDING_ICON_REGISTRY: Record<
  string,
  ComponentType<{ width: number; height: number }>
> = {};
