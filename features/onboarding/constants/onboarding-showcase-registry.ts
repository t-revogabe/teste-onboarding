import type { ComponentType } from "react";

import Welcome from "../components/showcase/welcome";
import Bye from "../components/showcase/bye";

// Register your showcase components here.
// Each key must match the `component` field in your schema's showcase steps.

export const ONBOARDING_SHOWCASE_REGISTRY: Record<string, ComponentType> = {
  Welcome,
  Bye,
};
