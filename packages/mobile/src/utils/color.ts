/**
 * Color utility functions for client-side color operations
 */

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    '#' +
    [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')
  );
};

/**
 * Calculate perceived brightness of a color (0-255)
 * Uses the W3C formula for relative luminance
 */
export const getPerceivedBrightness = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return r * 0.299 + g * 0.587 + b * 0.114;
};

/**
 * Returns true if the color is considered dark (needs white text)
 */
export const isDarkColor = (hex: string): boolean => {
  return getPerceivedBrightness(hex) < 128;
};

/**
 * Adjust brightness of a hex color
 * @param hex - hex color string
 * @param amount - positive to lighten, negative to darken (-255 to 255)
 */
export const adjustBrightness = (hex: string, amount: number): string => {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, Math.min(255, r + amount)),
    Math.max(0, Math.min(255, g + amount)),
    Math.max(0, Math.min(255, b + amount)),
  );
};

/**
 * Adjust warmth of a hex color
 * Positive values add warmth (more red/yellow), negative adds coolness (more blue)
 */
export const adjustWarmth = (hex: string, amount: number): string => {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, Math.min(255, r + amount)),
    g,
    Math.max(0, Math.min(255, b - amount)),
  );
};

/**
 * Mix two colors with a given ratio (0-1, where 0 = color1, 1 = color2)
 */
export const mixColors = (hex1: string, hex2: string, ratio: number): string => {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return rgbToHex(
    r1 + (r2 - r1) * ratio,
    g1 + (g2 - g1) * ratio,
    b1 + (b2 - b1) * ratio,
  );
};

/**
 * Generate a simple complementary color
 */
export const getComplementary = (hex: string): string => {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(255 - r, 255 - g, 255 - b);
};

/**
 * Format a hex color for display (uppercase with #)
 */
export const formatHex = (hex: string): string => {
  return hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
};
