# 実践編 第3章 フォームの入力と検証

- **この章で学ぶこと**
  - フォームに入力された値が、どんな型で、どこを通って明細になるか
  - 入力が正しいかを、どこでどう確かめているか
  - 入力が正しくないとき、画面と状態がどうなるか

---

## 3.1 読む範囲

この章で読むのは、フォームの「追加」ボタンを押してから、明細ができるまでです。

| ファイル | 読む場所 |
| --- | --- |
| `practice/app/index.html` | フォーム（14〜27行目） |
| `practice/app/src/main.ts` | `submit` イベントの処理（40〜61行目） |
| `practice/app/src/validate.ts` | 全部（62 行） |

<!-- app-map: chapter=3 -->

`validate.ts` の関数は、画面の要素を使っていないので、ブラウザを開かなくても `node` で呼んで試せます。この章の「確かめ方」では、次の手順で試します。

1. 次の内容を `practice/exercises/P03-form/src/try.ts` という名前で保存する
   ```ts
   import { isValidDate, parseAmount, parseEntryForm } from "./validate.ts";

   console.log(parseAmount("800"));
   console.log(
     parseEntryForm(
       { kind: "expense", date: "2026-11-10", amount: "800", category: "食費", source: "", memo: "" },
       "id-1",
     ),
   );
   ```
2. `node practice/exercises/P03-form/src/try.ts` で実行する
3. 1 行目の `import` は残し、その下の `console.log` を書き換えて、もう一度実行する

`parseEntryForm` には、6 つの項目をすべて書いたオブジェクトを渡します。

`try.ts` は試すためのファイルなので、改修の変更をコミットする前に消します。この後の章でも同じです。

## 3.2 入力欄の値は文字列

入力欄の値（`value`）は、数字を入力しても文字列です（本編第2章、本編第10章）。文字列を数値にするのは `Number(文字列)` で、主な決まりは次の 3 つです。

- 前後の空白は除いてから読みます。
- 数として読めない文字列は `NaN`（数値ではないことを表す特別な数値）になります（本編第2章）。
- 空の文字列（空白を除くと何も残らないもの）は `0` になります。

### 問題 1

次のコードは、入力欄から読んだ値を想定したものです（このアプリのコードではありません）。①〜⑤ で、それぞれ何が表示されますか。

```ts
const first = "800";
const second = "1200";

console.log(first + second);                 // ①
console.log(Number(first) + Number(second)); // ②
console.log(Number("  "));                   // ③
console.log(Number("12px"));                 // ④
console.log(Number("1.5"));                  // ⑤
```

<details>
<summary>答えと解説</summary>

```
8001200
2000
0
NaN
1.5
```

- ① 文字列どうしの `+` は連結です。金額を文字列のまま合計すると、こうなります。
- ③ 空白だけの文字列は、空白を除くと空の文字列なので `0` です。エラーにも `NaN` にもなりません。
- ④ 先頭が数字でも、全体を数として読めなければ `NaN` です。
- ⑤ 小数もそのまま数値になります。

`Number()` で数値にするだけでは足りません。空欄は `0` になり、小数も通ります。このアプリの金額は「1 円以上の整数」なので、数値にした後で、その条件を調べます。

**確かめ方**：このコードを `try.ts` に貼り付けて実行します。

</details>

### 問題 2

「追加」ボタンを押すと、`main.ts` の次の部分が動きます。

`practice/app/src/main.ts`（43〜53行目）

```ts
  const result = parseEntryForm(
    {
      kind: elements.kind.value,
      date: elements.date.value,
      amount: elements.amount.value,
      category: elements.category.value,
      source: elements.source.value,
      memo: elements.memo.value,
    },
    crypto.randomUUID(),
  );
```

`practice/app/src/validate.ts`（3〜10行目）

```ts
export type FormInput = {
  kind: string;
  date: string;
  amount: string;
  category: string;
  source: string;
  memo: string;
};
```

読むのに必要な書き方は次の 2 つです。

