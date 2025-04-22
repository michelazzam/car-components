export const itemStatuses = ["new", "used"] as const;
export const ITEM_STATUSES_OPTIONS = [
  { label: "New", value: "new" },
  { label: "Used", value: "used" },
];
export type ItemStatus = (typeof itemStatuses)[number];
