import type { Item } from "./shop.ts";
import { formatPrice } from "./shop.ts";

export function describeItem(item: Item): string {
  return `${item.name}: ${formatPrice(item.price)}`;
}

export function applyChanges(item: Item, changes: Partial<Item>): Item {
  return { ...item, ...changes };
}

export function totalByName(items: Item[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(item.name, (totals.get(item.name) ?? 0) + item.price);
  }
  return totals;
}
