// 基礎編の答え合わせ（check.ts と verify.ts で共有。教材では中身を説明しない）
// 基礎編の演習は .js なので、型チェックをしない。practice-NN.test.js を 1 つずつ実行し、合格・不合格を短く表示する。
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

export function basicsTests(dir: string): string[] {
  return readdirSync(dir).filter((file) => /^practice-\d+\.test\.js$/.test(file)).sort();
}

// only は演習の番号（2 なら practice-02.test.js だけ）。quiet なら表示しない。戻り値は、演習ごとの合否
export function checkBasics(dir: string, only?: number, quiet = false): boolean[] {
  const tests = basicsTests(dir).filter((file) => only === undefined || Number(/\d+/.exec(file)?.[0]) === only);
  return tests.map((file) => {
    const result = spawnSync(process.execPath, [join(dir, file)], { stdio: quiet ? "ignore" : "inherit" });
    return result.status === 0;
  });
}
