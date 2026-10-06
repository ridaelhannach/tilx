// Core color palette for Tilx as per PRD Section 5 & 6

export interface AppColors {
  background: string;
  secondarySurface: string;
  elevatedSurface: string;
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  primaryBorder: string;
  strongBorder: string;
  primaryAction: string;
  primaryActionText: string;
  disabledSurface: string;
  disabledText: string;
  danger: string;
  success: string;
  // Brand
  brandGradientStart: string;
  brandGradientMid: string;
  brandGradientEnd: string;
  
  // Legacy
  white: string;
  black: string;
  grey50: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey400: string;
  grey500: string;
  grey600: string;
  grey700: string;
  grey800: string;
  grey900: string;
  primary: string;
  primaryLight: string;
  error: string;
  surface: string;
}

export const Colors: AppColors = {
  background: '#FFFFFF',
  secondarySurface: '#FAFAFA',
  elevatedSurface: '#FFFFFF',
  primaryText: '#111111',
  secondaryText: '#737373',
  mutedText: '#A0A0A0',
  primaryBorder: '#E7E7E7',
  strongBorder: '#D4D4D4',
  primaryAction: '#111111',
  primaryActionText: '#FFFFFF',
  disabledSurface: '#F0F0F0',
  disabledText: '#A8A8A8',
  danger: '#D92D20',
  success: '#16803A',
  
  brandGradientStart: '#FF4D74',
  brandGradientMid: '#C840E9',
  brandGradientEnd: '#705CFF',

  // Legacy
  white: '#FFFFFF',
  black: '#000000',
  grey50: '#F8FAFC',
  grey100: '#F1F5F9',
  grey200: '#E2E8F0',
  grey300: '#CBD5E1',
  grey400: '#94A3B8',
  grey500: '#64748B',
  grey600: '#475569',
  grey700: '#334155',
  grey800: '#1E293B',
  grey900: '#0F172A',
  primary: '#111111',
  primaryLight: '#E8F0FE',
  error: '#D92D20',
  surface: '#FFFFFF',
};

export const DarkColors: AppColors = {
  background: '#0B0B0B',
  secondarySurface: '#151515',
  elevatedSurface: '#1B1B1B',
  primaryText: '#F7F7F7',
  secondaryText: '#A8A8A8',
  mutedText: '#777777',
  primaryBorder: '#292929',
  strongBorder: '#3A3A3A',
  primaryAction: '#FFFFFF',
  primaryActionText: '#111111',
  disabledSurface: '#222222',
  disabledText: '#555555',
  danger: '#D92D20',
  success: '#16803A',
  
  brandGradientStart: '#FF4D74',
  brandGradientMid: '#C840E9',
  brandGradientEnd: '#705CFF',

  // Legacy
  white: '#000000',
  black: '#FFFFFF',
  grey50: '#1E293B',
  grey100: '#334155',
  grey200: '#475569',
  grey300: '#64748B',
  grey400: '#94A3B8',
  grey500: '#CBD5E1',
  grey600: '#E2E8F0',
  grey700: '#F1F5F9',
  grey800: '#F8FAFC',
  grey900: '#FFFFFF',
  primary: '#FFFFFF',
  primaryLight: '#2C2C2C',
  error: '#D92D20',
  surface: '#1A1A1A',
};
