# 実践編 第2章 データの型

- **この章で学ぶこと**
  - 型の定義から、その型の値を作る場所と使う場所をたどる読み方
  - 収入と支出のように、種類によって持つ項目が違うデータを、型でどう表しているか
  - 型に項目を 1 つ足したとき、型チェックが何を教えてくれるか

---

## 2.1 読む範囲と、使う道具

この章で読むのは `practice/app/src/types.ts`（39 行）と、その型を使っている箇所です。先に `types.ts` を開いて、全体を眺めてください。

<!-- app-map: chapter=2 -->

型の定義から関係するコードへ移動するには、エディタの機能を使います（VS Code の場合）。

| 機能 | 操作 | 分かること |
| --- | --- | --- |
| ホバー | 変数や型の名前に、マウスカーソルを合わせる | その場所での型 |
| 定義へ移動 | 名前の上で `F12` | その型や関数が、どこで定義されているか |
| 参照へ移動 | 名前の上で `Shift` + `F12` | その型や関数が、どこで使われているか |

キーが効かないときは、名前の上で右クリックして、メニューの「定義へ移動」「参照へ移動」を選びます。

試しに書き換えるときは、改修用フォルダ `practice/exercises/P02-types/` を使います。完成版から作ったもので、前の章の改修は入っていません。完成版と違う点は 2 つです。

- 最初から、`src/testdata.ts` とテストのファイルに型エラーが出ています。章末の改修で直すものなので、今はそのままにします。
- 改修のための行が足してあるので、`validate.ts`・`main.ts`・`render.ts` などの行番号が、途中から数行ずれます。本文の行番号は、完成版（`practice/app/`）のものです。

問題で波線を見るときは、自分が書き換えたファイルだけを見ます。最初からある型エラーがあっても、画面（`npm run dev P02`）は起動できます。

## 2.2 素朴な版で困ること

このアプリの明細には、収入と支出の 2 種類があります。支出には分類（食費など）、収入には入金元（給料など）があります。

### 問題 1

次のコードは、収入と支出を 1 つの型で表した書き方です（このアプリのコードではありません）。読むのに必要なことは次の 2 つです。

- `?` は、省略できるプロパティの印です（本編第5章）。省略したプロパティを読むと `undefined` です。
- テンプレートリテラル（`` `${...}` ``）には、どんな値でも入れられます。`undefined` を入れると、`undefined` という文字になります（`` `${undefined}` `` は `"undefined"`）。

```ts
type Entry = {
  kind: "income" | "expense";
  id: string;
  date: string;
  amount: number;
  category?: string;
  source?: string;
};

function entryLabel(entry: Entry) {
  return entry.kind === "income" ? entry.source : entry.category;
}

const entry: Entry = { kind: "expense", id: "1", date: "2026-11-01", amount: 500, source: "給料" };
console.log(`${entryLabel(entry)}: ${entry.amount}円`);
```

1. `const entry` の行は、型エラーになりますか。
2. 実行すると、何が表示されますか。
3. `entryLabel` の戻り値の型は何ですか。

<details>
<summary>答えと解説</summary>

1. 型エラーになりません。
2. `undefined: 500円` と表示されます。
3. `string | undefined` です。

この型では、`category` も `source` も省略できます。そのため、「支出なのに分類がなく、入金元がある」というありえない明細を書いても型チェックを通ります。

困ることは 2 つあります。

- 間違ったデータを、型チェックで見つけられない。
- `category` と `source` を使う場所すべてで、`undefined` の場合を考えないといけない。

このアプリでは、収入と支出の型を分けて、この 2 つを避けています。

**確かめ方**：このコードを `practice/exercises/P02-types/src/naive.ts` という新しいファイルに貼り付けて、`node practice/exercises/P02-types/src/naive.ts` で実行します。`entryLabel` にマウスカーソルを合わせると、戻り値の型が見えます。確かめたら、ファイルを消します。

</details>

