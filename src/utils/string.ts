export interface ContainsOptions {
  ignoreCase?: boolean;
}

export function doesContain(text: string, search: string, options: ContainsOptions = {}): boolean {
  if (options.ignoreCase) {
    return text.toLowerCase().includes(search.toLowerCase());
  }

  return text.includes(search);
}
