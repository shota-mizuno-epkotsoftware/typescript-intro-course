export type Product = {
  name: string;
  price: number;
};

export function namesUnder(products: Product[], limit: number): string[] {
  return products.filter((p) => p.price < limit).map((p) => p.name);
}

export function sortByPrice(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.price - b.price);
}

export function changePrice(products: Product[], name: string, price: number): Product[] {
  return products.map((p) => (p.name === name ? { ...p, price } : p));
}
