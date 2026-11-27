// 章IDから演習フォルダを探す（check.ts と dev.ts で共有。教材では中身を説明しない）
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// 編ごとの演習フォルダ。章IDの記号（本編は記号なし）で編を区別する
export const courses = [
  { prefix: "B", name: "基礎編", dir: "basics/exercises" },
  { prefix: "M", name: "本編", dir: "main/exercises" },
  { prefix: "P", name: "実践編", dir: "practice/exercises" },
  { prefix: "R", name: "React編", dir: "react/exercises" },
  { prefix: "S", name: "サーバー編", dir: "server/exercises" },
  { prefix: "A", name: "発展編", dir: "advanced/exercises" },
];

// 実践編で読むアプリの完成版（npm run dev app / npm run check app などで使う）
export const practiceApp = join("practice", "app");

// React 編で読むアプリの完成版（npm run dev rapp / npm run check rapp / npm run lint rapp）
export const reactApp = join("react", "app");

// 実践編と React 編で、同じ内容にしておくファイル（react-design.md の基本方針 3「ロジックはそのまま使い回す」）
export const sharedAppFiles = [
  "style.css",
  "public/categories.json",
  ...["types", "validate", "state", "summary", "format", "storage", "categories", "testdata"].map((name) => `src/${name}.ts`),
  ...["validate", "state", "summary", "format", "storage", "categories"].map((name) => `src/${name}.test.ts`),
];

export function chaptersOf(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => /^[A-Z]\d\d-/.test(name)).sort();
}

export function printList(): void {
  console.log("章の一覧:");
  for (const course of courses) {
    const chapters = chaptersOf(course.dir);
    if (chapters.length === 0) continue;
    console.log(`  ${course.name}`);
    for (const name of chapters) console.log(`    ${name}`);
  }
}

// "M2" / "M02" → 本編の "main/exercises/M02-..."、"p1" → 実践編の "practice/exercises/P01-..."。見つからなければ undefined
export function findChapterDir(arg: string): string | undefined {
  // 実践編で読むアプリの完成版
  if (arg.toLowerCase() === "app") return existsSync(practiceApp) ? practiceApp : undefined;
  // React 編で読むアプリの完成版
  if (arg.toLowerCase() === "rapp") return existsSync(reactApp) ? reactApp : undefined;
  const match = /^([A-Za-z])(\d{1,2})$/.exec(arg);
  const course = match ? courses.find((c) => c.prefix === match[1]?.toUpperCase()) : undefined;
  const chapter =
    match && course
      ? chaptersOf(course.dir).find((name) => name.startsWith(`${course.prefix}${match[2]?.padStart(2, "0")}-`))
      : undefined;
  return course && chapter ? join(course.dir, chapter) : undefined;
}
