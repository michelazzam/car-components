export function capitalizeWord(str: string) {
  return str.toLocaleLowerCase().charAt(0).toUpperCase() + str.slice(1);
}
