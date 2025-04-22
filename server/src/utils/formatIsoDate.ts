/**
 * Formats a given date (Date object or 'YYYY-MM-DD' string) to 'YYYY-MM-DD' format.
 *
 * @param input - The date to format, either a Date object or a string in 'YYYY-MM-DD' format.
 * @returns A string representing the date in 'YYYY-MM-DD' format.
 */
export function getFormattedDate(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toISOString().split('T')[0];
}
