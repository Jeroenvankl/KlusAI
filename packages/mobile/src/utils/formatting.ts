/**
 * Dutch formatting utilities for KlusAI
 */

/**
 * Format a price in Dutch euro format
 * e.g., 1234.56 -> "€1.234,56"
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Format a number with Dutch locale (comma as decimal separator)
 */
export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format square meters
 * e.g., 12.5 -> "12,5 m²"
 */
export const formatArea = (m2: number): string => {
  return `${formatNumber(m2, 1)} m²`;
};

/**
 * Format liters
 * e.g., 5.0 -> "5,0 L"
 */
export const formatLiters = (liters: number): string => {
  return `${formatNumber(liters, 1)} L`;
};

/**
 * Format percentage
 * e.g., 0.72 -> "72%"
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

/**
 * Format a date in Dutch locale
 * e.g., "7 februari 2025"
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Format a date relative to now (Dutch)
 * e.g., "2 uur geleden", "gisteren"
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Zojuist';
  if (minutes < 60) return `${minutes} min geleden`;
  if (hours < 24) return `${hours} uur geleden`;
  if (days === 1) return 'Gisteren';
  if (days < 7) return `${days} dagen geleden`;
  return formatDate(date);
};

/**
 * Truncate a string to a max length with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