## 2.3 明細の型を読む

### 問題 2

`practice/app/src/types.ts`（1〜19行目）

```ts
export type Income = {
  kind: "income";
  id: string;
  date: string;
  amount: number;
  source: string;
  memo?: string;
};

export type Expense = {
  kind: "expense";
  id: string;
  date: string;
  amount: number;
  category: string;
  memo?: string;
};

export type Entry = Income | Expense;
```

次の a〜d のうち、`Entry` 型の変数に代入すると型エラーになるのは、どれですか。

```ts
const a: Entry = { kind: "income", id: "1", date: "2026-11-01", amount: 3000, source: "給料" };
const b: Entry = { kind: "expense", id: "2", date: "2026-11-01", amount: 500, source: "給料" };
const c: Entry = { kind: "expense", id: "3", date: "2026-11-01", amount: 500, category: "食費", memo: "昼食" };
const d: Entry = { kind: "transfer", id: "4", date: "2026-11-01", amount: 500, category: "食費" };
```

<details>
<summary>答えと解説</summary>

型エラーになるのは b と d です。

| | 結果 | 理由 |
| --- | --- | --- |
| a | 通る | `Income` の形に合っている。`memo` は省略できる |
| b | エラー | `kind` が `"expense"` なので `Expense` として調べられる。`Expense` に `source` はない（`category` もないが、エラーは先に余分な `source` を知らせる） |
| c | 通る | `Expense` の形に合っている |
| d | エラー | `kind` に書けるのは `"income"` か `"expense"` だけ |

エラーメッセージは次のとおりです。

```
b: Object literal may only specify known properties, and 'source' does not exist in type 'Expense'.
d: Type '"transfer"' is not assignable to type '"expense" | "income"'.
```

`Entry` は、**判別可能なユニオン型**です（本編第6章）。`Income` と `Expense` のどちらにも `kind` があり、その値で、どちらの型かが決まります。問題 1 の型と違い、`Entry` 型の変数にオブジェクトを直接書くと、「支出なのに入金元がある」明細は型エラーになります。

**確かめ方**：改修用フォルダの `src/types.ts` の一番下に、a〜d の 4 行を貼り付けて、赤い波線が出る行を見ます。

</details>

### 問題 3

型の定義を読んだら、次に「その型の値をどこで作っているか」を探します。

1. `Entry` 型の値を新しく作っている関数は、アプリの中に 2 つあります。1 つは `storage.ts` の `toEntry` で、保存されたデータから明細を作ります。もう 1 つは、どのファイルの、何という関数ですか。
   - 探し方：`types.ts` の `Entry` の上で「参照へ移動」を使います。
   - 選ぶのは、明細のオブジェクト（`{ kind: "income", ... }` や、短く書いた `{ kind, ... }`）を書いて返している関数です。`Entry` を受け取るだけの関数は選びません。
   - テストのファイルと `testdata.ts` は除きます。
2. `toEntry` の次の抜粋を読み、`memo` のある支出のデータを読み込んだとき、26 行目で返す明細が持つプロパティを、すべて挙げてください。

`practice/app/src/storage.ts`（20〜27行目）

```ts
  const common = typeof memo === "string" ? { id, date, amount, memo } : { id, date, amount };

  if (kind === "income" && typeof source === "string") {
    return { kind, ...common, source };
  }
  if (kind === "expense" && typeof category === "string") {
    return { kind, ...common, category };
  }
```

2 を読むのに必要なことは次の 2 つです。

- `kind`・`memo`・`category` などの変数は、12 行目の `const { kind, id, date, amount, source, category, memo } = record;` で、保存されたデータから取り出した値です（分割代入。本編第4章）。型は `unknown` で、使う前に `typeof` などで確かめています。
- `...common` は、`common` の中身をコピーするスプレッド構文です（本編第4章）。

<details>
<summary>答えと解説</summary>

1. `validate.ts` の `parseEntryForm` です。フォームの入力から明細を作ります。

