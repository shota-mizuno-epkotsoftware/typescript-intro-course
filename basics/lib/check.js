// 基礎編の答え合わせの道具（テストのファイルが使う。教材では中身を説明しない）
//
// 使い方（practice-01.test.js の中で）:
//   const t = exercise(import.meta.url);
//   t.output("そのまま実行する", ["合計: 360円"]);              // 演習ファイルを実行して、表示を比べる
//   t.output("price を 500 にする", ["合計: 1500円"], { price: 500 }); // 先頭の const price = ...; を差し替えて実行する
//   const { total } = await t.load();                            // 演習ファイルの関数を読み込む（第6章から）
//   t.equal("total([100, 200]) は 300", () => total([100, 200]), 300);
//   t.done();
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";

// 値を、本文と同じ書き方で表示する（文字列は " で囲む。長い配列やオブジェクトは、要素ごとに改行する）
function show(value, indent = "") {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "function") return "（関数そのもの。呼び出しの ( ) を付け忘れていないか見直してください）";
  if (value === null || typeof value !== "object") return String(value);
  const isArray = Array.isArray(value);
  const parts = isArray ? value.map((item) => show(item, `${indent}  `)) : Object.entries(value).map(([key, item]) => `${key}: ${show(item, `${indent}  `)}`);
  if (parts.length === 0) return isArray ? "[]" : "{}";
  const [open, close] = isArray ? ["[", "]"] : ["{", "}"];
  const oneLine = `${open} ${parts.join(", ")} ${close}`;
  if (oneLine.length <= 72 && !oneLine.includes("\n")) return oneLine;
  return `${open}\n${parts.map((part) => `${indent}  ${part}`).join(",\n")}\n${indent}${close}`;
}

// エラーの表示から、場所・その行・エラーの文までを取り出す（「at ...」の行より前）
function errorSummary(stderr) {
  const lines = stderr.split("\n");
  const end = lines.findIndex((line) => /^\s+at /.test(line));
  return (end === -1 ? lines : lines.slice(0, end))
    .filter((line) => !line.startsWith("Node.js v"))
    .join("\n")
    .trim()
    .replace(/\n(\s*\n)+/g, "\n\n"); // 印がないエラーで、空行が続かないようにする
}

