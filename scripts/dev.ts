// 章の画面を Vite で起動する（教材では中身を説明しない）
// 使い方: npm run dev M10（本編）/ npm run dev P01（実践編）/ npm run dev P01 answer（解答例の版）
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { basename, dirname, join, sep } from "node:path";
import { findChapterDir, printList } from "./chapters.ts";

const arg = process.argv[2];
if (arg === undefined) {
  console.log("章IDを指定してください。例: npm run dev M10\n");
  printList();
  process.exit(1);
}

const dir = findChapterDir(arg);
if (dir === undefined) {
  console.log(`章 "${arg}" が見つかりません。npm run dev で一覧を確認してください。`);
  process.exit(1);
}

// 「npm run dev P01 answer」のように answer を付けると、解答例を当てはめた版を起動する（見比べるため）
let root = dir;
if (process.argv[3] === "answer") {
  const solutionDir = dir.replace(`${sep}exercises${sep}`, `${sep}solutions${sep}`);
  if (!existsSync(solutionDir)) {
    console.log(`解答例が見つかりません: ${solutionDir}`);
    process.exit(1);
  }
  root = join(dirname(dirname(dir)), ".answer", basename(dir));
  rmSync(root, { recursive: true, force: true });
  cpSync(dir, root, { recursive: true });
  cpSync(solutionDir, root, { recursive: true });
  console.log("解答例を当てはめた版を起動します。");
}

console.log(`${root} の画面を起動します。止めるときは Ctrl + C を押してください。\n`);
const vite = join("node_modules", "vite", "bin", "vite.js");
const result = spawnSync(process.execPath, [vite, root, "--open"], { stdio: "inherit" });
process.exit(result.status ?? 0);
