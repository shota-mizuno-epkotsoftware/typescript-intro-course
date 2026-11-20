import { readFile } from "node:fs/promises";

export async function sumFile(path: string): Promise<number> {
  const text = await readFile(path, "utf8");
  const lines = text.trim().split("\n");
  return lines.reduce((sum, line) => sum + Number(line), 0);
}

export async function reportFile(path: string): Promise<string> {
  try {
    const total = await sumFile(path);
    return `合計: ${total}`;
  } catch (e) {
    if (e instanceof Error) {
      return `読み込めません: ${e.message}`;
    }
    return "不明なエラー";
  }
}