- `crypto.randomUUID()` は、ほかと重ならない文字列（`"cbe4fbcb-eb5e-..."` の形）を作る、ブラウザと Node.js の機能です。明細の `id` に使います。
- テストの `assert.deepEqual(実際の値, 期待する値)` は、2 つのオブジェクトの中身が同じかを検査します。

1. `amount` の型は、`FormInput` では `string`、`Entry` では `number` です。文字列から数値に変えているのは、どの関数ですか。`validate.ts` の `parseEntryForm` の中で、`input.amount` を使っている行を探して答えてください。
2. `id` は、`parseEntryForm` の中で作らずに引数で渡しています。中で `crypto.randomUUID()` を呼ぶ形にすると、何が困りますか。`practice/app/src/validate.test.ts` の「parseEntryForm は支出の入力から支出の明細を作る」のテストを読んで考えてください。

<details>
<summary>答えと解説</summary>

1. `validate.ts` の `parseAmount` です。`parseEntryForm` の最初のほう（29行目）で呼んでいます。

   `main.ts` は、入力欄の値を文字列のまままとめて渡します。文字列を検査して、正しい型の値（`Entry`）に変える仕事は、`validate.ts` にまとめてあります。`FormInput` は「まだ検査していない入力」、`Entry` は「検査が済んだ明細」を表しています。

2. テストで、結果を決まった値と比べられなくなります。

   テストは、`parseEntryForm(expenseInput, "id-1")` の結果を、`id: "id-1"` を含むオブジェクトと比べています。`id` を中で作ると、実行するたびに違う値になり、この比べ方ができません。実行するたびに結果が変わるもの（ランダムな値、今の日時など）は、関数の外から渡すと、テストしやすくなります。

</details>

## 3.3 金額と日付を確かめる

### 問題 3

`practice/app/src/validate.ts`（14〜25行目）

```ts
export function isValidDate(text: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(text);
}

export function isValidAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount >= 1;
}

export function parseAmount(text: string): number | null {
  const amount = Number(text);
  return isValidAmount(amount) ? amount : null;
}
```

読むのに必要な書き方は次の 2 つです。

- `/^\d{4}-\d{2}-\d{2}$/` は**正規表現**（文字列の形を表す書き方）で、「数字 4 けた、`-`、数字 2 けた、`-`、数字 2 けた」という形を表します。
- `.test(text)` は、`text` がその形なら `true` を返します。

1. 次の文字列を `parseAmount` に渡すと、それぞれ何が返りますか。

   | 渡す文字列 | 返る値 |
   | --- | --- |
   | `"800"` | ？ |
   | `""` | ？ |
   | `"0"` | ？ |
   | `"1.5"` | ？ |
   | `"abc"` | ？ |
   | `"1,000"` | ？ |
   | `" 800 "`（前後に空白） | ？ |

2. `isValidDate("2026-13-45")` は、何を返しますか。

<details>
<summary>答えと解説</summary>

1. 次のとおりです。

   | 渡す文字列 | `Number()` の結果 | 返る値 |
   | --- | --- | --- |
   | `"800"` | `800` | `800` |
   | `""` | `0` | `null`（1 以上でない） |
   | `"0"` | `0` | `null` |
   | `"1.5"` | `1.5` | `null`（整数でない） |
   | `"abc"` | `NaN` | `null` |
   | `"1,000"` | `NaN` | `null`（`,` があると数として読めない） |
   | `" 800 "` | `800` | `800`（前後の空白は除いて読む。3.2） |

2. `true` を返します。

   `isValidDate` が調べているのは形だけで、13 月 45 日のような、ありえない日付も通ります。このアプリでは、日付の入力欄が `<input type="date">` なので、ブラウザが正しい日付だけを `"2026-11-10"` の形で返します。そのため、形の確認だけで済ませています。保存されたデータを読む `storage.ts` の `toEntry` も同じ関数を使うので、そちらでは実在しない日付も通ります。

