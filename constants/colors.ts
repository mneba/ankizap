// ============================================
// WORDFLOW - DESIGN TOKENS
// ============================================

export const Colors = {
  // Background
  bg: {
    primary: '#0A0A1A',
    secondary: '#12122A',
    tertiary: '#1A1A3E',
    card: '#16163A',
    elevated: '#1E1E4A',
  },

  // Brand
  brand: {
    primary: '#6C5CE7',
    secondary: '#A29BFE',
    light: '#DDD6FE',
    dark: '#4C3EC7',
    gradient: ['#6C5CE7', '#A29BFE'] as const,
  },

  // Accent
  accent: {
    green: '#00D48A',
    greenBg: '#00D48A15',
    red: '#FF6B6B',
    redBg: '#FF6B6B15',
    blue: '#4ECDC4',
    blueBg: '#4ECDC415',
    yellow: '#FECA57',
    yellowBg: '#FECA5715',
    orange: '#FF9F43',
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B8D0',
    tertiary: '#7878A0',
    muted: '#50506A',
    inverse: '#0A0A1A',
  },

  // Borders
  border: {
    primary: '#2A2A5A',
    secondary: '#1E1E4A',
    focus: '#6C5CE7',
  },

  // Status
  status: {
    success: '#00D48A',
    error: '#FF6B6B',
    warning: '#FECA57',
    info: '#4ECDC4',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  title: 28,
  hero: 34,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
