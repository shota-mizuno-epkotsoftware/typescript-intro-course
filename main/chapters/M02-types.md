# 第2章 型の基本

- **この章で学ぶこと**
  - 型を書く理由と、基本の型・型推論
  - `+` で数値と文字列を組み合わせたときの動き
  - 型が実行時に消えると、外から来た値やテストで何が起きるか

---

## 2.1 型は何のためにあるか

型は、値の種類（数値、文字列など）を表す印です。型を書いておくと、間違った値の使い方を、実行する前に見つけられます。

次の型エラーは、エディタの赤い波線で見ます（`node` で実行しても出ません）。

```ts
function half(n: number): number {
  return n / 2;
}

half("10");
// エラー: Argument of type 'string' is not assignable to parameter of type 'number'.
```

型には、ほかにも次の利点があります。

- エディタが、使えるメソッドの候補や値の型を表示する
- 関数に何を渡し、何が返るのかを、コードから読み取れる

## 2.2 基本の型

この講座で使う基本の型は次の 5 つです。実行中に値の種類を調べるには `typeof 値` を使います。

```ts
const price = 1200;
const label = "ノート";
const inStock = true;

console.log(typeof price);     // → number
console.log(typeof label);     // → string
console.log(typeof inStock);   // → boolean
console.log(typeof undefined); // → undefined
console.log(typeof null);      // → object
```

| 型 | 値の例 | 説明 |
| --- | --- | --- |
| `number` | `10` `10.5` `-3` | 数値。整数と小数の区別がない |
| `string` | `"10"` `'abc'` | 文字列 |
| `boolean` | `true` `false` | 真偽値 |
| `null` | `null` | 「値がない」ことを表す |
| `undefined` | `undefined` | 「値が指定されていない」ことを表す |

`typeof` の結果は文字列です。`typeof null` が `"object"` になるのは JavaScript の昔からの不具合なので、`null` かどうかは `値 === null` で調べます。

> **PHPでは**
> `number` は、PHP の整数（`int`）と小数（`float`）を合わせたものです。`undefined` にあたるものは PHP にはありません。

## 2.3 型注釈と型推論

型は `: 型` で自分で書けます（**型注釈**）。ただし変数の型は、たいてい書かなくても代入した値から自動で決まります（**型推論**）。一度決まった変数の型は、後から変わりません。

```ts
let count = 0;     // 型推論で number 型になる
let label = "合計"; // 型推論で string 型になる

function square(n: number): number { // 引数と戻り値に型注釈
  return n * n;
}
console.log(square(4)); // → 16
```

| 場所 | 型注釈 | 理由 |
| --- | --- | --- |
| 関数の引数 | 初期値のない引数は**書く** | 何を渡せばよいかは推論できないため |
| 関数の戻り値 | 書くことが多い | 何を返すつもりかが読み手に伝わるため |
| 変数 | 基本は書かない | 推論で十分なため |

`let 名前: 型;` と書くと、値を入れずに型だけを決めて変数を作れます。値を入れる前にこの変数を読むと、型チェックで見つかります。

```ts
let total: number; // 型だけを決める
total = 300;
console.log(total); // → 300
```

VS Code で変数名にマウスカーソルを合わせると、推論された型が表示されます。上の `count` なら `let count: number` です。

> **PHPでは**
> PHP では引数に種類を書かないことが多いですが、TypeScript では書きます。書く場所は、名前の後ろです（`n: number`）。

## 2.4 `+` と文字列

**`+` は、両方が数値なら足し算、どちらかが文字列なら連結です。** `+` が続くときは、左から順に計算します。

値を文字列に埋め込むときは、**テンプレートリテラル**を使うと読み間違えません。バッククォート（`` ` ``）で囲み、`${}` の中に式を書きます。`${}` の中は、先に計算されます。

```ts
console.log(1 + 2);         // → 3
console.log("1" + 2);       // → 12
console.log("価格: " + 100); // → 価格: 100