`parseAmount` の戻り値の型は `number | null` です。呼び出す側は、`null` かどうかを確かめないと、数値として使えません（本編第6章）。

`NaN` は、`Number.isInteger(NaN)` が `false` になるので、`isValidAmount` で除かれます。`NaN` かどうかを別に確かめる必要はありません。

**確かめ方**：`try.ts` で `parseAmount` と `isValidDate` を呼んで試します。`validate.test.ts` の「parseAmount は 1 以上の整数だけを数値にする」のテストにも、`"1,000"` と `" 800 "` 以外の例が並んでいます。テストは、関数が何をするべきかを示す例としても読めます（第5章で詳しく扱います）。

</details>

## 3.4 明細を作る

### 問題 4

`practice/app/src/validate.ts`（34〜49行目）

```ts
  const errors: string[] = [];
  if (kind !== "income" && kind !== "expense") {
    errors.push("種別を選んでください");
  }
  if (!isValidDate(date)) {
    errors.push("日付を入力してください");
  }
  if (amount === null) {
    errors.push("金額は 1 以上の整数で入力してください");
  }
  if (kind === "expense" && category === "") {
    errors.push("分類を選んでください");
  }
  if (kind === "income" && source === "") {
    errors.push("入金元を入力してください");
  }
```

この後の 52〜54 行目で、`errors` に 1 つでもメッセージが入っていれば、`{ ok: false, errors }` を返しています。

種別が「支出」で、日付が `"2026-11-10"`、金額が `"0"`、分類が空の入力を渡したとします。

1. `parseEntryForm` は、何を返しますか。
2. 最初の間違いを見つけた時点で `return` せず、`errors` に集めてから返しているのは、なぜですか。
3. 同じ入力で、種別だけを「収入」に変え、入金元を `"給料"` にすると、メッセージはいくつ返りますか。

<details>
<summary>答えと解説</summary>

1. 次のオブジェクトを返します。

   ```ts
   {
     ok: false,
     errors: ["金額は 1 以上の整数で入力してください", "分類を選んでください"],
   }
   ```

2. 直す場所を、一度に全部知らせるためです。1 つずつ返すと、利用者は「直す → 追加を押す → 次のエラーが出る」を繰り返します。
3. 1 つです（金額）。分類の確認は `kind === "expense" &&` が付いているので、収入のときは行われません。

**確かめ方**：`try.ts` で、問いの入力を `parseEntryForm` に渡します。

</details>

### 問題 5

問題 4 の抜粋のすぐ後に、次の `if` があります。

`practice/app/src/validate.ts`（52〜54行目）

```ts
  if (errors.length > 0 || amount === null) {
    return { ok: false, errors };
  }
```

この `if` から、`|| amount === null` を消したとします。

1. 型エラーになります。どの変数の、どんな型が問題になりますか。この `if` の後の 56〜59 行目を読んで答えてください。
2. `amount` が `null` のとき、`errors` には必ずメッセージが入っています（41〜43行目）。それでも型エラーになるのは、なぜですか。

<details>
<summary>答えと解説</summary>

1. `amount` です。型が `number | null` のままなので、`Entry` の `amount`（`number`）に入れられません。エラーの最後の 2 行は次のとおりです。

   ```
   Type 'number | null' is not assignable to type 'number'.
     Type 'null' is not assignable to type 'number'.
   ```

2. 型チェックは、「`amount` が `null` なら `errors` は空でない」という、2 つの変数の間の関係までは追いかけないからです。

型チェックが絞り込むのは、その変数についての条件を調べたときです。`errors.length > 0` は `errors` についての確認で、`amount` については何も言っていません。`errors` が空のとき、`amount` は `null` ではありません。そのため、`amount === null` を足しても実行時の動きは変わりません。型を絞り込むためだけに書き足しています。

**確かめ方**：改修用フォルダ（`practice/exercises/P03-form/src/validate.ts`）で `|| amount === null` を消すと、その下の `const entry` に赤い波線が出ます。

</details>

### 問題 6