`practice/app/src/validate.ts`（56〜61行目）

```ts
  const entry: Entry =
    kind === "income"
      ? { kind: "income", id, date, amount, source }
      : { kind: "expense", id, date, amount, category };

  return { ok: true, entry: memo === "" ? entry : { ...entry, memo } };
```

明細が生まれるのは、アプリの外からデータが入ってくる 2 か所です。ほかの場所（`state.ts`、`summary.ts`、`render.ts` など）は、できあがった `Entry` を受け取って使います。名前が似ている `addEntry`（`state.ts`）も、受け取った明細を配列に足すだけで、明細そのものは作っていません。

2. `kind`・`id`・`date`・`amount`・`memo`・`category` の 6 つです。

- `memo` が文字列なので、20 行目の `common` は `{ id, date, amount, memo }` です。
- 26 行目は、`kind` と、`common` の中身と、`category` を並べたオブジェクトを返します。
- どちらの関数も、収入と支出を別々のオブジェクトの書き方で作っています。支出に項目を足すときは、2 つの関数の支出の側を直します（章末の改修）。

`toEntry` の検査の部分は第6章で、`parseEntryForm` の検証の部分は第3章で読みます。

</details>

## 2.4 種別で処理を分けている場所を読む

作る場所の次は、使う場所を読みます。

### 問題 4

`practice/app/src/format.ts`（12〜17行目）

```ts
export function entryLabel(entry: Entry): string {
  if (entry.kind === "income") {
    return entry.source;
  }
  return entry.category;
}
```

1. 14 行目と 16 行目で、`entry` の型はそれぞれ何ですか。
2. 関数の中身を `return entry.source;` の 1 行だけにすると、どうなりますか。

<details>
<summary>答えと解説</summary>

1. 14 行目は `Income`、16 行目は `Expense` です。

   `if (entry.kind === "income")` の中では、`entry` は `Income` に絞り込まれます。`if` の中で `return` しているので、その後ろに来るのは `Income` でなかった場合だけです。そのため 16 行目では `Expense` に絞り込まれ、`entry.category` を読めます。

2. 型エラーになります。

```
Property 'source' does not exist on type 'Entry'.
  Property 'source' does not exist on type 'Expense'.
```

絞り込む前の `entry` は `Entry`（`Income` か `Expense`）です。`source` は `Expense` にないので、読めません。エラーメッセージの 2 行目がその理由を示しています。

**確かめ方**：`practice/app/src/format.ts` の 14 行目と 16 行目の `entry` に、マウスカーソルを合わせます。

</details>

### 問題 5

`practice/app/src/summary.ts`（43〜53行目）

```ts
export function totalsByCategory(entries: Entry[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    if (entry.kind === "expense") {
      totals.set(entry.category, (totals.get(entry.category) ?? 0) + entry.amount);
    }
  }
  return [...totals]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
```

この関数は、分類ごとの支出の合計を作ります（`Map` を使った集計の読み方は、第5章で扱います）。

1. 46 行目の `if` を外して、47 行目だけを残すと、どうなりますか。
2. アプリの中で、明細の `kind` を見ている場所を、すべて挙げてください。全文検索で `entry.kind` を探します。「含めるファイル」は `practice/app/src` にし（第1章の 1.3）、テストのファイルの結果は除きます。

<details>
<summary>答えと解説</summary>

1. 型エラーになります。収入（`Income`）には `category` がありません。

```
Property 'category' does not exist on type 'Entry'.
  Property 'category' does not exist on type 'Income'.
```

2. `practice/app/src` の中（テストを除く）では次の 6 か所です。

