# 参考資料との対応

JavaScript Primer とサバイバルTypeScript の内容を、この講座のどこで扱っているかの一覧です。

- [JavaScript Primer](https://jsprimer.net/)：JavaScript の文法の詳しい解説
- [サバイバルTypeScript](https://typescriptbook.jp/)：TypeScript の型の詳しい解説

この講座は、フロントエンドのコードを読んで直すのに必要な内容に絞っています。扱っていない内容を学びたいときは、資料のほうを読んでください。

「扱い」の欄の記号は、次の意味です。

- **○**：扱う（本文で説明し、問題や演習で使う）
- **△**：部分的に扱う（どこまで扱うかを、補足の欄に書いています。「読むだけ」は、出てきたコードを読めるように短く説明するもので、自分で書く練習はしません）
- **×**：扱わない

## JavaScript Primer との対応

**第一部：基本文法**

| JavaScript Primer の章 | この講座での場所 | 扱い | 補足 |
| --- | --- | :---: | --- |
| [JavaScriptとは](https://jsprimer.net/basic/introduction/) | [第0章](main/chapters/M00-setup.md) | △ | 読むだけ。TypeScript との関係 |
| [コメント](https://jsprimer.net/basic/comments/) | [第1章 1.1](main/chapters/M01-syntax-table.md#11-変数と出力) | △ | 第1章の対応表だけ |
| [変数と宣言](https://jsprimer.net/basic/variables/) | [第1章 1.1](main/chapters/M01-syntax-table.md#11-変数と出力) | △ | 第1章の対応表だけ。`let` と `const`。`var` は扱わない |
| [値の評価と表示](https://jsprimer.net/basic/read-eval-print/) | [第0章](main/chapters/M00-setup.md) | ○ | `console.log` |
| [データ型とリテラル](https://jsprimer.net/basic/data-type/) | [第2章 2.2](main/chapters/M02-types.md#22-基本の型)、[第2章 2.4](main/chapters/M02-types.md#24--と文字列)（テンプレートリテラル） | △ | `bigint`・`symbol` は扱わない |
| [演算子](https://jsprimer.net/basic/operator/) | [第1章 1.2](main/chapters/M01-syntax-table.md#12-文字列と数値)・[1.3](main/chapters/M01-syntax-table.md#13-比較と条件分岐)、[第6章](main/chapters/M06-narrowing.md)（`??`・`?.`） | △ | `===`、`+`、`??`、`?.` を中心に |
| [暗黙的な型変換](https://jsprimer.net/basic/implicit-coercion/) | [第2章](main/chapters/M02-types.md)、[実践編 第3章](practice/chapters/P03-form.md) | △ | 文字列と数値の間だけ |
| [関数と宣言](https://jsprimer.net/basic/function-declaration/) | [第1章 1.5](main/chapters/M01-syntax-table.md#15-関数)、[第3章](main/chapters/M03-functions.md) | ○ |  |
| [文と式](https://jsprimer.net/basic/statement-expression/) | — | × |  |
| [条件分岐](https://jsprimer.net/basic/condition/) | [第1章 1.3](main/chapters/M01-syntax-table.md#13-比較と条件分岐) | △ | 第1章の対応表だけ |
| [ループと反復処理](https://jsprimer.net/basic/loop/) | [第1章 1.4](main/chapters/M01-syntax-table.md#14-ループ)、[第7章](main/chapters/M07-array-methods.md) | ○ | `for...of` と配列のメソッド |
| [オブジェクト](https://jsprimer.net/basic/object/) | [第4章](main/chapters/M04-objects.md)、[第5章](main/chapters/M05-data-types.md) | ○ |  |
| [プロトタイプオブジェクト](https://jsprimer.net/basic/prototype-object/) | — | × |  |
| [配列](https://jsprimer.net/basic/array/) | [第4章](main/chapters/M04-objects.md)、[第7章](main/chapters/M07-array-methods.md)、[実践編 第5章](practice/chapters/P05-summary.md) | ○ |  |
| [文字列](https://jsprimer.net/basic/string/) | [第1章 1.2](main/chapters/M01-syntax-table.md#12-文字列と数値)、[第2章](main/chapters/M02-types.md)、[実践編 第3章](practice/chapters/P03-form.md)（正規表現） | △ | 正規表現は読むだけ |
| [文字列とUnicode](https://jsprimer.net/basic/string-unicode/) | — | × |  |
| [ラッパーオブジェクト](https://jsprimer.net/basic/wrapper-object/) | — | × |  |
| [関数とスコープ](https://jsprimer.net/basic/function-scope/) | [第3章](main/chapters/M03-functions.md) | △ | クロージャだけ |
| [関数とthis](https://jsprimer.net/basic/function-this/) | — | × |  |
| [クラス](https://jsprimer.net/basic/class/) | [第1章 1.9](main/chapters/M01-syntax-table.md#19-クラス) | △ | 第1章の対応表だけ。読むため |
| [例外処理](https://jsprimer.net/basic/error-try-catch/) | [第1章 1.8](main/chapters/M01-syntax-table.md#18-例外)、[第9章 9.5](main/chapters/M09-async.md#95-エラーを受け取る)、[実践編 第4章](practice/chapters/P04-events.md)（スタックトレース） | ○ |  |
| [非同期処理:Promise/Async Function](https://jsprimer.net/basic/async/) | [第9章](main/chapters/M09-async.md)、[実践編 第6章](practice/chapters/P06-external.md) | △ | `async`/`await` を中心に |
| [Map/Set](https://jsprimer.net/basic/map-and-set/) | [第8章 8.4](main/chapters/M08-modules.md#84-map-でキーと値を集める)、[実践編 第5章](practice/chapters/P05-summary.md) | △ | `Map` だけ |
| [イテレータとジェネレータ](https://jsprimer.net/basic/iterator-generator/) | — | × |  |
| [JSON](https://jsprimer.net/basic/json/) | [第2章](main/chapters/M02-types.md)、[第11章 11.1](main/chapters/M11-next-steps.md#111-値を-json-の文字列にする)、[実践編 第6章](practice/chapters/P06-external.md) | ○ |  |
| [Date](https://jsprimer.net/basic/date/) | — | × | 日付は文字列のまま扱う |
| [Math](https://jsprimer.net/basic/math/) | [第8章 8.1](main/chapters/M08-modules.md#81-export-と-import) | △ | `Math.round` だけ |
| [ECMAScriptモジュール](https://jsprimer.net/basic/module/) | [第8章](main/chapters/M08-modules.md) | ○ |  |
| [ECMAScript](https://jsprimer.net/basic/ecmascript/) | — | × |  |

**第二部：応用編**

| JavaScript Primer の章 | この講座での場所 | 扱い | 補足 |
| --- | --- | :---: | --- |
| [アプリケーション開発の準備](https://jsprimer.net/use-case/setup-local-env/) | [第0章](main/chapters/M00-setup.md)、[第10章 10.2](main/chapters/M10-dom.md#102-画面を起動する) | △ | 設定済みの環境を使う |
| [Ajax通信](https://jsprimer.net/use-case/ajaxapp/) | [第11章 11.5](main/chapters/M11-next-steps.md#115-通信でデータを読む)、[実践編 第6章](practice/chapters/P06-external.md) | ○ | `fetch` でデータを読み込む |
| [Node.jsでCLIアプリ](https://jsprimer.net/use-case/nodecli/) | [第2章 2.6](main/chapters/M02-types.md#26-コマンドライン引数やフォームの入力は文字列で届く)、[第9章](main/chapters/M09-async.md) | △ | コマンドライン引数は読むだけ。ファイルの読み込みは第9章の演習で書く |
| [Todoアプリ](https://jsprimer.net/use-case/todoapp/) | [第10章](main/chapters/M10-dom.md)、[第11章](main/chapters/M11-next-steps.md)、[実践編の全体](README.md#実践編) | ○ | 家計簿のアプリで、同じ考え方を読む |


## サバイバルTypeScript との対応

**読んで学ぶTypeScript**

| サバイバルTypeScript の内容 | この講座での場所 | 扱い | 補足 |
| --- | --- | :---: | --- |
| [TypeScriptの概要](https://typescriptbook.jp/overview)（JavaScript との関係、静的な型） | [第0章](main/chapters/M00-setup.md) | △ | 読むだけ |
| [let と const](https://typescriptbook.jp/reference/values-types-variables/let-and-const) | [第1章 1.1](main/chapters/M01-syntax-table.md#11-変数と出力) | △ | 第1章の対応表だけ |
| [プリミティブ型](https://typescriptbook.jp/reference/values-types-variables/primitive-types)、[型注釈](https://typescriptbook.jp/reference/values-types-variables/type-annotation)、[型推論](https://typescriptbook.jp/reference/values-types-variables/type-inference) | [第2章 2.2](main/chapters/M02-types.md#22-基本の型)・[2.3](main/chapters/M02-types.md#23-型注釈と型推論) | ○ |  |
| [any型](https://typescriptbook.jp/reference/values-types-variables/any) | [第2章](main/chapters/M02-types.md)、[第6章 6.4](main/chapters/M06-narrowing.md#64-unknown-は確かめるまで使えない) | ○ |  |
| [undefined と null の違い](https://typescriptbook.jp/reference/values-types-variables/undefined-vs-null) | [第6章](main/chapters/M06-narrowing.md) | ○ |  |
| [オブジェクト](https://typescriptbook.jp/reference/values-types-variables/object)（型注釈、オプションプロパティ、`readonly`、分割代入、スプレッド構文、オプショナルチェーン、`Record`） | [第4章](main/chapters/M04-objects.md)、[第5章](main/chapters/M05-data-types.md)、[第6章 6.3](main/chapters/M06-narrowing.md#63--でないときは-undefined-にする) | ○ |  |
| [配列](https://typescriptbook.jp/reference/values-types-variables/array)（型注釈、分割代入、スプレッド構文、元の配列を変える操作） | [第4章](main/chapters/M04-objects.md)、[第7章](main/chapters/M07-array-methods.md) | ○ |  |
| [タプル](https://typescriptbook.jp/reference/values-types-variables/tuple) | — | × |  |
| [列挙型（enum）](https://typescriptbook.jp/reference/values-types-variables/enum) | — | × | 文字列のユニオン型を使う |
| [ユニオン型](https://typescriptbook.jp/reference/values-types-variables/union)、[リテラル型](https://typescriptbook.jp/reference/values-types-variables/literal-types) | [第5章 5.2](main/chapters/M05-data-types.md#52-文字列のユニオン型で取りうる値を限定する) | ○ |  |
| [判別可能なユニオン型](https://typescriptbook.jp/reference/values-types-variables/discriminated-union) | [第6章 6.5](main/chapters/M06-narrowing.md#65-判別可能なユニオン型)、[実践編 第2章](practice/chapters/P02-types.md) | ○ |  |
| [インターセクション型](https://typescriptbook.jp/reference/values-types-variables/intersection) | [第5章 5.6](main/chapters/M05-data-types.md#56-ほかの型を広げる書き方を読む) | △ | 読むだけ |
| [型エイリアス](https://typescriptbook.jp/reference/values-types-variables/type-alias) | [第5章 5.1](main/chapters/M05-data-types.md#51-type-でデータの形に名前を付ける) | ○ |  |
| [型アサーション（as）](https://typescriptbook.jp/reference/values-types-variables/type-assertion-as) | [第6章の問題 2](main/chapters/M06-narrowing.md#問題-2型を言い切る書き方)、[第10章 10.6](main/chapters/M10-dom.md#106-要素の種類を確かめる) | ○ | 使わずに確かめる書き方を勧める |
| [constアサーション](https://typescriptbook.jp/reference/values-types-variables/const-assertion)、[satisfies](https://typescriptbook.jp/reference/values-types-variables/satisfies) | — | × |  |
| [typeof演算子](https://typescriptbook.jp/reference/values-types-variables/typeof-operator)、[等価演算子](https://typescriptbook.jp/reference/values-types-variables/equality)、[truthyとfalsy](https://typescriptbook.jp/reference/values-types-variables/truthy-falsy-values) | [第1章 1.2](main/chapters/M01-syntax-table.md#12-文字列と数値)・[1.3](main/chapters/M01-syntax-table.md#13-比較と条件分岐)、[第6章](main/chapters/M06-narrowing.md) | ○ |  |
| [関数](https://typescriptbook.jp/reference/functions)（[アロー関数](https://typescriptbook.jp/reference/functions/arrow-functions)、[関数の型](https://typescriptbook.jp/reference/functions/function-type-declaration)、[コールバック関数](https://typescriptbook.jp/reference/functions/callback-functions)、[void型](https://typescriptbook.jp/reference/functions/void-type)） | [第3章](main/chapters/M03-functions.md) | ○ |  |
| [デフォルト引数](https://typescriptbook.jp/reference/functions/default-parameters)、[分割代入引数](https://typescriptbook.jp/reference/functions/destructuring-assignment-parameters) | [第1章 1.5](main/chapters/M01-syntax-table.md#15-関数)、[第4章 4.2](main/chapters/M04-objects.md#42-分割代入)、[実践編 第4章](practice/chapters/P04-events.md) | △ | 読むだけ |
| オプション引数、残余引数、オーバーロード、`this` 引数、型ガード関数 | — | × |  |
| [文](https://typescriptbook.jp/reference/statements)（`if`、`switch`、三項演算子、`for-of`） | [第1章 1.3](main/chapters/M01-syntax-table.md#13-比較と条件分岐)・[1.4](main/chapters/M01-syntax-table.md#14-ループ) | △ | 第1章の対応表だけ |
| [例外処理](https://typescriptbook.jp/reference/statements/exception) | [第1章 1.8](main/chapters/M01-syntax-table.md#18-例外)、[第9章 9.5](main/chapters/M09-async.md#95-エラーを受け取る) | ○ |  |
| [制御フロー分析と型ガードによる型の絞り込み](https://typescriptbook.jp/reference/statements/control-flow-analysis-and-type-guard) | [第6章 6.1](main/chapters/M06-narrowing.md#61-確かめると型が絞り込まれる)、[実践編 第2章](practice/chapters/P02-types.md) | ○ |  |
| [unknown型](https://typescriptbook.jp/reference/statements/unknown)、[anyとunknownの違い](https://typescriptbook.jp/reference/statements/any-vs-unknown) | [第6章 6.4](main/chapters/M06-narrowing.md#64-unknown-は確かめるまで使えない)、[実践編 第6章](practice/chapters/P06-external.md) | ○ |  |
| [never型](https://typescriptbook.jp/reference/statements/never) | — | × |  |
| [クラス](https://typescriptbook.jp/reference/object-oriented/class) | [第1章 1.9](main/chapters/M01-syntax-table.md#19-クラス) | △ | 第1章の対応表だけ。読むため。`static` やアクセサーは扱わない |
| [インターフェース](https://typescriptbook.jp/reference/object-oriented/interface) | [第5章 5.6](main/chapters/M05-data-types.md#56-ほかの型を広げる書き方を読む)・[5.7](main/chapters/M05-data-types.md#57-type-と-interface-の違い)、[第8章 8.5](main/chapters/M08-modules.md#85-知らない型は定義へ移動して読む) | △ | 読むだけ |
| [非同期処理](https://typescriptbook.jp/reference/asynchronous)（Promise、`async`、`await`） | [第9章](main/chapters/M09-async.md)、[実践編 第6章](practice/chapters/P06-external.md) | ○ |  |
| [ジェネリクス](https://typescriptbook.jp/reference/generics) | [第8章 8.3](main/chapters/M08-modules.md#83--は中身の型を表す)・[8.5](main/chapters/M08-modules.md#85-知らない型は定義へ移動して読む) | △ | 読むだけ。`Array<T>` などを使う側。自分で定義する書き方は扱わない |
| [モジュール](https://typescriptbook.jp/reference/modules) | [第8章 8.1](main/chapters/M08-modules.md#81-export-と-import) | ○ |  |
| [ユーティリティ型](https://typescriptbook.jp/reference/type-reuse/utility-types) | [第8章 8.6](main/chapters/M08-modules.md#86-型から型を作るユーティリティ型)、[第5章 5.5](main/chapters/M05-data-types.md#55-キーと値の型を決めるときは-record)（`Record`） | △ | 読むだけ。`Partial` など |
| [keyof](https://typescriptbook.jp/reference/type-reuse/keyof-type-operator)、[Mapped Types](https://typescriptbook.jp/reference/type-reuse/mapped-types)、[Conditional Types](https://typescriptbook.jp/reference/type-reuse/conditional-types) など、型から型を作る書き方 | — | × |  |
| 組み込みAPI：[Map](https://typescriptbook.jp/reference/builtin-api/map)、[Error](https://typescriptbook.jp/reference/builtin-api/error)、[RegExp](https://typescriptbook.jp/reference/builtin-api/regexp) | [第8章 8.4](main/chapters/M08-modules.md#84-map-でキーと値を集める)、[第9章 9.5](main/chapters/M09-async.md#95-エラーを受け取る)、[実践編 第3章](practice/chapters/P03-form.md) | △ | 正規表現は読むだけ |
| 組み込みAPI：[Set](https://typescriptbook.jp/reference/builtin-api/set)、[Date](https://typescriptbook.jp/reference/builtin-api/date) | — | × |  |
| [宣言ファイル](https://typescriptbook.jp/reference/declaration-file) | [第8章 8.5](main/chapters/M08-modules.md#85-知らない型は定義へ移動して読む) | △ | 読むだけ。「定義へ移動」で開いた先を読む |
| [tsconfig.json](https://typescriptbook.jp/reference/tsconfig/tsconfig.json-settings) | — | × | 設定済みのものを使う |
| [パッケージ](https://typescriptbook.jp/reference/packages)（npm、`package.json`） | [第0章](main/chapters/M00-setup.md)、[実践編 第1章](practice/chapters/P01-overview.md) | △ | 読むだけ。`npm install` と、`scripts` の読み方 |
| [JSX](https://typescriptbook.jp/reference/jsx) | [React 編](README.md#react-編) | △ | React 編で扱う |

**チュートリアル・Tips**

| サバイバルTypeScript の内容 | この講座での場所 | 扱い | 補足 |
| --- | --- | :---: | --- |
| [開発環境の準備](https://typescriptbook.jp/tutorials/setup) | [第0章](main/chapters/M00-setup.md) | ○ |  |
| [Reactでいいねボタンを作ろう](https://typescriptbook.jp/tutorials/react-like-button-tutorial)、[Next.js](https://typescriptbook.jp/tutorials/nextjs) | [React 編](README.md#react-編) | △ | React 編で扱う。Next.js は扱わない |
| テスト（[Jest](https://typescriptbook.jp/tutorials/jest)、[Vitest](https://typescriptbook.jp/tutorials/vitest)）、[ESLint](https://typescriptbook.jp/tutorials/eslint)、[Prettier](https://typescriptbook.jp/tutorials/prettier) | [実践編 第5章](practice/chapters/P05-summary.md)（テストを読む） | △ | 読むだけ。テストを仕様として読む。ツールの設定は扱わない |
| [Tips](https://typescriptbook.jp/tips)（オブジェクトのコピーなど） | [第4章 4.5](main/chapters/M04-objects.md#45-元を変えずに新しく作る)、[4.6](main/chapters/M04-objects.md#46-コピーされるのは-1-段目だけ) | △ | スプレッド構文でのコピーと、コピーされる範囲 |