フォームで種別を「収入」にすると、分類の選択欄は隠れ、入金元の入力欄が表示されます。隠れた欄も、値を持ったままです。分類の選択欄は、何も触らなければ先頭の項目が選ばれています（分類は `public/categories.json` の順に並びます）。

分類の読み込みが終わった画面で、種別を「収入」にして、日付と金額を正しく入れ、入金元に `"給料"` と入れて「追加」を押したとします。

1. `parseEntryForm` に渡される `FormInput` の `category` には、何が入っていますか。問題 2 の `main.ts` の抜粋を見て答えてください。
2. できあがる明細に、`category` は入りますか。`validate.ts` の 56〜59 行目を読んで答えてください。

<details>
<summary>答えと解説</summary>

1. 分類の選択欄で選ばれている値が入っています。何も触っていなければ、先頭の `"食費"` です。
2. 入りません。

`practice/app/src/validate.ts`（56〜59行目）

```ts
  const entry: Entry =
    kind === "income"
      ? { kind: "income", id, date, amount, source }
      : { kind: "expense", id, date, amount, category };
```

`main.ts` は、種別に関係なく、全部の入力欄の値を渡します。どの値を使うかを決めるのは `parseEntryForm` です。収入のときは `source` だけを、支出のときは `category` だけを使って、明細を作ります。

**確かめ方**：`try.ts` で、`kind: "income"` と `category: "食費"` の両方を持つ入力を `parseEntryForm` に渡し、結果を表示します。

</details>

## 3.5 検証の結果を画面に出す

### 問題 7

`practice/app/src/main.ts`（54〜60行目）

```ts
  if (!result.ok) {
    update(setFormErrors(state, result.errors));
    return;
  }

  elements.form.reset();
  update(addEntry(state, result.entry));
```

`elements.form.reset()` は、フォームの入力欄を最初の状態に戻します（本編第10章）。

1. 金額を空にしたまま「追加」を押したとき、入力済みの日付やメモは、消えますか。残りますか。
2. エラーのメッセージは、どのファイルのどの行で、画面に表示されますか。`formErrors` を全文検索して探してください（第1章の 1.3）。
3. エラーが表示されている状態で、正しく入力し直して「追加」を押すと、エラーの表示は消えます。このとき消しているのは、どの関数ですか。

<details>
<summary>答えと解説</summary>

1. 残ります。`reset()` を呼ぶのは検証に成功したときだけです。失敗したときは、その前の `return` で処理が終わります。
2. `render.ts` の `renderForm` の最後の行（52行目）です。

   `practice/app/src/render.ts`（52行目）

   ```ts
     elements.formErrors.replaceChildren(...state.formErrors.map((message) => createText("li", message)));
   ```

   `createText("li", message)` は、その文字の入った `<li>` を作る、`render.ts` の中の関数です。

3. `state.ts` の `addEntry` です。新しい状態を作るときに `formErrors: []` にしています。検索で出る `setFormKind` も `formErrors` を空にしますが、こちらは種別を切り替えたときに動きます。

エラーのメッセージも、状態（`state.formErrors`）に入っています。`setFormErrors` で状態に入れ、`render` が状態から `<li>` を作ります。エラーを消すときも、画面を直接触らず、状態を空の配列にします。第1章で読んだ「状態を変える → 画面を作り直す」の形をここでも守っています。

**確かめ方**：`npm run dev P03` で起動し、日付とメモを入れ、金額を空にして「追加」を押します。入力が残ること、エラーが表示されること、金額を入れてもう一度「追加」を押すと消えることを見ます。

</details>

### 問題 8

`practice/app/index.html`（21〜22行目）

```html
        <label>日付 <input id="date" type="date" /></label>
        <label>金額 <input id="amount" inputmode="numeric" autocomplete="off" /></label>
```

- `inputmode="numeric"` は、スマートフォンで数字のキーボードを出すための指定です。
- `autocomplete="off"` は、以前に入力した値の候補を、ブラウザに出させないための指定です。

