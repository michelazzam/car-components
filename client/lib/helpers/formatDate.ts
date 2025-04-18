function formatDate(dateString: string) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Extract individual date components
  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if necessary
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0"); // Add leading zero if necessary
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero if necessary

  // Assemble the formatted date string
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

  return formattedDate;
}

function dateTimeToDateFormat(dateString: string) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Extract individual date components
  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if necessary
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear().toString();

  // Assemble the formatted date string
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

function formatTime(dateString: string) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Extract individual date components

  const hours = date.getHours().toString().padStart(2, "0"); // Add leading zero if necessary
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero if necessary

  // Assemble the formatted date string
  const formattedDate = `${hours}:${minutes}`;

  return formattedDate;
}

/**
 * Adjusts a Date object to account for the timezone offset and returns it in ISO format (YYYY-MM-DD).
 * @param {Date | null} date - The date to be adjusted and formatted. Can be null.
 * @returns {string | null} The adjusted and formatted date as a string, or null if input is null.
 */
function formatDateToISO(date: Date | null): string | null {
  if (date === null) {
    return null; // Return null if the input date is null to handle optional date inputs gracefully.
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  const offset = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
  const adjustedDate = new Date(date.getTime() - offset);
  return adjustedDate.toISOString().split("T")[0];
}

/**
 * Formats a date object to a string in the format "dd/MM/yyyy".
 * @param  {Date | null} date
 * @returns  {string | null}
 */
const formatDateWithSlashes = (date: Date | null | string): string | null => {
  if (!date) return null;
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`; // Format as dd/MM/yyyy
};

/**
 * Formats a date object to a string in the format "dd-MM-yyyy".
 * @param  {Date | null} date
 * @param  {boolean} reversed - Whether to reverse the order of the date components (e.g., "yyyy-MM-dd" instead of "dd-MM-yyyy").
 * @returns  {string | null}
 */

const formatDateWithDashes = (
  date: Date | null | string,
  reversed = false
): string | null => {
  if (!date) return null;
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  if (reversed) {
    return `${year}-${month}-${day}`;
  }

  return `${day}-${month}-${year}`; // Format as dd/MM/yyyy
};

export {
  formatDate,
  dateTimeToDateFormat,
  formatTime,
  formatDateToISO,
  formatDateWithDashes,
  formatDateWithSlashes,
};