const name = "Alice";
console.log(`Hello, ${name}`);      // → Hello, Alice
console.log(`来年は ${20 + 1} 歳`); // → 来年は 21 歳
```

第0章では `"100" * 2` が `200` になりました。`*` `-` `/` は文字列を数値に変換して計算しますが、`+` は連結になります。文字列に `*` を直接書くと型エラーになりますが、`+` の連結は型エラーになりません。

## 問題 1：文字列と数値を組み合わせる

`main/exercises/M02-types/problem-01.ts`

```ts
const count = 2;
const price = 300;

console.log("個数: " + count + 1);       // ①
console.log(count + price + "円");       // ②
console.log(`合計: ${count * price}円`); // ③
```

`node main/exercises/M02-types/problem-01.ts` を実行すると、①〜③ でそれぞれ何が表示されるか予測してください。

<details>
<summary>答えと解説</summary>

```
個数: 21
302円
合計: 600円
```

- ①：左から計算します。`"個数: " + 2` が `"個数: 2"` になり、さらに `1` が連結されます。
- ②：`2 + 300` は両方が数値なので `302` です。その後で `"円"` が連結されます。
- ③：`${}` の中の `2 * 300` が先に計算されます。

> **PHPでは**
> PHP は連結が `.`、足し算が `+` と記号が分かれているので、`"1" + 1` は `2` です。TypeScript では `"11"` になります。

</details>

## 2.5 型は実行時に消える

`node` は型注釈を消してから実行します（第0章）。そのため、型チェックをすり抜けた値は、元の値のまま次の処理に渡ります。書いた型には変換されません。

**JSON** は、`{"name": "Bob", "age": 20}` のようにキーと値の組を文字で書き表すデータ形式です。値は `"` で囲むと文字列、囲まない `20` は数値です。

型チェックをすり抜ける代表が `JSON.parse(文字列)` です。JSON の文字列を読み込んでデータにする関数で、戻り値は **`any`** 型です。`any` は型チェックをしない特別な型で、型の間違いを見つけられなくなるので、この教材では自分では使いません。

```ts
const user = JSON.parse('{"name": "Bob", "age": "20"}'); // user は any 型
const age: number = user.age;

console.log(user.name);  // → Bob
console.log(typeof age); // → string
```

型チェックが調べるのは**コードだけ**で、実行中に届いた値の中身は調べません。

![user、user.age、age の 3 つを横に並べ、上の段に型チェックが見る型、下の段に実行時の値を書いた図。上の段は、user が any、user.age も any、age は書いたとおりの number。any は調べないので、number 型の age に入れてもエラーにならない。下の段は、user が name に "Bob"、age に "20" を持つデータ、user.age が文字列の "20"、age も文字列の "20" のまま。型は number でも、実行時の typeof age は string。](images/M02-type-vs-value.svg "図2-1 型チェックが見る型と、実行時の値")

テスト（`npm test`）も `node` で動くので、型注釈を消してから実行します。戻り値の型注釈だけを間違えても、返す値が合っていれば、テストは `✔` になります。

## 問題 2：外から来た注文データ

`main/exercises/M02-types/problem-02.ts`

```ts
function addShipping(price: number): number {
  return price + 500;
}

const order = JSON.parse('{"item": "本", "price": "1000"}');

console.log(addShipping(order.price));
```

`node main/exercises/M02-types/problem-02.ts` を実行すると、何が表示されるか予測してください。

<details>
<summary>答えと解説</summary>

```
1000500
```

`order` は `any` 型なので、`order.price` は型チェックされずに `addShipping` へ渡ります。`price` の中身は文字列のままなので、`"1000" + 500` は連結になります。

> **PHPでは**
> PHP では、`"1000" + 500` は数の足し算になり、`1500` です。

</details>

## 2.6 コマンドライン引数やフォームの入力は文字列で届く

コマンドライン引数やフォームの入力は、数字に見えても文字列で届きます。数値として使うときは `Number()` で変換します。

下の例の `process.argv` は、`node` コマンドの情報が入った配列です。`[2]` に最初の引数が入ります（`[0]` は node 本体のパス、`[1]` は実行したファイルのパス）。

`main/exercises/M02-types/argv.ts`

