export function parseCategories(data: unknown): string[] {
  if (
    typeof data !== "object" ||
    data === null ||
    !("categories" in data) ||
    !Array.isArray(data.categories)
  ) {
    throw new Error("分類のデータの形が正しくありません");
  }
  return data.categories;
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch("./categories.json");
  if (!response.ok) {
    throw new Error(`分類を読み込めませんでした（${response.status}）`);
  }
  const data: unknown = await response.json();
  return parseCategories(data);
}
