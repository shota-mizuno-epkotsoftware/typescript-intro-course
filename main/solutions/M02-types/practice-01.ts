export function parsePrice(input: string): number {
  return Number(input);
}

export function addShipping(price: number): number {
  return price + 500;
}

export function formatTotal(input: string): string {
  return `${addShipping(parsePrice(input))}円`;
}
