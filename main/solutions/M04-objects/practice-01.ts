export function addTag(tags: string[], tag: string): string[] {
  return [...tags, tag];
}

export function withPrice(item: { name: string; price: number }, price: number): { name: string; price: number } {
  return { ...item, price };
}

export function withCity(
  user: { name: string; address: { city: string; zip: string } },
  city: string,
): { name: string; address: { city: string; zip: string } } {
  return { ...user, address: { ...user.address, city } };
}