1. 金額の入力欄に、`abc` と入力できますか。
2. HTML には、`<input type="number" min="1">` のように、入力できる値を制限する書き方があります。それを使ったとしても、`validate.ts` の確認を消してはいけません。なぜですか。

<details>
<summary>答えと解説</summary>

1. できます。`inputmode="numeric"` は、出すキーボードを変えるだけで、入力できる文字は制限しません。入力した後で「追加」を押すと、`parseAmount` が `null` を返し、エラーが表示されます。
2. HTML の制限は、必ず守られるとは限らないからです。

TypeScript の型は実行時に消えます。`elements.amount.value` に何が入っているかを、型は保証してくれません。HTML の制限も、開発者ツールで属性を書き換えれば外せます。ブラウザによって、動きが違うこともあります。

そのため、このアプリでは画面から来る値を、`validate.ts` の 1 か所で実行時に確かめています。

**確かめ方**：1 は、画面で金額に `abc` と入れて「追加」を押します。

</details>

## まとめ

「追加」ボタンを押してから、明細が一覧に表示されるまで（成功の場合）と、エラーが表示されるまで（失敗の場合）の流れを説明してください。ファイルと関数の名前を使います。

<details>
<summary>説明の例</summary>

1. `main.ts` の `submit` の処理が、入力欄の値を文字列のまま `FormInput` にまとめ、`parseEntryForm` に渡す。
2. `parseEntryForm`（`validate.ts`）が、金額を `parseAmount` で数値にし、日付・金額・分類（または入金元）を確かめる。間違いは `errors` に集める。
3. 間違いがあれば、`{ ok: false, errors }` を返す。`main.ts` が `setFormErrors` で状態に入れ、`update` → `render` で、エラーが表示される。入力は残る。
4. 間違いがなければ、種別に合った形の明細を作って `{ ok: true, entry }` を返す。`main.ts` がフォームを空に戻し（種別は、`render` が状態から選び直すので、選んだまま残る）、`addEntry` で状態に足す。`update` → `render` で、今の絞り込みに合えば一覧に表示される。

どちらの場合も、第1章の図1-3 の流れ（操作 → `state.ts` の関数 → `update` → `render`）を 1 回通ります。

</details>

---

## 改修：メモの長さを確かめる

メモを 20 文字以内に制限します。20 文字を超えていたら、「メモは 20 文字以内で入力してください」というエラーを表示します。

**進め方**

#### メモの長さを調べる関数を書く

1. `practice/exercises/P03-form/src/validate.ts` の、一番下の `isValidMemo` の `throw` の行を書き換える
   - 文字列の長さは `文字列.length` で分かります（本編第1章）
   ```sh
   npm test P03
   ```
   - **こうなれば OK**：テストの表示で、`isValidMemo` の行に `✔` が付く（`parseEntryForm` のメモのテストは、まだ失敗します）

#### 入力の検査に組み込む

2. `parseEntryForm` に、メモの確認を足す
   - 場所は、入金元の確認（`if (kind === "income" && source === "")`）のすぐ下です
   - 数えるのは、32 行目の変数 `memo`（前後の空白を除いたメモ）です
   ```sh
   npm test P03
   ```
   - **こうなれば OK**：「テスト: OK」
3. 画面を起動し、次を 1 つずつ試す
   ```sh
   npm run dev P03
   ```
   - [ ] ほかの欄は正しく入れ、メモに 21 文字以上を入れて「追加」を押すと、エラーが表示され、明細は追加されない
   - [ ] そのとき、入力した内容は残っている
   - [ ] メモを 20 文字以内に直して「追加」を押すと、明細が追加され、エラーが消える

#### 仕上げる

4. 画面を `Ctrl` + `C` で止め、`src/try.ts` を作っていたら消す
   ```sh
   git status
   ```
   - **こうなれば OK**：表示に `try.ts` が出ない
