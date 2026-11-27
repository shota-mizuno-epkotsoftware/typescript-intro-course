# つまずき集

章の本文やヒントで解決しないときに見ます。ここにないエラーは、エラーの番号（`TS2322` など）や英文をそのまま検索してください。

## 環境

| 症状 | 対処 |
| --- | --- |
| `node --version` で 24 より古い数字が出る<br>`.ts` を実行すると `Unknown file extension ".ts"` と出る | Node.js が古いです。[公式サイト](https://nodejs.org/ja) から LTS 版を入れ直し、ターミナルを開き直します |
| `tsc` や TypeScript が見つからない、と出る | 教材のフォルダで `npm install` を実行します |
| `npm error code ENOENT` と出る | 教材のフォルダの外で打っています。VS Code で `TSLecture` フォルダを開き、新しいターミナルで打ち直します |
| `Missing script` と出る | コマンドの名前が違うか、教材のフォルダの外で打っています。`npm run` だけを打つと、使える名前が出ます |
| 「章 "02" が見つかりません」と出る | 章ID は、編の記号と 2 けたの番号です（本編 `M02`、基礎編 `B06`、実践編 `P01`、React 編 `R01`）。`npm run check` だけを打つと、章の一覧が出ます |

## 型チェック

| 症状 | 対処 |
| --- | --- |
| エディタの赤い波線と、`npm run typecheck` の結果が違う | `npm run typecheck` の結果に従います。エディタの表示がおかしいときは、VS Code を再起動します |
| `Unused '@ts-expect-error' directive.`（TS2578）と出る | 演習の型の書き方が、まだ指示どおりになっていません。テストの「ここは型エラーになるはず」という確認が、外れたという意味です |

## テスト

`✖` の行が、合格しなかったテストの名前です。

| 症状 | 対処 |
| --- | --- |
| 「（まだ実装していません）」と出る | その関数の `throw` の行を書き換えます |
| それ以外の `✖` | `--- 失敗の内容 ---` を読みます（下の例） |

`+` の行が関数が返した値、`-` の行が正しい値です。`^` は、違いが始まる場所です。

```
+ '合計:300円'
- '合計: 300円'
      ^
```

この例では、`:` の後の空白が足りません。よくある原因は次の 3 つです。

- 数値の `25` と文字列の `"25"` は別の値です
- 文字列は、空白や記号（`:` や `円`）まで同じでなければなりません
- 返した値が `undefined` なら、まず `return` を書いたかを見ます

## ブラウザの画面

| 症状 | 対処 |
| --- | --- |
| `npm run dev M10` などを打っても、ブラウザが開かない | ターミナルに出た `http://localhost:` で始まるアドレスを、ブラウザで開きます |
| 画面に何も出ない、ボタンを押しても何も起きない | 開発者ツール（`F12`、Mac は `Command` + `Option` + `I`）の「コンソール」に赤いエラーがないかを見ます。`Error: TODO: ここを実装してください` なら、関数がまだ書けていません。`npm test M10` のように章ID を付けて、その章のテストを見ます |
| `console.log` の表示がターミナルに出ない | ブラウザで動くコードの `console.log` は、開発者ツールの「コンソール」に出ます |
| `Port 5173 is in use, trying another one...` と出る | 前に起動した画面がまだ動いています。新しい画面は、表示された別のアドレス（`5174` など）で動きます。前の画面は、そのターミナルで `Ctrl` + `C` を押して止めます |
| 直したのに、画面が変わらない | 改修用フォルダの画面（`npm run dev P05`・`npm run dev R03` など）を開いているかを見ます。完成版（`npm run dev app`・`npm run dev rapp`）は変わりません |
| `npm run dev` の起動のときに `Re-optimizing dependencies because vite config has changed` と出る | 前と違う章や版のフォルダで起動したときに出る表示です。そのまま使えます |
| 実践編・React 編のアプリの明細がおかしくなった | 開発者ツールの「Application」で、localStorage の `kakeibo:entries` を消し、ページを読み込み直します。DOM 版と React 版は、同じアドレスで開くと、この明細を共有します |

## React 編の画面とリンター

React の警告は、開発者ツールの「コンソール」に赤い字で出ます。「React 編 第3章 3.2」のような場所は、詳細版の章です。

| 症状 | 対処 |
| --- | --- |
| シークレットウィンドウで開くアドレスが分からない | `npm run dev` を実行したターミナルの `Local:` の行のアドレスを開きます |
| 改修 3（詳細版では第4章の改修）で付けた「（固定費）」の表示が消えた | 同じアドレスで完成版やほかの章の画面を開くと、明細が保存し直され、固定費の情報が消えます（開いたときにも保存する仕組みは React 編 第6章）。改修の画面（`npm run dev R04`）で、もう一度追加します |
| Console の行の右端が、ファイル名ではなく `installHook.js` になる | React Developer Tools（ブラウザの拡張機能）を入れていると、そう表示されます。表示の中身は同じなので、そのまま読みます |
| `console.log` の表示が 2 行ずつ出る | 開発中は、React がコンポーネントの関数を 2 回ずつ呼びます（React 編 第3章 3.2）。間違いではありません |
| `Each child in a list should have a unique "key" prop.` | `map` で作った要素に `key` がありません。明細の `id` のように、変わらない値を `key={…}` で渡します（React 編 第2章 2.3） |
| `Encountered two children with the same key` | 同じ `key` の要素が 2 つあります。同じ `id` の明細が 2 つできていないかを見ます。明細を追加する処理が、元の配列を書き換えていると起きます（React 編 第7章） |
| ``You provided a `value` prop to a form field without an `onChange` handler.``（`checked` のときもある） | 入力欄に `value`（チェック欄は `checked`）だけを書き、`onChange` を書いていません。文字が打てない、チェックが付かない、のもこのためです（React 編 第4章 4.3） |
| `Cannot update a component (…) while rendering a different component (…)` | `onClick={f()}` のように、関数を呼んだ結果を渡しています。押したときに呼ぶには、`onClick={() => f()}` と書きます（React 編 第4章 4.2） |
| イベントの型にカーソルを合わせると、`ChangeEvent<HTMLInputElement, HTMLInputElement>` のように `< >` の中が 2 つ並ぶ | 読むのは 1 つ目（`onChange` を書いた要素の型）です。型を書くときも、1 つ目だけを書きます（React 編 第4章 4.4） |
| `npm run lint` で `rules-of-hooks` と出る | フック（`useState` など）を、`if` の中やイベントの処理の中で呼んでいます。コンポーネントの一番上で、毎回同じ順番で呼びます（React 編 第3章 3.6） |
| `npm run lint` で `exhaustive-deps` と `missing dependency` が出る | エフェクトの中で使っている props や state が、依存配列にありません。後ろに出た名前を依存配列に書きます（React 編 第6章 6.2） |

## やり直し

| したいこと | コマンド |
| --- | --- |
| まだ `git add` していない変更を取り消したい | `git restore ファイル名` |
| コミットした後で、配布時の状態に戻したい | `git restore --source=origin/main ファイル名` |
