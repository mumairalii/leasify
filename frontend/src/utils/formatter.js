/**
 * Formats a numerical value into a US dollar currency string.
 * @param {number | null | undefined} value - The number to format.
 * @returns {string} The formatted currency string (e.g., "$1,234.56").
 */
export const formatCurrency = (value) => {
  // Use the logical OR operator to default null/undefined values to 0.
  const number = value || 0;
  
  // Use the Intl.NumberFormat API for robust and locale-aware formatting.
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

/**
 * Add other formatters here in the future!
 * For example, a date formatter:
 * * export const formatDate = (dateString) => {
 * const date = new Date(dateString || Date.now());
 * return date.toLocaleDateString('en-US', {
 * year: 'numeric',
 * month: 'long',
 * day: 'numeric',
 * });
 * };
 */