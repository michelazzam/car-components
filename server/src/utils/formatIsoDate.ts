export function formatISODate(isoDate: Date) {
  return new Date(isoDate).toISOString().split("T")[0];
}