| 場所 | していること |
| --- | --- |
| `format.ts` 8 行目 | 金額に付ける符号（`+` か `-`）を決める |
| `format.ts` 13 行目 | 入金元と分類のどちらを表示するかを決める（問題 4） |
| `summary.ts` 26 行目 | 種別の条件に合う明細だけを残す |
| `summary.ts` 35 行目 | 収入だけ、または支出だけを合計する |
| `summary.ts` 46 行目 | 支出だけを、分類ごとに合計する |
| `render.ts` 93 行目 | 金額の色を変えるためのクラスの名前（`amount-income` か `amount-expense`）を作る |

`amount` や `date` は、`Income` にも `Expense` にもあるので、`kind` を見ずに読めます。`kind` を調べる必要があるのは、片方にしかない項目を読むときと、種別で動きを変えるときです。

明細の種別に関わる表示や集計を直すときは、まずこの 6 か所を調べます。

**確かめ方**：1 は、改修用フォルダの `src/summary.ts` で `if` を外し、47 行目の赤い波線を見ます。

</details>

### 問題 6

`memo` は、`Income` と `Expense` の両方にある、省略できる項目です。

`practice/app/src/render.ts`（82〜84行目）

```ts
  if (entry.memo !== undefined) {
    description.append(createText("span", ` ${entry.memo}`, "memo"));
  }
```

1. 82 行目の `entry.memo` の型は何ですか。
2. `if` を外して、83 行目だけを残すと、型エラーになりますか。メモのない明細は、画面でどう表示されますか。
3. 問題 3 で読んだ `validate.ts` の 61 行目は、メモの入力が空のとき、`memo: ""` を持つ明細ではなく、`memo` を持たない明細を作っています。なぜですか。

<details>
<summary>答えと解説</summary>

1. `string | undefined` です。
2. 型エラーになりません。画面には、分類（収入なら入金元）の後ろに `undefined` という文字が表示されます。

   テンプレートリテラルに `undefined` を入れると `"undefined"` になることは、問題 1 と同じです。型チェックを通っても、表示が正しいとは限りません。省略できる項目を表示するときは、`undefined` の場合を自分で除きます。

3. 「メモがない」ことの表し方を、1 つにそろえるためです。

   `memo: ""` の明細と `memo` のない明細の両方があると、82 行目の `if` は `""` を通してしまい、空のメモの `<span>` が作られます。作る側で形をそろえておけば、使う側は `undefined` かどうかを見るだけで済みます。

**確かめ方**：改修用フォルダの `src/render.ts` で `if` を外し、`npm run dev P02` で起動して、メモを空にした明細を追加します。

</details>

## 2.5 明細のほかの型を読む

判別可能なユニオン型は、明細のほかにも使われています。

### 問題 7

`practice/app/src/types.ts`（28〜31行目）

```ts
export type CategoriesState =
  | { status: "loading" }
  | { status: "ready"; items: string[] }
  | { status: "error"; message: string };
```

1. `CategoriesState` は、分類の一覧の読み込みの状況を表す型です。3 つの状況は、それぞれ何を持っていますか。
2. `CategoriesState` の 3 つの状況の値は、それぞれどのファイルの何行目で作っていますか。全文検索で `status: "` を探します。「含めるファイル」は `practice/app/src` にし（第1章の 1.3）、`types.ts` とテストのファイルの結果は除きます。
3. `CategoriesState` 型の変数の初期値に、`{ status: "loading", items: ["食費"] }` を直接書けますか。

<details>
<summary>答えと解説</summary>

1. 次のとおりです。

| `status` | 意味 | 持っているもの |
| --- | --- | --- |
| `"loading"` | 読み込み中 | なし |
| `"ready"` | 読み込めた | `items`（分類の一覧） |
| `"error"` | 失敗した | `message`（画面に出すメッセージ） |

2. 次の 3 か所です。

| `status` | 作っている場所 | 作る時 |
| --- | --- | --- |
| `"loading"` | `state.ts` 8 行目（`createInitialState`） | ページを開いたとき |
| `"ready"` | `main.ts` 32 行目（`loadCategories`） | 分類を読み込めたとき |
| `"error"` | `main.ts` 36 行目（`loadCategories`） | 読み込みに失敗したとき |