export function exercise(testUrl) {
  const testPath = fileURLToPath(testUrl);
  const dir = dirname(testPath);
  const fileName = basename(testPath).replace(".test.js", ".js");
  const filePath = join(dir, fileName);
  const number = Number(/(\d+)\.js$/.exec(fileName)?.[1] ?? 0);
  const failures = [];

  // 演習ファイルの中身から、コメントと空白を取り除いたもの
  const code = () =>
    readFileSync(filePath, "utf8").split("\n").map((line) => line.replace(/\/\/.*$/, "")).join("\n").replace(/[ \t]/g, "");
  const fail = (title, detail) => failures.push(`  ✖ ${title}\n${detail.map((line) => `      ${line}`).join("\n")}`);

  // 演習ファイルを実行する。inputs があれば、「const 名前 = 値;」の行を差し替えた一時ファイルを実行する
  function run(inputs) {
    let target = filePath;
    let tmp;
    if (inputs !== undefined) {
      let source = readFileSync(filePath, "utf8");
      for (const [name, value] of Object.entries(inputs)) {
        const line = new RegExp(`^(const|let) ${name} = [^;\\n]*;`, "m");
        if (!line.test(source)) return { missing: name };
        source = source.replace(line, (_, keyword) => `${keyword} ${name} = ${JSON.stringify(value)};`);
      }
      tmp = mkdtempSync(join(realpathSync(tmpdir()), "basics-"));
      target = join(tmp, fileName);
      writeFileSync(target, source);
    }
    const result = spawnSync(process.execPath, [target], { encoding: "utf8", timeout: 5000 });
    if (tmp !== undefined) rmSync(tmp, { recursive: true, force: true });
    // エラーの表示の中のファイルの場所を、「basics/exercises/.../practice-01.js」の短い形にそろえる
    const shown = relative(process.cwd(), filePath).replaceAll("\\", "/");
    const fix = (text) => {
      let fixed = text;
      for (const path of [target, filePath]) fixed = fixed.replaceAll(pathToFileURL(path).href, shown).replaceAll(path, shown);
      return fixed;
    };
    return {
      lines: fix(result.stdout).replace(/\n$/, "").split("\n").filter((line, i, all) => !(all.length === 1 && line === "")),
      error: result.status === 0 ? "" : errorSummary(fix(result.stderr)),
      timedOut: result.error?.code === "ETIMEDOUT",
    };
  }

  return {
    // 実行したときの表示が、expected（行の配列）と同じかを検査する
    output(title, expected, inputs) {
      if (failures.length > 0) return; // 1 つ目の不合格だけを表示する（同じ原因を繰り返し表示しない）
      const result = run(inputs);
      if (result.missing !== undefined) {
        fail(title, [`ファイルの先頭の「const ${result.missing} = 値;」の行が見つかりません。この行は、最初の書き方に戻してください。`]);
        return;
      }
      if (result.timedOut) {
        fail(title, ["5 秒たっても終わりませんでした。繰り返しが終わらなくなっていないか、見直してください。"]);
        return;
      }
      if (result.error !== "") {
        const shown = result.lines.length > 0 ? ["エラーの前までの表示:", ...result.lines.map((line) => `  ${line}`)] : [];
        fail(title, ["エラーで止まりました:", ...result.error.split("\n").map((line) => `  ${line}`), ...shown]);
        return;
      }
      if (result.lines.join("\n") !== expected.join("\n")) {
        fail(title, [
          "期待した表示:",
          ...expected.map((line) => `  ${line}`),
          "実際の表示:",
          ...(result.lines.length > 0 ? result.lines.map((line) => `  ${line}`) : ["  （何も表示されていません）"]),
          ...(inputs === undefined ? [] : ["（答え合わせが、先頭の変数の値を変えて実行した結果です。期待した表示と比べて違う行や足りない行を探し、その行を表示するコードを見直してください。数を直接書いていると、ここで不合格になります）"]),
        ]);
      }
    },

    // 演習ファイルの書き方を検査する（答えを直接書いていないか、など）。コメントの行は見ない
    // 空白は取り除いてから調べる（80*2 と 80 * 2 を同じに扱う）。表示が合ってから調べる
    uses(title, pattern, message) {
      if (failures.length > 0) return;
      if (!pattern.test(code())) fail(title, [message]);
    },

    // 関数 fn の中で、names の関数を呼んでいるかを検査する（ファイルの下の、試す行は見ない）
    calls(fnName, fn, ...names) {
      if (failures.length > 0) return;
      const body = String(fn).replace(/\/\/.*$/gm, "");
      const missing = names.filter((name) => !new RegExp(`\\b${name}\\s*\\(`).test(body));
      if (missing.length > 0) {
        fail(`${fnName} の中で ${missing.join(" と ")} を呼ぶ`, [`${fnName} の中で、関数 ${missing.join(" と ")} を呼んでください。同じ計算を、もう一度書く必要はありません。`]);
      }
    },

    // uses の逆。その書き方を使っていたら不合格にする
    avoids(title, pattern, message) {
      if (failures.length > 0) return;
      if (pattern.test(code())) fail(title, [message]);
    },

    // 演習ファイルを読み込んで、export された関数を返す。読み込めないときは、理由を表示して終わる
    // names を渡すと、その名前の関数があるかも検査する（例: await t.load("total", "countOver")）
    async load(...names) {
      // 演習ファイルの中で試しに書いた console.log は、答え合わせの間は表示しない
      const log = console.log;
      console.log = () => {};
      try {
        const loaded = await import(pathToFileURL(filePath).href);
        console.log = log;
        const missing = names.filter((name) => typeof loaded[name] !== "function");
        if (missing.length > 0) {
          console.log(`演習 ${number}  不合格`);
          console.log(`  ✖ 関数 ${missing.join("、")} が見つかりません\n      関数の名前と、その前の export を、最初の書き方から変えていないか見直してください。`);
          process.exit(1);
        }
        return loaded;
      } catch (error) {
        console.log = log;
        // 実行し直して、場所の付いたエラーの表示を得る（書き方の間違いも、関数を試す行のエラーも、ここで分かる）
        const result = spawnSync(process.execPath, [filePath], { encoding: "utf8", timeout: 5000 });
        const shown = relative(process.cwd(), filePath).replaceAll("\\", "/");
        const detail = (result.status === 0 ? `${error?.name}: ${error?.message}` : errorSummary(result.stderr))
          .replaceAll(pathToFileURL(filePath).href, shown)
          .replaceAll(filePath, shown)
          .replace(/\n(\s*\n)+/g, "\n\n");
        console.log(`演習 ${number}  不合格`);
        console.log(`  ✖ ${fileName} が、エラーで止まりました\n${detail.split("\n").map((line) => `      ${line}`).join("\n")}`);
        process.exit(1);
      }
    },

    // call() の戻り値が expected と同じかを検査する
    equal(title, call, expected) {
      if (failures.length > 0) return; // 1 つ目の不合格だけを表示する
      let actual;
      const log = console.log;
      console.log = () => {};
      try {
        actual = call();
        console.log = log;
      } catch (error) {
        console.log = log;
        // エラーが起きた演習ファイルの行を、スタックトレースから取り出す
        const line = new RegExp(`${fileName.replaceAll(".", "\\.")}:(\\d+):\\d+`).exec(String(error?.stack))?.[1];
        fail(title, [`エラーで止まりました: ${error?.name}: ${error?.message}`, ...(line === undefined ? [] : [`場所: ${fileName} の ${line} 行目`])]);
        return;
      }
      if (!isDeepStrictEqual(actual, expected)) {
        const hint = actual === undefined ? ["（undefined は「値がない」ことを表します。return で値を返しているか、返している値の名前やつづりが合っているかを見直してください）"] : [];
        // 配列やオブジェクトが複数行になるときは、見出しの下に字下げして並べる
        const block = (label, value) => {
          const text = show(value);
          return text.includes("\n") ? [`${label}:`, ...text.split("\n").map((line) => `  ${line}`)] : [`${label}: ${text}`];
        };
        fail(title, [...block("期待した値", expected), ...block("実際の値  ", actual), ...hint]);
      }
    },

    done() {
      if (failures.length === 0) {
        console.log(`演習 ${number}  合格`);
        return;
      }
      console.log(`演習 ${number}  不合格`);
      console.log(failures.join("\n"));
      process.exitCode = 1;
    },
  };
}