```ts
const arg = process.argv[2];
console.log(typeof arg);
console.log(arg + 1);
console.log(Number(arg) + 1);
```

| 実行するコマンド | 表示 |
| --- | --- |
| `node main/exercises/M02-types/argv.ts 5` | `string` / `51` / `6` |
| `node main/exercises/M02-types/argv.ts abc` | `string` / `abc1` / `NaN` |
| `node main/exercises/M02-types/argv.ts`（引数なし） | `undefined` / `NaN` / `NaN` |

- `Number()` は、数値にできない文字列を `NaN`（数値ではないことを表す特別な数値）に変換します。
- 引数なしのとき、`arg` は `undefined` です。`undefined` に数を足すと `NaN` になります。
- 引数なしでも、エディタでの `arg` の型は `string` と表示されます。TypeScript は、配列のその番号に要素があるかまでは調べません。確かめてから使う書き方は第6章で扱います。

> **PHPでは**
> `process.argv` は `$argv` にあたります。

`NaN` かどうかは `Number.isNaN(値)` で調べます。`NaN` は自分自身とも等しくないので、`値 === NaN` では調べられません（型エラーになります）。`Number("")` は、`NaN` ではなく `0` です（空の入力の調べ方は第10章）。

```ts
const n = Number("abc");

console.log(n);               // → NaN
console.log(Number.isNaN(n)); // → true
console.log(Number(""));      // → 0
```

---

## 問題 3：型エラーを読む

`main/exercises/M02-types/problem-03.ts` には、次のコードが書かれています。

```ts
let message = "こんにちは";
message = 100;
console.log(message);

function square(n: number): number {
  return n * n;
}
console.log(square("3"));

let total: number;
console.log(total);
```

どの行でどんな型エラーが出るか予測してから、次の順に進めます。

1. 型エラーを表示する

   ```sh
   npm run typecheck M02 problem-03
   ```

   - 行番号は、ファイルの先頭のコメントの分だけ、本文のコードとずれます（第0章の問題 1 と同じ）
2. それぞれのエラーが何を言っているかを、自分の言葉に言い換えて、ファイル内のコメント欄に書く
3. エラーが消えるようにコードを直す
4. もう一度同じコマンドを実行する
   - **こうなれば OK**：「型チェック: OK」と表示される

<details>
<summary>言い換えの例と修正例</summary>

よく出る型エラーの言い回しです。

| メッセージ | 意味 |
| --- | --- |
| `Variable 'x' is used before being assigned.` | 変数 x に値を入れる前に使っている |
| `Argument of type 'X' is not assignable to parameter of type 'Y'.` | X 型の値を、Y 型の引数に渡せない |
| `Type 'X' is not assignable to type 'Y'.` | X 型の値を、Y 型の変数などに入れられない |

- **エラー 1（TS2322）**：「`message` は最初に文字列を入れたので `string` 型と推論された。そこに数値は入れられない」
- **エラー 2（TS2345）**：「`square` の引数は `number` 型なのに、文字列 `"3"` を渡している」
- **エラー 3（TS2454）**：「`total` に値を入れる前に使っている」

```ts
let message = "こんにちは";
message = "100";
console.log(message);

function square(n: number): number {
  return n * n;
}
console.log(square(3));

let total = 0;
console.log(total);
```

> **PHPでは**
> PHP では、同じ変数に文字列も数値も入れられます。TypeScript では、`message` は `string` と推論されたので、数値を入れると型チェックでエラーになります（`node` での実行は止まりません）。

</details>

## 演習：文字列で届いた価格に送料を足す

問題 2 の `1000500` が起きないように、文字列の価格を数値にしてから送料を足す関数を書きます。

**進め方**

#### 関数を書く

1. `main/exercises/M02-types/practice-01.ts` の、`parsePrice` の `throw` の行を書き換える
   - 文字列は `Number(値)` で数値にします（2.6）
   ```sh
   npm test M02
   ```
   - **こうなれば OK**：テストの表示で、テスト名が `parsePrice` で始まる行が `✔` になる