問題 3 と同じく、型を読んだら、その型の値を作る場所を探します。`"ready"` の値は、分類を読み込めたときにだけ作ります。`items` を持たない `"ready"` は型エラーになるので、書けません。

3. 書けません。型エラーになります。

```
Object literal may only specify known properties, and 'items' does not exist in type '{ status: "loading"; }'.
```

ここでは `status` が、`Entry` の `kind` と同じ役目をしています。「読み込み中なのに一覧がある」「失敗したのにメッセージがない」という、ありえない組み合わせを直接書くと、型エラーになります。

**確かめ方**：3 は、改修用フォルダの `src/types.ts` の一番下に `const x: CategoriesState = { status: "loading", items: ["食費"] };` を貼り付けて、赤い波線を見ます。

</details>

### 問題 8

`practice/app/src/types.ts`（21〜26行目）

```ts
export type EntryKind = "income" | "expense";

export type Filter = {
  month: string;
  kind: "all" | EntryKind;
};
```

`practice/app/src/main.ts`（63〜68行目）

```ts
elements.kind.addEventListener("change", () => {
  const kind = elements.kind.value;
  if (kind === "income" || kind === "expense") {
    update(setFormKind(state, kind));
  }
});
```

読むのに必要なことは次の 2 つです。

- `setFormKind` の 2 つ目の引数の型は `EntryKind` です。
- `"change"` は、選択欄の値が変わったときに起きるイベントです。

1. 64 行目の `kind` の型は何ですか。66 行目の `kind` の型は何ですか。
2. 65 行目の `if` を外して、66 行目だけを残すと、どうなりますか。
3. `Filter` の `kind` に書ける値をすべて挙げてください。

<details>
<summary>答えと解説</summary>

1. 64 行目は `string`、66 行目は `"income" | "expense"` です。
2. 型エラーになります。

```
Argument of type 'string' is not assignable to parameter of type 'EntryKind'.
```

3. `"all"`、`"income"`、`"expense"` の 3 つです。

選択欄の `value` の型はいつも `string` です。HTML の `<option>` に何が書かれているかを型チェックは知りません。そこで、65 行目の `if` で、値が `"income"` か `"expense"` かどうかを実行時に調べています。この `if` は、型を絞り込む役目も兼ねています。

`"all" | EntryKind` のように、ユニオン型の中に、別のユニオン型の名前を書けます。`"all" | "income" | "expense"` と書くのと同じです。

**確かめ方**：`practice/app/src/main.ts` の 64 行目と 66 行目の `kind` に、マウスカーソルを合わせます。

</details>

### 問題 9

このアプリには、判別可能なユニオン型が 3 つあります。`Entry`（`kind` で判別）、`CategoriesState`（`status` で判別）と、もう 1 つです。

`true` や `false` も、`"income"` と同じように、1 つの値だけを表す型（リテラル型）として書けます。

1. 3 つ目は `types.ts` にはありません。問題 3 で読んだ `parseEntryForm` の戻り値の型です。`parseEntryForm` の名前の上で「定義へ移動」を使い、戻り値の型を探してください。何というプロパティで判別していますか。
2. その型の値を使っている `main.ts` の 54〜60 行目で、60 行目の `result.entry` を読めるのは、なぜですか。

<details>
<summary>答えと解説</summary>

1. `validate.ts` の `ParseResult` です。`ok` で判別しています。

`practice/app/src/validate.ts`（12行目）

```ts
export type ParseResult = { ok: true; entry: Entry } | { ok: false; errors: string[] };
```

2. 54 行目の `if (!result.ok)` の中で `return` しているからです。

`practice/app/src/main.ts`（54〜60行目）

```ts
  if (!result.ok) {
    update(setFormErrors(state, result.errors));
    return;
  }

  elements.form.reset();
  update(addEntry(state, result.entry));
```

