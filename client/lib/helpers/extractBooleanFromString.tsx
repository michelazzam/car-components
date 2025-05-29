export const extractBooleanFromString = (
  value: string | undefined | null
): boolean | undefined => {
  if (
    value === undefined ||
    value === null ||
    (value !== "true" && value !== "false")
  )
    return undefined;
  return value === "true";
};
