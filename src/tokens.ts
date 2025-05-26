export const COLORS = {
  accentBlue: '#0A84FF',
  errorRed: '#FF3B30',
  grey90: '#F2F2F7',
  grey60: '#8E8E93',
} as const;

export type ColorName = keyof typeof COLORS;