`if` の中では、`result` は `{ ok: false; errors: string[] }` に絞り込まれ、`result.errors` を読めます。`if` の後ろに来るのは `ok` が `true` の場合だけなので、`result.entry` を読めます。問題 4 の `entryLabel` と同じ形です。

| 型 | 判別するプロパティ | 表しているもの |
| --- | --- | --- |
| `Entry` | `kind` | 明細の種別（収入・支出） |
| `CategoriesState` | `status` | 読み込みの状況（読み込み中・成功・失敗） |
| `ParseResult` | `ok` | 入力の検証の結果（成功・失敗） |

**確かめ方**：改修用フォルダの `src/main.ts` で、`if (!result.ok) { ... }` の 4 行を消すと、`result.entry` に赤い波線が出ます。

</details>

## まとめ

`Entry` 型について、次の 3 つを自分の言葉で説明してください。

1. 収入と支出を、1 つの型ではなく 2 つの型に分けている理由
2. `Entry` の値を作っている場所
3. `Entry` の値を使う側で、`kind` を確かめる必要があるのは、どんなときか

<details>
<summary>説明の例</summary>

1. 収入は入金元、支出は分類と、持つ項目が違うから。1 つの型にして両方を省略できるようにすると、ありえない組み合わせを型チェックで見つけられない。使う場所すべてで `undefined` の場合も考えることになる。
2. フォームの入力から作る `parseEntryForm`（`validate.ts`）と、保存されたデータから作る `toEntry`（`storage.ts`）の 2 か所。どちらも、アプリの外からデータが入ってくる場所。
3. 片方にしかない項目（`source`、`category`）を読むときと、種別で動きを変えるとき。`kind` を確かめると、その先では `Income` か `Expense` に絞り込まれる。

</details>

---

## 改修：支出に「固定費」の項目を足す

支出の明細に、固定費かどうかを表す項目 `fixed` を足し、一覧で「交通費（固定費）」のように表示します。固定費は、家賃や定期券など、毎月決まって出ていくお金です。フォームの側（チェック欄の HTML、要素の取得、入力の読み取り）は、改修用フォルダに用意してあります。足すのは、型と、その型の値を作る場所・使う場所です。

**進め方**

#### 型に項目を足す

1. 型チェックを実行し、最初から出ている型エラーを読む
   - エラーの出る `testdata.ts` とテストのファイル（`.test.ts`）は、書き換えません
   - `// @ts-expect-error` は「次の行は型エラーになるはず」という印です。次の行に型エラーがないと、`Unused '@ts-expect-error' directive.` が出ます
   ```sh
   npm run typecheck P02
   ```
   - **こうなれば OK**：`'fixed' does not exist in type 'Expense'` が 4 つと、`Unused '@ts-expect-error' directive.` が 1 つ（初期状態）
2. `practice/exercises/P02-types/src/types.ts` の `Expense` に、`fixed: boolean` を足す
   - `?` は付けません（テストが型チェックで調べます）
   - 型エラーは、先頭のファイルの名前と、最後の行（`Property 'fixed' is missing ...`）だけを読みます
   ```sh
   npm run typecheck P02
   ```
   - **こうなれば OK**：型エラーが `validate.ts` と `storage.ts` の 2 か所だけになる

#### 型エラーをたどって直す

3. `src/validate.ts` で、支出を作っている行に `fixed` を足す
   - チェック欄の値は `input.fixed`（`boolean` 型）です
   - 型エラーは `const entry: Entry =` の行に出ますが、直すのはその下の支出の行です。収入には足しません
   ```sh
   npm run typecheck P02
   ```
   - **こうなれば OK**：型エラーが `storage.ts` の 1 つだけになる