2. `addShipping` の `throw` の行を書き換える
   - 受け取った `price` に `500` を足して返します
   ```sh
   npm test M02
   ```
   - **こうなれば OK**：テストの表示で、テスト名が `addShipping` で始まる行がすべて `✔` になる
3. `formatTotal` の `throw` の行を書き換える
   - `parsePrice` で数値にしてから `addShipping` に渡し、テンプレートリテラルで `円` を付けます
   ```sh
   npm test M02
   ```
   - **こうなれば OK**：テストの表示で、テスト名が `formatTotal` で始まる行がすべて `✔` になる

#### 型だけを間違えて、テストと型チェックを比べる

4. `parsePrice` の戻り値の型 `: number` を `: string` に書き換える
   - テストも型注釈を消して実行します（2.5）
   ```sh
   npm test M02
   ```
   - **こうなれば OK**：エディタの `parsePrice` の `return` の行と `formatTotal` の中に赤い波線が出るが、テストはすべての行が `✔` のまま
5. `practice-01.ts` だけを型チェックする
   - `parsePrice` の `return` の行に `Type 'number' is not assignable to type 'string'.`、`formatTotal` の中に `Argument of type 'string' is not assignable to parameter of type 'number'.` が出ます
   ```sh
   npm run typecheck M02 practice-01
   ```
   - **こうなれば OK**：`practice-01.ts` に 2 つの型エラーが出る（テストは手順 4 で `✔` のまま）

#### 仕上げる

6. `: string` を `: number` に戻す
   - `problem-03.ts` の型エラーが出たら、問題 3 に戻って直します
   ```sh
   npm run check M02
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」

**テストで確かめるもの**

| 呼び出し | 返す値 |
| --- | --- |
| `parsePrice("1000")` | `1000` |
| `addShipping(1000)` | `1500` |
| `addShipping(0)` | `500` |
| `formatTotal("1000")` | `"1500円"` |
| `formatTotal("0")` | `"500円"` |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- 文字列を数値にする方法：2.6「コマンドライン引数やフォームの入力は文字列で届く」
- 値を文字列に埋め込む方法：2.4「`+` と文字列」

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- `parsePrice`：`return Number(input);`
- `formatTotal`：まず `const price = parsePrice(input);` と書き、テンプレートリテラルの中で `addShipping(price)` を使います。

</details>

<details>
<summary>テストが失敗したら</summary>

| 表示 | よくある原因 |
| --- | --- |
| `'1000' !== 1000`（型チェックで `Type 'string' is not assignable to type 'number'.`） | `parsePrice` が、文字列のまま返しています。`Number()` で数値にします |
| `+ '1000500円'`（型チェックで `Argument of type 'string' is not assignable to parameter of type 'number'.`） | `addShipping` に文字列の `input` をそのまま渡しています。`parsePrice` で数値にしてから渡します |
| `'1500' !== '1500円'` | 最後の `円` が付いていません |

表示の読み方は、[つまずき集](../../troubleshooting.md) の「テスト」にあります。

</details>

解答例：[main/solutions/M02-types/practice-01.ts](../solutions/M02-types/practice-01.ts)

---

## チェックリスト

- [ ] `"個数: " + 2 + 1` の結果と、その理由を説明できる
- [ ] 問題 2 で `1000500` が表示された理由を、「型は実行時に消える」という言葉を使って説明できる
- [ ] 外から来る値を数値として使う前に、`Number()` で変換する理由を説明できる

## 詳しく学ぶ

- JavaScript Primer：[データ型とリテラル](https://jsprimer.net/basic/data-type/)、[文字列](https://jsprimer.net/basic/string/)、[暗黙的な型変換](https://jsprimer.net/basic/implicit-coercion/)、[JSON](https://jsprimer.net/basic/json/)
- サバイバルTypeScript：[プリミティブ型](https://typescriptbook.jp/reference/values-types-variables/primitive-types)、[変数宣言の型注釈](https://typescriptbook.jp/reference/values-types-variables/type-annotation)、[変数宣言の型推論](https://typescriptbook.jp/reference/values-types-variables/type-inference)、[any型](https://typescriptbook.jp/reference/values-types-variables/any)
