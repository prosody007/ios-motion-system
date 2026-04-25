"use client";

import { ButtonScalePreview, ButtonHighlightPreview, ButtonDepthPreview } from "./button-previews";
import { SpringMatchedGeometryPreview } from "./spring-previews";
import { SpringPlaygroundPreview } from "./spring-playground/preview";
import { SheetPreview, SheetSwitchPreview } from "./sheet-preview";
import { NavPushPreview } from "./nav-preview";
import {
  TogglePreview,
  ToggleIconPreview,
  ToggleSegmentedPreview,
} from "./toggle-preview";
import { LoadingPreview } from "./loading-preview";
import { HapticImpactPreview, HapticPairingPreview, HapticSelectionPreview, HapticIncreaseDecreasePreview } from "./haptic-previews";
import { ZoomTransitionPreview, MatchedGeometryPreview, FullScreenCoverPreview } from "./transition-previews";
import { AnyTransitionPreview, ViewModifierTransitionPreview, VCTransitionPreview } from "./custom-transition-previews";
import { CheckboxPreview, ConsentCheckPreview, RadioPreview } from "./checkbox-preview";
import { SegmentedPreview } from "./segmented-preview";
import { SliderPreview, StepperPreview } from "./slider-preview";
import { TextFieldFocusPreview, TextFieldShakePreview } from "./textfield-preview";
import { TabBarBouncePreview, TabBarBadgePreview } from "./tabbar-preview";
import { PullRefreshPreview } from "./pull-refresh-preview";
import { SwipeDismissPreview } from "./swipe-dismiss-preview";
import { SwipeCardsPreview } from "./swipe-cards-preview";
import { HeroPreview } from "./hero-preview";
import { CounterTextPreview, CounterCustomPreview } from "./counter-preview";
import { ScrollHeaderPreview, ScrollParallaxPreview } from "./scroll-driven-preview";
import { KeyframePreview } from "./keyframe-preview";
import { PhasePreview } from "./phase-preview";
import { LottiePreview } from "./lottie-preview";
import { ActionSheetPreview } from "./action-sheet-preview";
import { TooltipPreview } from "./tooltip-preview";
import { DropdownPreview } from "./dropdown-preview";
import { NotificationBannerPreview } from "./notification-banner-preview";

import { SuccessCheckPreview, ErrorShakePreview } from "./success-error-preview";
import { ToastPreview, SnackbarPreview } from "./toast-preview";
import { AlertPreview } from "./alert-preview";
import { CardExpandPreview, CardFlipPreview } from "./card-flip-preview";
import { CarouselPreview, CarouselPeekPreview, CarouselScalePreview, CarouselCoverFlowPreview } from "./carousel-preview";
import { SkeletonPreview } from "./skeleton-preview";
import { ProgressBarPreview, ProgressRingPreview } from "./progress-preview";
import { ReorderPreview } from "./reorder-preview";
import { StaggerPreview } from "./stagger-preview";
import { ExpandablePreview } from "./expandable-preview";
import { GenericPreview } from "./generic-preview";

const previewMap: Record<string, React.ComponentType> = {
  "ios-btn-scale": ButtonScalePreview,
  "ios-btn-highlight": ButtonHighlightPreview,
  "ios-btn-depth": ButtonDepthPreview,
  "ios-spring-playground": SpringPlaygroundPreview,
  "ios-spring-matched-geometry": SpringMatchedGeometryPreview,
  "ios-sheet-bottom": SheetPreview,
  "ios-sheet-switch": SheetSwitchPreview,
  "ios-nav-push": NavPushPreview,
  "ios-toggle-demo": TogglePreview,
  "ios-toggle-icon": ToggleIconPreview,
  "ios-toggle-segmented": ToggleSegmentedPreview,
  "ios-loading-spinner": LoadingPreview,
  "ios-haptic-impact": HapticImpactPreview,
  "ios-haptic-notification": HapticPairingPreview,
  "ios-haptic-selection": HapticSelectionPreview,
  "ios-haptic-increase-decrease": HapticIncreaseDecreasePreview,
  "ios-page-nav-transition": ZoomTransitionPreview,
  "ios-page-matched-geometry": MatchedGeometryPreview,
  "ios-page-fullscreen": FullScreenCoverPreview,
  "ios-custom-any-transition": AnyTransitionPreview,
  "ios-custom-modifier": ViewModifierTransitionPreview,
  "ios-custom-vc-transition": VCTransitionPreview,
  // Batch 1
  "ios-checkbox": CheckboxPreview,
  "ios-consent-check": ConsentCheckPreview,
  "ios-radio": RadioPreview,
  "ios-segmented": SegmentedPreview,
  "ios-slider": SliderPreview,
  "ios-stepper": StepperPreview,
  "ios-textfield-focus": TextFieldFocusPreview,
  "ios-textfield-shake": TextFieldShakePreview,
  // Batch 2
  "ios-tabbar-bounce": TabBarBouncePreview,
  "ios-tabbar-badge": TabBarBadgePreview,
  "ios-pull-refresh": PullRefreshPreview,
  // Batch 3
  "ios-reorder": ReorderPreview,
  "ios-stagger": StaggerPreview,
  "ios-expandable": ExpandablePreview,
  // Batch 4
  "ios-card-expand": CardExpandPreview,
  "ios-card-flip": CardFlipPreview,
  "ios-carousel": CarouselPreview,
  "ios-carousel-peek": CarouselPeekPreview,
  "ios-carousel-scale": CarouselScalePreview,
  "ios-carousel-coverflow": CarouselCoverFlowPreview,
  "ios-skeleton": SkeletonPreview,
  "ios-progress-bar": ProgressBarPreview,
  "ios-progress-ring": ProgressRingPreview,
  // Batch 5

  "ios-success-check": SuccessCheckPreview,
  "ios-error-shake": ErrorShakePreview,
  "ios-toast": ToastPreview,
  "ios-snackbar": SnackbarPreview,
  "ios-alert": AlertPreview,
  // Batch 6
  "ios-action-sheet": ActionSheetPreview,
  "ios-tooltip": TooltipPreview,
  "ios-dropdown": DropdownPreview,
  "ios-notification": NotificationBannerPreview,
  // Batch 7 — gestures, hero, advanced
  "ios-swipe-dismiss": SwipeDismissPreview,
  "ios-swipe-cards": SwipeCardsPreview,
  "ios-hero": HeroPreview,
  "ios-counter-text": CounterTextPreview,
  "ios-counter-custom": CounterCustomPreview,
  "ios-scroll-header": ScrollHeaderPreview,
  "ios-scroll-parallax": ScrollParallaxPreview,
  "ios-keyframe": KeyframePreview,
  "ios-phase": PhasePreview,
  "ios-lottie": LottiePreview,
};

export function AnimationPreview({ id }: { id: string }) {
  const Component = previewMap[id];
  if (Component) return <Component />;
  return <GenericPreview label={id} />;
}
