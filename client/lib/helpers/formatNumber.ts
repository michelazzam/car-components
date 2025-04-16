export const formatNumber = (number: number, decimals = 2): string => {
  // Return a formatted number with commas and decimal places
  // Convert the number to a fixed decimal string
  const fixedNumber = number?.toFixed(decimals);
  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = fixedNumber?.split(".");

  // Add commas to the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the formatted integer part with the decimal part
  return `${formattedInteger}${decimalPart ? "." + decimalPart : ""}`;
};

export const deformatNumber = (formattedNumber: string) => {
  // Remove commas and convert to number
  const number = parseFloat(formattedNumber.replace(/,/g, ""));
  return isNaN(number) ? 0 : number; // Handle invalid numbers gracefully
};
