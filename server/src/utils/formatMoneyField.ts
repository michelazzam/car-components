export const formatMoneyField = (value: number | string | undefined) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  // make sure it's a number
  if (typeof value === 'string') {
    value = Number(value.replace(/[^0-9.]/g, ''));
  }

  if (Number.isInteger(value)) {
    return value;
  }

  return Number(value.toFixed(2));
};
