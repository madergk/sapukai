/**
 * Spacing tokens - Auto-generated from Figma
 * DO NOT EDIT DIRECTLY - Run `npm run sync-tokens` to update
 * Generated: 2026-01-21T14:42:33.279Z
 */

export const spacing = {
  "0": "0px",
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "7": "28px",
  "8": "32px",
  "9": "36px",
  "10": "40px",
  "11": "44px",
  "12": "48px",
  "14": "56px",
  "16": "64px",
  "20": "80px",
  "24": "96px",
  "28": "112px",
  "32": "128px",
  "36": "144px",
  "40": "160px",
  "44": "176px",
  "48": "192px",
  "52": "208px",
  "56": "224px",
  "60": "240px",
  "64": "256px",
  "72": "288px",
  "80": "320px",
  "96": "384px",
  "px": "1px",
  "0.5": "2px",
  "1.5": "6px",
  "2.5": "10px",
  "3.5": "14px"
} as const

export const borderRadius = {
  "none": "0px",
  "sm": "2px",
  "DEFAULT": "4px",
  "md": "6px",
  "lg": "8px",
  "xl": "12px",
  "2xl": "16px",
  "3xl": "24px",
  "full": "9999px"
} as const

export const screens = {
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1536px"
} as const

export type SpacingKey = keyof typeof spacing
export type BorderRadiusKey = keyof typeof borderRadius
export type ScreenKey = keyof typeof screens