5. 型チェックとテストを実行する
   ```sh
   npm run check P03
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
6. 自分の変更を差分で読む
   ```sh
   git diff practice/exercises/P03-form
   ```
   - **こうなれば OK**：`validate.ts` だけが表示される
7. コミットする
   ```sh
   git add practice/exercises/P03-form
   git commit -m "実践編 第3章 改修: メモの長さを確かめる"
   ```
   - **こうなれば OK**：表示の 1 行目に、付けたメッセージが出る

**テストで確かめるもの**（主なもの）

| 呼び出し | 返す値 |
| --- | --- |
| `isValidMemo(20 文字の文字列)` | `true` |
| `isValidMemo(21 文字の文字列)` | `false` |
| `parseEntryForm`（メモが 21 文字。ほかは正しい） | `{ ok: false, errors: ["メモは 20 文字以内で入力してください"] }` |
| `parseEntryForm`（メモが、前後に空白の付いた 20 文字） | 成功。明細の `memo` は、空白を除いた 20 文字 |
| `parseEntryForm`（支出で分類が空、メモが 21 文字） | 分類のメッセージ、メモのメッセージの順 |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- `isValidMemo`：`isValidAmount` と同じ形（条件の式をそのまま返す）
- `parseEntryForm`：問題 4 の抜粋の最後の `if` の下

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- `isValidMemo`：`return memo.length <= 20;`
- `parseEntryForm`：`if (!isValidMemo(memo)) { errors.push("メモは 20 文字以内で入力してください"); }` を、入金元の確認の下に足します。

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

| 表示 | よくある原因 |
| --- | --- |
| テスト「isValidMemo は…」で `false !== true` | 20 文字ちょうどを `false` にしています。`<` ではなく `<=` を使います |
| テスト「メモが 20 文字を超えていれば…」で、`+` の行に `entry: {...}` と `ok: true`、`-` の行に `errors: [...]` | `parseEntryForm` に、メモの確認を足していません。または、`return { ok: false, errors };` の後に足しています |
| テスト「メモの前後の空白を除いてから…」で、`+` の行に `errors: [...]` と `ok: false` | `input.memo`（空白を除く前）の長さを数えています。変数 `memo` を使います。`isValidMemo` のテストも `false !== true` で落ちているなら、原因は `<=` を `<` と書いていることです |
| テスト「メモのメッセージを、ほかのメッセージの後に返す」で、`+` の行と `-` の行に、同じメモのメッセージが出る | メッセージの順番が違います。メモの確認を、ほかの確認より前に書いています |
| テスト「分類や入金元のメッセージよりも後に返す」だけが失敗する | メモの確認を、ほかの確認の途中に書いています。入金元の確認の下に移します |
| テスト「収入でもメモの長さを確かめる」が失敗する | 支出のときだけ確かめています |
| `parseEntryForm` のテストが、これまで合格していたものも含めて 10 個すべて失敗する | 条件が逆です。`isValidMemo(memo)` の前の `!` を忘れていないかを見ます |
| テストは合格するが、画面でエラーが表示されない | 改修用フォルダではなく、完成版（`npm run dev app`）を起動しています |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[practice/solutions/P03-form/src/validate.ts](../solutions/P03-form/src/validate.ts)

---

## チェックリスト

- [ ] 入力欄の値を `Number()` で数値にするだけでは足りない理由を、例を挙げて説明できる
- [ ] `if (errors.length > 0 || amount === null)` の `amount === null` が、何のためにあるかを説明できる
- [ ] HTML で入力を制限しても、コードでの確認が要る理由を説明できる

## 詳しく学ぶ

- JavaScript Primer：[暗黙的な型変換](https://jsprimer.net/basic/implicit-coercion/)（`Number()` での変換と `NaN`）、[文字列](https://jsprimer.net/basic/string/)（正規表現での検索）
- サバイバルTypeScript：[number型](https://typescriptbook.jp/reference/values-types-variables/number)、[型の絞り込み](https://typescriptbook.jp/reference/statements/control-flow-analysis-and-type-guard)
