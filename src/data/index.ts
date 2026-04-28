import type { SectionData } from "@/types/motion";
import { tokensSection } from "./tokens";
import { mcpServerSection } from "./mcp-server";
import { springCurvesSection } from "./springs";
import { buttonSection } from "./button";
import { springAnimationsSection } from "./spring-animations";
import { sheetSection } from "./sheet";
import { navigationSection } from "./navigation";
import { toggleSection } from "./toggle";
import { loadingSection } from "./loading";
import { hapticsSection } from "./haptics";

import { pageTransitionsSection } from "./page-transitions";
import { customTransitionsSection } from "./custom-transitions";
import { checkboxSection } from "./checkbox";
import { segmentedSection } from "./segmented";
import { sliderSection } from "./slider";
import { textfieldSection } from "./textfield";
import { tabbarSection } from "./tabbar";
import { pullRefreshSection } from "./pull-refresh";

import { reorderSection } from "./reorder";
import { staggerSection } from "./stagger";
import { expandableSection } from "./expandable";
import { cardFlipSection } from "./card-flip";
import { carouselSection } from "./carousel";

import { skeletonSection } from "./skeleton";
import { progressSection } from "./progress";

import { successErrorSection } from "./success-error";
import { toastSection } from "./toast";

import { alertSection } from "./alert";
import { actionSheetSection } from "./action-sheet";
import { tooltipSection } from "./tooltip";
import { dropdownSection } from "./dropdown";
import { notificationBannerSection } from "./notification-banner";

import { swipeDismissSection } from "./swipe-dismiss";
import { swipeCardsSection } from "./swipe-cards";
import { heroTransitionSection } from "./hero-transition";

import { counterSection } from "./counter";
import { scrollDrivenSection } from "./scroll-driven";
import { keyframeSection } from "./keyframe";
import { phaseSection } from "./phase";
import { lottieSection } from "./lottie";
import { borderGlowSection } from "./border-glow";

export const sectionMap: Record<string, SectionData> = {
  "mcp-server": mcpServerSection,
  tokens: tokensSection,
  "spring-curves": springCurvesSection,
  button: buttonSection,
  "spring-animations": springAnimationsSection,
  sheet: sheetSection,
  navigation: navigationSection,
  toggle: toggleSection,
  loading: loadingSection,
  haptics: hapticsSection,

  "page-transitions": pageTransitionsSection,
  "custom-transitions": customTransitionsSection,
  checkbox: checkboxSection,
  segmented: segmentedSection,
  slider: sliderSection,
  textfield: textfieldSection,
  tabbar: tabbarSection,
  "pull-refresh": pullRefreshSection,

  reorder: reorderSection,
  stagger: staggerSection,
  expandable: expandableSection,
  "card-flip": cardFlipSection,
  carousel: carouselSection,

  skeleton: skeletonSection,
  progress: progressSection,

  "success-error": successErrorSection,
  toast: toastSection,

  alert: alertSection,
  "action-sheet": actionSheetSection,
  tooltip: tooltipSection,
  dropdown: dropdownSection,
  "notification-banner": notificationBannerSection,

  "swipe-dismiss": swipeDismissSection,
  "swipe-cards": swipeCardsSection,
  "hero-transition": heroTransitionSection,

  counter: counterSection,
  "scroll-driven": scrollDrivenSection,
  keyframe: keyframeSection,
  phase: phaseSection,
  lottie: lottieSection,
  "border-glow": borderGlowSection,
};
