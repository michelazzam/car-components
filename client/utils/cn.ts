//this is a custom function to join classes with tailwindcss
export function cn(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