4. `src/storage.ts` の `toEntry`（問題 3）で、支出を返す行に `fixed` を足す
   - 保存された値は、`const { kind, id, ... } = record;` に `fixed` を足すと取り出せます（型は `unknown`）
   - `値 === true` は、値が `true` のときだけ `true` です。`unknown` 型の値にも使えます
   - `fixed` のない古い支出は、捨てずに、固定費でない支出として読みます
   ```sh
   npm run typecheck P02
   ```
   - **こうなれば OK**：「型チェック: OK」
5. `src/format.ts` の `entryLabel` を直す
   - `entry.fixed` が `true` なら `` `${entry.category}（固定費）` `` を返します（括弧は全角）
   ```sh
   npm test P02
   ```
   - **こうなれば OK**：「テスト: OK」

#### 画面で見る

6. 画面を起動し、次を試す
   ```sh
   npm run dev P02
   ```
   - [ ] チェックを入れて追加した支出は、一覧に「分類（固定費）」と表示される
   - [ ] チェックを入れずに追加した支出と、収入は、これまでどおりに表示される
   - [ ] ページを読み込み直しても、「（固定費）」の表示が残る
   - 完成版やほかの章の版は `fixed` を知りません。そちらで明細を追加・削除すると、保存し直されて `fixed` が消えます。第2章の画面に戻って「（固定費）」が消えていても、改修の誤りではありません

#### 仕上げる

