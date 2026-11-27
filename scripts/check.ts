// 章ごとのテスト・型チェック（教材では中身を説明しない）
// 実務と同じく、テスト・型チェック・その両方を、別々のコマンドにする（2026-11-20）。
//   npm test M02 [practice-01]          テスト（node --test）。基礎編は npm test B06 [practice-03]
//   npm run typecheck M02 [problem-02]  型チェック（tsc --noEmit -p）。ファイル名を付けると、そのファイルの型エラーだけ
//   npm run check M02                   型チェックとテストの両方（演習・改修の最後と、コミットの前）
// 1 つ目の引数（test / typecheck / check）は package.json の scripts が渡す。
import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { findChapterDir, printList } from "./chapters.ts";
import { basicsTests, checkBasics } from "./basics-check.ts";

const mode = process.argv[2];
const arg = process.argv[3];
const target = process.argv[4];
const command = mode === "test" ? "npm test" : `npm run ${mode}`;

if (mode !== "test" && mode !== "typecheck" && mode !== "check") {
  console.log("使い方: npm test 章ID / npm run typecheck 章ID / npm run check 章ID");
  process.exit(1);
}
if (arg === undefined) {
  console.log(`章IDを指定してください。例: ${command} M02（本編）、${command} P01（実践編）${mode === "test" ? "、npm test B01（基礎編）" : ""}\n`);
  printList();
  process.exit(1);
}

const dir = findChapterDir(arg);
if (dir === undefined) {
  console.log(`章 "${arg}" が見つかりません。${command} で一覧を確認してください。`);
  process.exit(1);
}

// 範囲は、拡張子を除いたファイル名で指定する（practice-01、problem-02）
if (target !== undefined && !/^(practice|problem)-\d+$/.test(target)) {
  console.log(`"${target}" は指定できません。practice-01 や problem-02 のように、拡張子を除いたファイル名で指定します。`);
  process.exit(1);
}

// ---------- 基礎編（.js。型チェックをせず、演習ごとの合否を短く表示する） ----------
if (!existsSync(join(dir, "tsconfig.json")) && basicsTests(dir).length > 0) {
  if (mode === "typecheck") {
    console.log("基礎編は型チェックをしません。答え合わせは npm test で行います。");
    process.exit(1);
  }
  if (target !== undefined && !target.startsWith("practice-")) {
    console.log(`"${target}" は指定できません。practice-01 のように、演習のファイル名で指定します。`);
    process.exit(1);
  }
  const number = target === undefined ? undefined : Number(/\d+/.exec(target)?.[0]);
  const results = checkBasics(dir, number);
  if (results.length === 0) {
    // 画面で確かめる演習（テストのない演習）を指定したときは、そのことを知らせる
    if (target !== undefined && existsSync(join(dir, `${target}.js`))) {
      console.log(`演習 ${number} には、答え合わせがありません。本文の「画面で確かめること」で確かめます。`);
    } else {
      console.log(`${target}.js が見つかりません。`);
    }
    process.exit(1);
  }
  const passed = results.filter((ok) => ok).length;
  console.log("");
  // 演習の数を言う（テストの検査の数と見間違えないように）。1 つだけ答え合わせしたときは、その演習の合否だけを言う
  if (passed < results.length) {
    console.log(number !== undefined ? `結果: 演習 ${number} は不合格です。✖ の行の下の説明を見て直します。` : `結果: 答え合わせをする演習 ${results.length} 個のうち、${passed} 個が合格です。`);
  } else if (number !== undefined) console.log(`結果: 演習 ${number} は合格です。`);
  else {
    // テストのない演習（画面で確かめる演習）がある章では、「すべて」と言わない
    const untested = readdirSync(dir)
      .filter((file) => /^practice-\d+\.js$/.test(file) && !existsSync(join(dir, file.replace(".js", ".test.js"))))
      .map((file) => Number(/\d+/.exec(file)?.[0]));
    if (untested.length === 0) console.log("結果: この章の演習は、すべて合格です。");
    else console.log(`結果: 答え合わせをした演習は、すべて合格です。演習 ${untested.join("・")} は、本文の「画面で確かめること」で確かめます。`);
  }
  process.exit(passed === results.length ? 0 : 1);
}

// ---------- 本編・実践編 ----------
if (mode === "check" && target !== undefined) {
  console.log("npm run check は章全体を調べます。ファイルを絞るときは、npm test か npm run typecheck を使います。");
  process.exit(1);
}
if (target !== undefined && mode === "typecheck" && !existsSync(join(dir, `${target}.ts`))) {
  console.log(`${dir}/${target}.ts が見つかりません。`);
  process.exit(1);
}

// tsc の表示を 1 件ずつに分ける（2 行目以降は字下げされた補足）
function errorBlocks(output: string): string[] {
  const blocks: string[] = [];
  for (const line of output.split("\n")) {
    if (line.trim() === "") continue;
    if (/^\s/.test(line) && blocks.length > 0) blocks[blocks.length - 1] += `\n${line}`;
    else blocks.push(line);
  }
  return blocks;
}

