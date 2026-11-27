// 章ごとの lint（教材では中身を説明しない）。React 編で、フックの決まりと依存配列の警告を読むために使う。
//   npm run lint R03
// ルールは .oxlintrc.json の 2 つだけ（rules-of-hooks と exhaustive-deps。ESLint の react-hooks と同じ名前・同じ内容）。
// ツールは oxlint。typescript-eslint が TypeScript 7 に対応したら ESLint へ入れ替えるかを考える
// （docs/react-design.md の「lint」）。入れ替えるのは、このファイルと設定ファイルだけにする。
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { findChapterDir, printList } from "./chapters.ts";

const arg = process.argv[2];
if (arg === undefined) {
  console.log("章IDを指定してください。例: npm run lint R03\n");
  printList();
  process.exit(1);
}

const dir = findChapterDir(arg);
if (dir === undefined) {
  console.log(`章 "${arg}" が見つかりません。npm run lint で一覧を確認してください。`);
  process.exit(1);
}

const oxlint = join("node_modules", "oxlint", "bin", "oxlint");
console.log(`\n=== lint（${dir}） ===\n`);
// npm install をしていないと oxlint がない。そのまま進むと、警告が 0 件に見えてしまう
if (!existsSync(oxlint)) {
  console.log("oxlint が見つかりません。リポジトリ直下で npm install を実行してから、もう一度試してください。");
  process.exit(1);
}

const result = spawnSync(process.execPath, [oxlint, "-c", ".oxlintrc.json", "-f", "default", dir], { encoding: "utf8" });
const output = `${result.stdout}${result.stderr}`;
const found = /Found (\d+) warnings? and (\d+) errors?\./.exec(output);
if (found === null) {
  console.log(output.trimEnd());
  console.log("\nlint を実行できませんでした。npm install を実行してから、もう一度試してください。");
  process.exit(1);
}

// 警告とエラーの本体だけを出す（件数と、かかった時間の行は、下の「結果」に言い直す）
const body = output
  .split("\n")
  .filter((line) => !/^Found \d+ warnings? and \d+ errors?\./.test(line) && !/^Finished in /.test(line))
  .join("\n")
  .trim();
const warnings = Number(found[1]);
const errors = Number(found[2]);
if (body !== "") console.log(`  ${body}\n`);

console.log("=== 結果 ===");
console.log(warnings + errors === 0 ? "lint: OK（警告はありません）" : `lint: エラー ${errors} 件、警告 ${warnings} 件`);
process.exit(warnings + errors === 0 ? 0 : 1);
