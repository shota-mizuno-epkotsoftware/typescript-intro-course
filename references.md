# 参考資料との対応

JavaScript Primer とサバイバルTypeScript の内容を、この講座のどこで扱っているかの一覧です。扱っていない内容を学びたいときは、資料のほうを読んでください。

- [JavaScript Primer](https://jsprimer.net/)：JavaScript の文法の詳しい解説
- [サバイバルTypeScript](https://typescriptbook.jp/)：TypeScript の型の詳しい解説

表の読み方は、次のとおりです。

- **扱い**：○ は扱う、△ は一部だけ扱う（範囲は補足に書いています）。「読むだけ」は、出てきたコードを読める程度に説明し、自分では書かないものです。
- **本編**：「第2章」のように番号だけで書いています。
- **ほかの編**：任意の基礎編・実践編・React 編です。実践編と React 編は 1 ページ版を指し、任意で読む詳細版の章をかっこに書いています。

## JavaScript Primer

**第一部：基本文法**

| 資料の章 | 扱い | 本編 | ほかの編 | 補足 |
| --- | :---: | --- | --- | --- |
| [JavaScriptとは](https://jsprimer.net/basic/introduction/) | △ | [第0章](main/chapters/M00-setup.md) | | TypeScript との関係だけ |
| [コメント](https://jsprimer.net/basic/comments/) | ○ | [第1章](main/chapters/M01-syntax-table.md) | [基礎編 第1章](basics/chapters/B01-values.md) | |
| [変数と宣言](https://jsprimer.net/basic/variables/) | ○ | [第1章](main/chapters/M01-syntax-table.md) | [基礎編 第2章](basics/chapters/B02-variables.md) | `var` は扱わない |
| [値の評価と表示](https://jsprimer.net/basic/read-eval-print/) | ○ | [第0章](main/chapters/M00-setup.md) | [基礎編 第1章](basics/chapters/B01-values.md) | `console.log` |
| [データ型とリテラル](https://jsprimer.net/basic/data-type/) | △ | [第2章](main/chapters/M02-types.md) | [基礎編 第1章](basics/chapters/B01-values.md) | `bigint`・`symbol` は扱わない |
| [演算子](https://jsprimer.net/basic/operator/) | △ | [第1章](main/chapters/M01-syntax-table.md)、[第6章](main/chapters/M06-narrowing.md) | [基礎編 第1章](basics/chapters/B01-values.md)・[第4章](basics/chapters/B04-conditions.md) | `===`・`+`・`??`・`?.` を中心に |
| [暗黙的な型変換](https://jsprimer.net/basic/implicit-coercion/) | △ | [第2章 2.4](main/chapters/M02-types.md#24--と文字列)、[第6章 6.2](main/chapters/M06-narrowing.md#62--と--で既定値を決める) | [基礎編 第1章](basics/chapters/B01-values.md) | 文字列と数値の間と、`false` として扱われる値だけ |
| [関数と宣言](https://jsprimer.net/basic/function-declaration/) | ○ | [第3章](main/chapters/M03-functions.md) | [基礎編 第6章](basics/chapters/B06-functions.md)・[第7章](basics/chapters/B07-combining.md) | |
| [条件分岐](https://jsprimer.net/basic/condition/) | ○ | [第1章](main/chapters/M01-syntax-table.md) | [基礎編 第4章](basics/chapters/B04-conditions.md) | |
| [ループと反復処理](https://jsprimer.net/basic/loop/) | ○ | [第1章](main/chapters/M01-syntax-table.md)、[第7章](main/chapters/M07-array-methods.md) | [基礎編 第5章](basics/chapters/B05-arrays-loops.md) | `for...of` と配列のメソッド |
| [オブジェクト](https://jsprimer.net/basic/object/) | ○ | [第4章](main/chapters/M04-objects.md)、[第5章](main/chapters/M05-data-types.md) | [基礎編 第8章](basics/chapters/B08-objects.md) | |
| [配列](https://jsprimer.net/basic/array/) | ○ | [第4章](main/chapters/M04-objects.md)、[第7章](main/chapters/M07-array-methods.md) | [基礎編 第5章](basics/chapters/B05-arrays-loops.md)・[第9章](basics/chapters/B09-array-methods.md)、[実践編](practice/chapters/P00-digest.md#絞り込みと集計は配列のメソッドをつなぐ)（詳細版 [第5章](practice/chapters/P05-summary.md)） | |
| [文字列](https://jsprimer.net/basic/string/) | △ | [第1章](main/chapters/M01-syntax-table.md)、[第2章](main/chapters/M02-types.md) | [基礎編 第1章](basics/chapters/B01-values.md)、実践編（詳細版 [第3章](practice/chapters/P03-form.md)） | 正規表現は名前だけ（[第11章 11.6](main/chapters/M11-next-steps.md#116-名前だけ知っておくもの)）。実践編 詳細版で読む |
| [関数とスコープ](https://jsprimer.net/basic/function-scope/) | △ | [第3章 3.4](main/chapters/M03-functions.md#34-関数を返す関数とクロージャ) | [基礎編 第7章](basics/chapters/B07-combining.md) | 本編はクロージャだけ |
| [クラス](https://jsprimer.net/basic/class/) | △ | [第1章 1.9](main/chapters/M01-syntax-table.md#19-クラス) | | 読むだけ |
| [例外処理](https://jsprimer.net/basic/error-try-catch/) | ○ | [第1章](main/chapters/M01-syntax-table.md)、[第9章 9.5](main/chapters/M09-async.md#95-エラーを受け取る) | [基礎編 第3章](basics/chapters/B03-errors.md)、実践編（詳細版 [第4章](practice/chapters/P04-events.md)） | 基礎編と実践編 詳細版は、エラーの表示の読み方 |
| [非同期処理:Promise/Async Function](https://jsprimer.net/basic/async/) | △ | [第9章](main/chapters/M09-async.md) | [実践編](practice/chapters/P00-digest.md#外から来るデータは検査してから使う)（詳細版 [第6章](practice/chapters/P06-external.md)） | `async`/`await` を中心に |
| [Map/Set](https://jsprimer.net/basic/map-and-set/) | △ | [第8章 8.4](main/chapters/M08-modules.md#84-map-でキーと値を集める) | 実践編（詳細版 [第5章](practice/chapters/P05-summary.md)） | `Map` だけ |
| [JSON](https://jsprimer.net/basic/json/) | ○ | [第2章](main/chapters/M02-types.md)、[第6章](main/chapters/M06-narrowing.md)、[第11章](main/chapters/M11-next-steps.md) | [実践編](practice/chapters/P00-digest.md#外から来るデータは検査してから使う)（詳細版 [第6章](practice/chapters/P06-external.md)） | |
| [Math](https://jsprimer.net/basic/math/) | △ | [第8章 8.1](main/chapters/M08-modules.md#81-export-と-import) | | `Math.round` だけ |
| [ECMAScriptモジュール](https://jsprimer.net/basic/module/) | ○ | [第8章](main/chapters/M08-modules.md) | | |

扱わない章：[文と式](https://jsprimer.net/basic/statement-expression/)、[プロトタイプオブジェクト](https://jsprimer.net/basic/prototype-object/)、[文字列とUnicode](https://jsprimer.net/basic/string-unicode/)、[ラッパーオブジェクト](https://jsprimer.net/basic/wrapper-object/)、[関数とthis](https://jsprimer.net/basic/function-this/)、[イテレータとジェネレータ](https://jsprimer.net/basic/iterator-generator/)、[Date](https://jsprimer.net/basic/date/)（日付は文字列のまま扱う）、[ECMAScript](https://jsprimer.net/basic/ecmascript/)

**第二部：応用編**

| 資料の章 | 扱い | 本編 | ほかの編 | 補足 |
| --- | :---: | --- | --- | --- |
| [アプリケーション開発の準備](https://jsprimer.net/use-case/setup-local-env/) | △ | [第0章](main/chapters/M00-setup.md)、[第10章](main/chapters/M10-dom.md) | | 設定済みの環境を使う |
| [Ajax通信](https://jsprimer.net/use-case/ajaxapp/) | ○ | [第11章 11.5](main/chapters/M11-next-steps.md#115-通信でデータを読む) | [実践編](practice/chapters/P00-digest.md#外から来るデータは検査してから使う)（詳細版 [第6章](practice/chapters/P06-external.md)） | `fetch` でデータを読む |
| [Node.jsでCLIアプリ](https://jsprimer.net/use-case/nodecli/) | △ | [第2章 2.6](main/chapters/M02-types.md#26-コマンドライン引数やフォームの入力は文字列で届く)、[第9章](main/chapters/M09-async.md) | | コマンドライン引数は読むだけ。ファイルの読み込みは第9章の演習で書く |
| [Todoアプリ](https://jsprimer.net/use-case/todoapp/) | ○ | [第10章](main/chapters/M10-dom.md)、[第11章](main/chapters/M11-next-steps.md) | [基礎編 第10章](basics/chapters/B10-dom.md)、[実践編](practice/chapters/P00-digest.md)（詳細版 [全 7 章](practice/chapters/P01-overview.md)） | 実践編は、家計簿のアプリで同じ考え方を読む |

## サバイバルTypeScript

**読んで学ぶTypeScript**

| 資料の内容 | 扱い | 本編 | ほかの編 | 補足 |
| --- | :---: | --- | --- | --- |
| [TypeScriptの概要](https://typescriptbook.jp/overview) | △ | [第0章](main/chapters/M00-setup.md) | | 読むだけ |
| [let と const](https://typescriptbook.jp/reference/values-types-variables/let-and-const) | ○ | [第1章](main/chapters/M01-syntax-table.md)、[第5章 5.3](main/chapters/M05-data-types.md#53-let-と-const-で推論される型が違う) | [基礎編 第2章](basics/chapters/B02-variables.md) | |
| [プリミティブ型](https://typescriptbook.jp/reference/values-types-variables/primitive-types)、[型注釈](https://typescriptbook.jp/reference/values-types-variables/type-annotation)、[型推論](https://typescriptbook.jp/reference/values-types-variables/type-inference) | ○ | [第2章](main/chapters/M02-types.md) | | |
| [any型](https://typescriptbook.jp/reference/values-types-variables/any) | ○ | [第2章 2.5](main/chapters/M02-types.md#25-型は実行時に消える)、[第6章 6.4](main/chapters/M06-narrowing.md#64-unknown-は確かめるまで使えない) | | 自分では使わない |
| [undefined と null の違い](https://typescriptbook.jp/reference/values-types-variables/undefined-vs-null) | ○ | [第6章](main/chapters/M06-narrowing.md) | | |
| [オブジェクト](https://typescriptbook.jp/reference/values-types-variables/object) | ○ | [第4章](main/chapters/M04-objects.md)、[第5章](main/chapters/M05-data-types.md)、[第6章 6.3](main/chapters/M06-narrowing.md#63--でないときは-undefined-にする) | [基礎編 第8章](basics/chapters/B08-objects.md) | |
| [配列](https://typescriptbook.jp/reference/values-types-variables/array) | ○ | [第4章](main/chapters/M04-objects.md)、[第7章](main/chapters/M07-array-methods.md) | [基礎編 第5章](basics/chapters/B05-arrays-loops.md)・[第9章](basics/chapters/B09-array-methods.md) | |
| [ユニオン型](https://typescriptbook.jp/reference/values-types-variables/union)、[リテラル型](https://typescriptbook.jp/reference/values-types-variables/literal-types) | ○ | [第5章 5.2](main/chapters/M05-data-types.md#52-文字列のユニオン型で取りうる値を限定する) | | |
| [判別可能なユニオン型](https://typescriptbook.jp/reference/values-types-variables/discriminated-union) | ○ | [第6章 6.5](main/chapters/M06-narrowing.md#65-判別可能なユニオン型) | [実践編](practice/chapters/P00-digest.md#型を地図にする)（詳細版 [第2章](practice/chapters/P02-types.md)） | |
| [インターセクション型](https://typescriptbook.jp/reference/values-types-variables/intersection) | △ | [第5章 5.6](main/chapters/M05-data-types.md#56-ほかの型を広げる書き方を読む) | | 読むだけ |
| [型エイリアス](https://typescriptbook.jp/reference/values-types-variables/type-alias) | ○ | [第5章 5.1](main/chapters/M05-data-types.md#51-type-でデータの形に名前を付ける) | | |
| [型アサーション（as）](https://typescriptbook.jp/reference/values-types-variables/type-assertion-as) | ○ | [第6章 6.6](main/chapters/M06-narrowing.md#66-as-と--は実行時に何もしない)、[第10章](main/chapters/M10-dom.md) | | 使わずに確かめる書き方を勧める |
| [typeof演算子](https://typescriptbook.jp/reference/values-types-variables/typeof-operator)、[等価演算子](https://typescriptbook.jp/reference/values-types-variables/equality)、[truthyとfalsy](https://typescriptbook.jp/reference/values-types-variables/truthy-falsy-values) | ○ | [第1章](main/chapters/M01-syntax-table.md)、[第6章](main/chapters/M06-narrowing.md) | [基礎編 第4章](basics/chapters/B04-conditions.md) | |
| [関数](https://typescriptbook.jp/reference/functions)（アロー関数、関数の型、コールバック関数、void型） | ○ | [第3章](main/chapters/M03-functions.md) | [基礎編 第7章](basics/chapters/B07-combining.md)・[第9章](basics/chapters/B09-array-methods.md) | |
| [デフォルト引数](https://typescriptbook.jp/reference/functions/default-parameters)、[分割代入引数](https://typescriptbook.jp/reference/functions/destructuring-assignment-parameters) | △ | [第1章 1.5](main/chapters/M01-syntax-table.md#15-関数)、[第4章 4.2](main/chapters/M04-objects.md#42-分割代入) | 実践編（詳細版 [第1章](practice/chapters/P01-overview.md)・[第4章](practice/chapters/P04-events.md)） | 読むだけ |
| [文](https://typescriptbook.jp/reference/statements)（`if`、`switch`、三項演算子、`for-of`） | △ | [第1章](main/chapters/M01-syntax-table.md) | [基礎編 第4章](basics/chapters/B04-conditions.md)・[第5章](basics/chapters/B05-arrays-loops.md) | `switch` と三項演算子は第1章の対応表だけ |
| [例外処理](https://typescriptbook.jp/reference/statements/exception) | ○ | [第1章](main/chapters/M01-syntax-table.md)、[第9章 9.5](main/chapters/M09-async.md#95-エラーを受け取る) | | |
| [型の絞り込み](https://typescriptbook.jp/reference/statements/control-flow-analysis-and-type-guard) | ○ | [第6章](main/chapters/M06-narrowing.md)、[第10章 10.6](main/chapters/M10-dom.md#106-要素の種類を確かめる) | [実践編](practice/chapters/P00-digest.md#型を地図にする)（詳細版 [第2章](practice/chapters/P02-types.md)） | |
| [unknown型](https://typescriptbook.jp/reference/statements/unknown)、[anyとunknownの違い](https://typescriptbook.jp/reference/statements/any-vs-unknown) | ○ | [第6章 6.4](main/chapters/M06-narrowing.md#64-unknown-は確かめるまで使えない)、[第9章 9.5](main/chapters/M09-async.md#95-エラーを受け取る) | [実践編](practice/chapters/P00-digest.md#外から来るデータは検査してから使う)（詳細版 [第6章](practice/chapters/P06-external.md)） | |
| [クラス](https://typescriptbook.jp/reference/object-oriented/class) | △ | [第1章 1.9](main/chapters/M01-syntax-table.md#19-クラス) | | 読むだけ。`static` やアクセサーは扱わない |
| [インターフェース](https://typescriptbook.jp/reference/object-oriented/interface) | △ | [第5章 5.7](main/chapters/M05-data-types.md#57-type-と-interface-の違い)、[第8章 8.5](main/chapters/M08-modules.md#85-知らない型は定義へ移動して読む) | | 読むだけ |
| [非同期処理](https://typescriptbook.jp/reference/asynchronous) | ○ | [第9章](main/chapters/M09-async.md) | [実践編](practice/chapters/P00-digest.md#外から来るデータは検査してから使う)（詳細版 [第6章](practice/chapters/P06-external.md)） | |
| [ジェネリクス](https://typescriptbook.jp/reference/generics) | △ | [第8章 8.3](main/chapters/M08-modules.md#83--に型を渡すジェネリクス) | | 読むだけ。自分で定義する書き方は扱わない |
| [モジュール](https://typescriptbook.jp/reference/modules) | ○ | [第8章 8.1](main/chapters/M08-modules.md#81-export-と-import) | | |
| [ユーティリティ型](https://typescriptbook.jp/reference/type-reuse/utility-types) | △ | [第5章 5.5](main/chapters/M05-data-types.md#55-キーと値の型を決めるときは-record)、[第8章 8.6](main/chapters/M08-modules.md#86-型から型を作るユーティリティ型) | | 読むだけ。`Record`・`Partial` など |
| [Map](https://typescriptbook.jp/reference/builtin-api/map)、[Error](https://typescriptbook.jp/reference/builtin-api/error) | △ | [第8章 8.4](main/chapters/M08-modules.md#84-map-でキーと値を集める)、[第9章 9.5](main/chapters/M09-async.md#95-エラーを受け取る) | | 使い方の基本だけ |
| [宣言ファイル](https://typescriptbook.jp/reference/declaration-file) | △ | [第8章 8.5](main/chapters/M08-modules.md#85-知らない型は定義へ移動して読む) | | 読むだけ。「定義へ移動」で開いた先を読む |
| [パッケージ](https://typescriptbook.jp/reference/packages) | △ | [第0章](main/chapters/M00-setup.md) | 実践編（詳細版 [第1章](practice/chapters/P01-overview.md)） | `npm install` と `npm run` だけ |
| [JSX](https://typescriptbook.jp/reference/jsx) | △ | | [React 編](react/chapters/R00-digest.md#jsxタグを値として書く)（詳細版 [第1章 1.3](react/chapters/R01-overview.md#13-jsxタグを値として書く)） | 読むことと、`{ }` に式を書くこと |

扱わない内容：[タプル](https://typescriptbook.jp/reference/values-types-variables/tuple)、[列挙型（enum）](https://typescriptbook.jp/reference/values-types-variables/enum)（文字列のユニオン型を使う）、[constアサーション](https://typescriptbook.jp/reference/values-types-variables/const-assertion)、[satisfies](https://typescriptbook.jp/reference/values-types-variables/satisfies)、オプション引数・残余引数・オーバーロード・型ガード関数、[never型](https://typescriptbook.jp/reference/statements/never)、[keyof](https://typescriptbook.jp/reference/type-reuse/keyof-type-operator) など型から型を作る書き方、[RegExp](https://typescriptbook.jp/reference/builtin-api/regexp)（名前だけ。実践編 詳細版 第3章で読む）・[Set](https://typescriptbook.jp/reference/builtin-api/set)・[Date](https://typescriptbook.jp/reference/builtin-api/date)、[tsconfig.json](https://typescriptbook.jp/reference/tsconfig/tsconfig.json-settings)（設定済みのものを使う）

**チュートリアル・Tips**

| 資料の内容 | 扱い | 本編 | ほかの編 | 補足 |
| --- | :---: | --- | --- | --- |
| [開発環境の準備](https://typescriptbook.jp/tutorials/setup) | ○ | [第0章](main/chapters/M00-setup.md) | | |
| [Reactでいいねボタンを作ろう](https://typescriptbook.jp/tutorials/react-like-button-tutorial) | △ | | [React 編](react/chapters/R00-digest.md)（詳細版 [全 7 章](react/chapters/R01-overview.md)） | ボタンは作らず、家計簿アプリを読んで改修する |
| テスト（[Jest](https://typescriptbook.jp/tutorials/jest)、[Vitest](https://typescriptbook.jp/tutorials/vitest)）、[ESLint](https://typescriptbook.jp/tutorials/eslint) | △ | | [実践編](practice/chapters/P00-digest.md#絞り込みと集計は配列のメソッドをつなぐ)（テスト。詳細版 [第5章](practice/chapters/P05-summary.md)）、[React 編](react/chapters/R00-digest.md#改修-4明細が保存されない不具合を直す)（リンター。詳細版 [第3章](react/chapters/R03-state.md)） | 読むだけ。テストを仕様として読み、リンターの警告を読む。設定は扱わない |
| [Tips](https://typescriptbook.jp/tips)（オブジェクトのコピーなど） | △ | [第4章 4.5](main/chapters/M04-objects.md#45-元を変えずに新しく作る)・[4.6](main/chapters/M04-objects.md#46-コピーされるのは-1-段目だけ) | | スプレッド構文でのコピーと、コピーされる範囲 |

扱わない内容：[Next.js](https://typescriptbook.jp/tutorials/nextjs)、[Prettier](https://typescriptbook.jp/tutorials/prettier)
