// Core color palette for Tilx

/** Shared type for passing either the light or dark color object to createStyles() */
export type AppColors = Record<string, string>;

export const Colors = {
  // Brand
  primary: '#1A73E8',
  primaryDark: '#0D47A1',
  primaryLight: '#E8F0FE',

  // Neutrals
  black: '#0A0A0A',
  white: '#FFFFFF',
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',

  // Semantic
  success: '#34A853',
  error: '#EA4335',
  warning: '#FBBC04',
  info: '#1A73E8',

  // Surface
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export const DarkColors = {
  ...Colors,
  surface: '#1A1A1A',
  surfaceVariant: '#2C2C2C',
  black: '#FFFFFF',
  white: '#0A0A0A',
  grey50: '#1A1A1A',
  grey100: '#2C2C2C',
  grey200: '#3C3C3C',
  grey300: '#4C4C4C',
  grey400: '#6C6C6C',
  grey500: '#8C8C8C',
  grey600: '#ABABAB',
  grey700: '#C0C0C0',
  grey800: '#D5D5D5',
  grey900: '#EFEFEF',
} as const;

export type ColorKey = keyof typeof Colors;
