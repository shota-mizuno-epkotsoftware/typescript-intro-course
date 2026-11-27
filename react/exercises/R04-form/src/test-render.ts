// テストの道具。.tsx のコンポーネントを読み込み、props から HTML の文字列を作る。
// 中身は読まなくてよい（テストでは loadModule と、renderHtml か renderLines を呼ぶだけ）。
import { createElement } from "react";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

// src からのパスで .tsx のファイルを読み込む。例: loadModule<typeof import("./App.tsx")>("App.tsx")
export async function loadModule<Module>(file: string): Promise<Module> {
  const server = await createServer({
    root: import.meta.dirname,
    configFile: false,
    logLevel: "silent",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true },
  });
  try {
    // 読み込んだものの型は、呼び出す側が <typeof import(...)> で指定する
    return (await server.ssrLoadModule(`/${file}`)) as Module;
  } finally {
    await server.close();
  }
}

// コンポーネントに props を渡したときの HTML を返す
export function renderHtml<Props extends object>(component: (props: Props) => ReactNode, props: Props): string {
  return renderToStaticMarkup(createElement(component, props));
}

// renderHtml の結果を、タグの切れ目で 1 行ずつに分けた配列で返す（テストの失敗の表示で、違う行だけが見えるようにする）
export function renderLines<Props extends object>(component: (props: Props) => ReactNode, props: Props): string[] {
  return renderHtml(component, props).replaceAll("><", ">\n<").split("\n");
}