7. 画面を `Ctrl` + `C` で止め、型チェックとテストを実行する
   ```sh
   npm run check P02
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
8. 自分の変更を差分で読む
   ```sh
   git diff practice/exercises/P02-types
   ```
   - **こうなれば OK**：`types.ts`・`validate.ts`・`storage.ts`・`format.ts` の 4 つのファイルが表示される
9. コミットする
   ```sh
   git add practice/exercises/P02-types
   git commit -m "実践編 第2章 改修: 支出に「固定費」の項目を足す"
   ```
   - **こうなれば OK**：表示の 1 行目に、付けたメッセージが出る

**テストで確かめるもの**（主なもの）

| 呼び出し | 返す値 |
| --- | --- |
| `parseEntryForm`（支出。固定費にチェックあり） | `{ ok: true, entry: … }`（`entry` は `fixed: true` を持つ支出） |
| `parseEntryForm`（収入） | `{ ok: true, entry: … }`（`entry` は `fixed` を持たない収入） |
| `parseStoredEntries`（`fixed` のない支出を保存したもの） | `fixed: false` の支出 1 件の配列 |
| `parseStoredEntries`（`fixed` が `"no"` のような、`true` でも `false` でもない値の支出） | `fixed: false` の支出 1 件の配列 |
| `entryLabel`（分類が交通費で、`fixed` が `true` の支出） | `"交通費（固定費）"` |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- `validate.ts`：問題 3 の抜粋の、支出を作っている行
- `storage.ts`：問題 3 の 2 の抜粋の、支出の明細を返している行
- `format.ts`：`entryLabel` の最後の行（問題 4）。ここでは `entry` が `Expense` に絞り込まれています

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- `types.ts`：`Expense` に `fixed: boolean;` を足します。
- `validate.ts`：支出の明細を `{ kind: "expense", id, date, amount, category, fixed: input.fixed }` にします。
- `storage.ts`：`const { kind, id, ... } = record;` の行に `fixed` を足し、支出を返す行を `{ kind, ...common, category, fixed: fixed === true }` にします。
- `format.ts`：最後の行を、`entry.fixed` が `true` なら `` `${entry.category}（固定費）` ``、そうでなければ `entry.category` を返すようにします。

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

| 表示 | よくある原因 |
| --- | --- |
| 型チェックで `'fixed' does not exist in type 'Expense'`（`testdata.ts`、`state.test.ts`） | `types.ts` の `Expense` に、まだ `fixed` を足していません |
| 型チェックで `Unused '@ts-expect-error' directive.`（`validate.test.ts`） | `Expense` に `fixed` を足していないか、`fixed?: boolean` と `?` を付けています。`types.ts` を直しても新しい型エラーが出ないときも、`?` を付けていないかを確かめます |
| 型チェックのエラーの最後の行が `Property 'fixed' is missing in type '{ ... }' but required in type 'Expense'.` | そのファイルで作っている支出の明細に `fixed` がありません（`validate.ts` で直す行は、手順 3） |
| 型チェックで `No value exists in scope for the shorthand property 'fixed'.` | `{ ..., fixed }` と短く書いていますが、`fixed` という名前の変数がありません。`validate.ts` では `fixed: input.fixed` と書きます |
| 型チェックで `Type 'unknown' is not assignable to type 'boolean'.`（`storage.ts`） | 保存されたデータの `fixed` を、確かめずにそのまま入れています。`fixed === true` にします |
| 型チェックで `'fixed' does not exist in type 'Income'`（`validate.ts`） | 収入の明細にも `fixed` を入れています |
| 型チェックで `Property 'fixed' does not exist on type 'Entry'.`（`format.ts`） | `kind` を確かめる前に `entry.fixed` を読んでいます。`Expense` に絞り込まれた後で読みます |
| テストで `+ fixed: false` `- fixed: true`、または `+ fixed: true` `- fixed: false`（`parseEntryForm`） | `fixed` に、入力の値ではなく決まった値を入れています |
| テスト「保存した明細をそのまま読み戻す」で、収入の明細に `+ fixed: false` | `storage.ts` で、`fixed` を `common` に入れています。収入にも `fixed` が付いてしまいます（この間違いは、型チェックでは見つかりません） |
| テスト「fixed が true でも false でもない支出…」が失敗する | `Boolean(fixed)` のように、`true` 以外の値も `true` にしています。`fixed === true` にします |
| テスト「fixed のない支出…を、fixed が false の支出として読む」が失敗し、期待する明細が `-` の行で丸ごと表示される | `fixed` がない支出を捨てています。`typeof fixed === "boolean"` を条件に足すと、こうなります |
| テストで `+ '交通費'` `- '交通費（固定費）'` | `entryLabel` を、まだ直していません |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[practice/solutions/P02-types/src/types.ts](../solutions/P02-types/src/types.ts)、[practice/solutions/P02-types/src/validate.ts](../solutions/P02-types/src/validate.ts)、[practice/solutions/P02-types/src/storage.ts](../solutions/P02-types/src/storage.ts)、[practice/solutions/P02-types/src/format.ts](../solutions/P02-types/src/format.ts)

> **コラム: 型を変えると、直す場所を型チェックが教えてくれる**
> 手順 2 で、`types.ts` に 1 行足しただけで、`validate.ts` と `storage.ts` に型エラーが出ました。どちらも、問題 3 で探した「`Entry` の値を作っている場所」です。項目を省略できない形（`fixed: boolean`）で足したので、作る場所の直し忘れを、型チェックが見つけてくれます。`fixed?: boolean` にすると、作る場所に型エラーは出ず、直し忘れに気づけません。

---

## チェックリスト

- [ ] 収入と支出を 1 つの型にまとめた場合に困ることを、2 つ説明できる
- [ ] `entryLabel` の中で、`entry` の型がどこで `Income` に、どこで `Expense` に絞り込まれるかを説明できる
- [ ] 選択欄の値（`string`）を `EntryKind` として扱う前に、`if` で確かめている理由を説明できる

## 詳しく学ぶ

- サバイバルTypeScript：[判別可能なユニオン型](https://typescriptbook.jp/reference/values-types-variables/discriminated-union)、[オプションプロパティ](https://typescriptbook.jp/reference/values-types-variables/object/optional-property)、[リテラル型](https://typescriptbook.jp/reference/values-types-variables/literal-types)、[制御フロー分析と型ガードによる型の絞り込み](https://typescriptbook.jp/reference/statements/control-flow-analysis-and-type-guard)
- JavaScript Primer：[オブジェクト](https://jsprimer.net/basic/object/)（プロパティの短縮記法、スプレッド構文）