// 型チェック。実務の tsc --noEmit -p と同じ（設定の noEmit は tsconfig.base.json にある）
function typecheck(only?: string): boolean {
  const shown = `tsc --noEmit -p ${dir}`;
  console.log(`\n=== 型チェック（${shown}）${only === undefined ? "" : `：${only}.ts の型エラーだけを表示`} ===\n`);
  const tsc = join("node_modules", "typescript", "bin", "tsc");
  // npm install をしていないと tsc がない。そのまま進むと、型エラーが 0 件に見えて合格してしまう
  if (!existsSync(tsc)) {
    console.log("TypeScript が見つかりません。リポジトリ直下で npm install を実行してから、もう一度試してください。");
    return false;
  }
  // 端末でも本文と同じ「ファイル(行,列): error」の形で表示する
  const result = spawnSync(process.execPath, [tsc, "--noEmit", "-p", dir!, "--pretty", "false"], { encoding: "utf8" });
  let errors = errorBlocks(`${result.stdout}${result.stderr}`);
  // tsc が型エラー以外の理由で失敗したとき（設定の誤りなど）も、合格にしない
  if (result.status !== 0 && errorBlocks(`${result.stdout}${result.stderr}`).length === 0) {
    console.log("型チェックを実行できませんでした。npm install を実行してから、もう一度試してください。");
    return false;
  }
  if (only !== undefined) errors = errors.filter((block) => (block.split("\n")[0] ?? "").includes(`${only}.ts(`));
  for (const block of errors) console.log(block);
  if (errors.length === 0) console.log("型エラーはありません。");
  return errors.length === 0;
}

// テストの表示：テストごとの ✔ / ✖ と、実装した関数の失敗だけを出す
function printTestResult(output: string): void {
  const marker = "✖ failing tests:";
  const [summary = "", failures = ""] = output.split(marker);
  const results = summary.split("\n").filter((line) => /^[✔✖] /.test(line)).map((line) => line.replace(/ \([\d.]+ms\)$/, ""));
  const todo = "TODO: ここを実装してください";
  const blocks = failures.split(/^(?=test at )/m).filter((block) => block.trim() !== "");
  const notWritten = (line: string) => blocks.some((block) => block.includes(line.slice(2)) && block.includes(todo));
  for (const line of results) console.log(notWritten(line) ? `${line}（まだ実装していません）` : line);
  const details = blocks.filter((block) => !block.includes(todo));
  if (details.length > 0) {
    console.log("\n--- 失敗の内容 ---\n");
    for (const block of details) {
      // エラーが起きた場所の一覧（at で始まる行）は省く
      console.log(block.split("\n").filter((line) => !/^\s+at /.test(line)).map((line) => line.replace(/ \([\d.]+ms\)$/, "")).join("\n").trimEnd(), "\n");
    }
    // テストのファイルそのものが実行できなかったとき（書き間違いで読み込めない、など）は、理由が出ないので、調べ方を知らせる
    if (details.some((block) => /\.test\.ts[^\n]*\n\s*'test failed'/.test(block))) {
      console.log(`ファイルの名前の行が ✖ のときは、テストを実行する前にエラーが起きています。npm run typecheck ${arg} で、書き間違いがないかを調べます。\n`);
    }
  }
}

// テスト。テストは、フォルダの直下か、その下のフォルダ（アプリの src/ など）にある
function test(only?: string): boolean | undefined {
  const files = readdirSync(dir!, { recursive: true })
    .map(String)
    .filter((file) => file.endsWith(".test.ts"))
    .filter((file) => only === undefined || file.replace(/^.*[\\/]/, "") === `${only}.test.ts`);
  if (files.length === 0) {
    console.log(only === undefined ? "\n=== テスト：この章にはテストがありません ===" : `\n${only}.test.ts が見つかりません。`);
    return only === undefined ? undefined : false;
  }
  const paths = files.map((file) => join(dir!, file));
  console.log(`\n=== テスト（node --test ${only === undefined ? `${dir}/**/*.test.ts` : paths.join(" ")}） ===\n`);
  const result = spawnSync(process.execPath, ["--test", "--test-reporter=spec", ...paths], { encoding: "utf8" });
  printTestResult(`${result.stdout}${result.stderr}`);
  return result.status === 0;
}

const typeOk = mode === "test" ? undefined : typecheck(target);
const testOk = mode === "typecheck" ? undefined : test(target);

console.log("\n=== 結果 ===");
if (typeOk !== undefined) console.log(`型チェック: ${typeOk ? "OK" : "エラーあり"}`);
if (mode !== "typecheck") console.log(`テスト: ${testOk === undefined ? "なし" : testOk ? "OK" : "不合格あり"}`);
if (!existsSync(join(dir, "tsconfig.json"))) console.log(`注意: ${dir}/tsconfig.json がありません。`);
process.exit(typeOk !== false && testOk !== false ? 0 : 1);
