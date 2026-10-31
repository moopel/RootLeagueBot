export interface ContainsOptions {
  ignoreCase?: boolean;
}

export function contains(
  text: string,
  search: string,
  options: ContainsOptions = {},
): boolean {
  if (options.ignoreCase) {
    return text.toLowerCase().includes(search.toLowerCase());
  }

  return text.includes(search);
}
