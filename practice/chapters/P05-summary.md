# 実践編 第5章 集計とテスト

- **この章で学ぶこと**
  - テストを、関数が何をするべきかを示す仕様として読む
  - 配列のメソッドをつなげた処理で、値が 1 段ずつどう変わるか
  - `Map` を使った、項目ごとの合計の作り方

---

## 5.1 読む範囲

この章で読むのは、絞り込み・並べ替え・集計をしている `summary.ts` と、そのテストです。

| ファイル | 内容 |
| --- | --- |
| `practice/app/src/summary.ts` | 絞り込み・並べ替え・集計の関数（53 行） |
| `practice/app/src/summary.test.ts` | そのテスト |
| `practice/app/src/testdata.ts` | テストで使う明細（4 件） |

<!-- app-map: chapter=5 -->

`monthOf` は日付の文字列から月を取り出します。ほかの関数は明細の配列を受け取り、計算した結果を返します。どれも画面の要素を使っていないので、テストで検査できます。完成版のテストは `npm test app` で実行できます。

関数は、`try.ts`（第3章）を作って呼んで試せます。

- 置き場所：`practice/exercises/P05-summary/src/try.ts`
- 実行：`node practice/exercises/P05-summary/src/try.ts`
- 先頭には、次のように `import` を書きます

```ts
import { listMonths, totalsByCategory } from "./summary.ts";
import { sampleEntries } from "./testdata.ts";

console.log(listMonths(sampleEntries));
console.log(totalsByCategory(sampleEntries));
```

`totalsBySource` のテストは、章末の改修でこの関数を書くまで「まだ実装していません」と表示され、失敗します。

確かめ方で `npm test P05` を実行したら、書き換えた関数の `✖` の行と、その下の「失敗の内容」だけを見ます。

## 5.2 テストと中身を読む

知らない関数を読むときは、中身より先にテストを読むと、早く分かります。テストには、「何を渡すと何が返るか」の例が書いてあります。

### 問題 1

テストで使う明細は次の 4 件です。

`practice/app/src/testdata.ts`（3〜8行目）

```ts
export const sampleEntries: Entry[] = [
  { kind: "income", id: "a", date: "2026-10-25", amount: 200000, source: "給料" },
  { kind: "expense", id: "b", date: "2026-10-28", amount: 800, category: "食費", memo: "昼食" },
  { kind: "expense", id: "c", date: "2026-11-02", amount: 1200, category: "交通費" },
  { kind: "expense", id: "d", date: "2026-11-05", amount: 500, category: "食費" },
];
```

`practice/app/src/summary.test.ts`（6〜8行目）

```ts
test("listMonths は明細のある月を、新しい順に重複なく返す", () => {
  assert.deepEqual(listMonths(sampleEntries), ["2026-11", "2026-10"]);
});
```

`assert.deepEqual(実際の値, 期待する値)` は、配列やオブジェクトの中身が同じかを検査します。

このテストだけから分かる `listMonths` のことを、3 つ挙げてください（`summary.ts` は読みません）。

<details>
<summary>答えと解説</summary>

- 月は、`"2026-11"` の形の文字列で返す（日付の先頭 7 文字）
- 同じ月の明細が何件あっても、その月は 1 回だけ返す（10 月の明細は 2 件、11 月の明細も 2 件ある）
- 新しい月を先に返す

テストの名前が、関数のするべきことを 1 文で言っています。期待する値は、その具体的な例です。テストデータと見比べると、名前に書かれていない決まり（月の形）も読み取れます。

テストは、**実行して確かめられる仕様書**です。

**確かめ方**：`try.ts` で `listMonths(sampleEntries)` を表示します（5.1 の例）。

</details>

### 問題 2

`practice/app/src/summary.ts`（8〜21行目）

```ts
export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function listMonths(entries: Entry[]): string[] {
  const months: string[] = [];
  for (const entry of entries) {
    const month = monthOf(entry.date);
    if (!months.includes(month)) {
      months.push(month);
    }
  }
  return months.sort().reverse();
}
```

読むのに必要な書き方は次の 4 つです。

- `文字列.slice(0, 7)` は、先頭から 7 文字を取り出します。
- `配列.includes(値)` は、その値が配列に入っていれば `true` を返します。
- `配列.sort()` は、引数を渡さないと、文字列として小さい順に並べ替えます。
- `配列.reverse()` は、順番を逆にします。

1. `sampleEntries` を渡したとき、20 行目の `return` の直前で、`months` の中身はどうなっていますか。
2. 月は文字列のままなのに、`sort()` で古い順に並びます。なぜですか。
3. もし 9 月が `"2026-9"` と 1 文字で書かれていたら、`["2026-11", "2026-9", "2026-10"].sort()` の結果はどうなりますか。
4. `sort` は、元の配列を並べ替えます（本編第7章）。ここでは、コピーせずに `months.sort()` と書いています。それで構わないのは、なぜですか。

<details>
<summary>答えと解説</summary>

1. `["2026-10", "2026-11"]` です。明細の順に見ていき、まだ入っていない月だけを足しています。
2. 年が 4 けた、月が 2 けたで、けた数がそろっているからです。文字列は、先頭から 1 文字ずつ比べられます。けた数がそろっていれば、文字列としての順番と日付としての順番が同じになります。
3. 結果は `["2026-10", "2026-11", "2026-9"]` になり、9 月が最後に来てしまいます（`"9"` は `"1"` より大きいため）。
4. `months` は、この関数の中で新しく作った配列だからです。関数の外の配列は変わりません。

このアプリは、この性質を使って、日付を `"2026-11-05"` の形の文字列のまま扱っています。文字列のままで、月の取り出しも並べ替えも比較もできます。

**確かめ方**：`try.ts` で、`console.log(["2026-11", "2026-9", "2026-10"].sort());` を実行します。

</details>

## 5.3 配列のメソッドをつなげる

### 問題 3

`practice/app/src/summary.ts`（23〜27行目）

```ts
export function filterEntries(entries: Entry[], filter: Filter): Entry[] {
  return entries
    .filter((entry) => filter.month === "all" || monthOf(entry.date) === filter.month)
    .filter((entry) => filter.kind === "all" || entry.kind === filter.kind);
}
```

`sampleEntries` と、`{ month: "2026-10", kind: "expense" }` を渡したとします。

1. 1 つ目の `filter`（25行目）を通った後に残る明細の `id` は、どれですか。
2. 2 つ目の `filter`（26行目）を通った後に残る明細の `id` は、どれですか。
3. `{ month: "all", kind: "all" }` を渡すと、何が返りますか。`filter.month === "all" ||` の部分は、何のためにありますか。

<details>
<summary>答えと解説</summary>

1. `a` と `b` です（10 月の明細）。
2. `b` だけです（`a` は収入）。
3. 4 件すべてが返ります。`filter.month === "all" ||` は、「すべて」を選んだときに絞り込まないためにあります。`||` は、左が `true` なら、右を調べずに `true` になります。

メソッドをつなげた処理は、**1 段ずつ、その時点の配列の中身を書き出して**読みます。

| 段 | 残る明細 |
| --- | --- |
| 最初 | a、b、c、d |
| 月が `"2026-10"` | a、b |
| 種別が `"expense"` | b |

`filter` は、元の配列を変えずに新しい配列を返します。そのため、状態の `entries` は、絞り込んでも変わりません（第1章の問題 7）。

**確かめ方**：`summary.test.ts` の「filterEntries は月と種別で絞り込む」のテストに、4 通りの例があります。`try.ts` でも試せます。

</details>

### 問題 4

`practice/app/src/summary.ts`（29〜31行目）

```ts
export function sortByDate(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}
```

`practice/app/src/summary.test.ts`（19〜23行目）

```ts
test("sortByDate は日付の新しい順に並べ、元の配列を変えない", () => {
  const before = sampleEntries.map((entry) => entry.id);
  assert.deepEqual(sortByDate(sampleEntries).map((entry) => entry.id), ["d", "c", "b", "a"]);
  assert.deepEqual(sampleEntries.map((entry) => entry.id), before);
});
```

読むのに必要な書き方は次の 2 つです。

- `a.localeCompare(b)` は、文字列 `a` が `b` より前なら負の数、後なら正の数、同じなら `0` を返します。
- `sort` に渡す関数は、負の数を返すと「1 つ目の引数を前に並べる」という意味です（本編第7章）。

1. このテストは、2 つのことを検査しています。何と何ですか。それぞれ、どの行ですか。
2. `[...entries]` を `entries` に変えて、`return entries.sort(...)` にすると、テストはどうなりますか。
3. `b.date.localeCompare(a.date)` を `a.date.localeCompare(b.date)` に変えると、並び順はどうなりますか。

<details>
<summary>答えと解説</summary>

1. 日付の新しい順に並ぶこと（21行目）と、渡した配列が変わらないこと（22行目）です。
2. 失敗します。22 行目で、`sampleEntries` の順番が変わってしまったことが見つかります。
3. 日付の古い順になります。

**確かめ方**：改修用フォルダの `src/summary.ts` で書き換えて、`npm test P05` を実行します。`sortByDate` の行を見ます。

</details>

### 問題 5

`practice/app/src/summary.ts`（33〜41行目）

```ts
export function totalOf(entries: Entry[], kind: EntryKind): number {
  return entries
    .filter((entry) => entry.kind === kind)
    .reduce((sum, entry) => sum + entry.amount, 0);
}

export function balanceOf(entries: Entry[]): number {
  return totalOf(entries, "income") - totalOf(entries, "expense");
}
```

1. `totalOf(sampleEntries, "expense")` で、`reduce` に渡した関数は 3 回呼ばれます。それぞれの回の `sum` と、関数が返す値を書いてください。
2. `balanceOf([])` は、何を返しますか。エラーになりませんか。

<details>
<summary>答えと解説</summary>

1. 次のとおりです。最後に返った `2500` が `totalOf` の戻り値です。

   | 回 | `sum` | `entry.amount` | 返す値 |
   | --- | --- | --- | --- |
   | 1 | `0` | `800` | `800` |
   | 2 | `800` | `1200` | `2000` |
   | 3 | `2000` | `500` | `2500` |

2. `0` を返します。エラーになりません。

`reduce` の 2 つ目の引数 `0` が、`sum` の最初の値です（本編第7章）。配列が空なら、関数は 1 回も呼ばれず、最初の値の `0` がそのまま返ります。`balanceOf([])` は `0 - 0` で `0` です。

**確かめ方**：`summary.test.ts` の「totalOf と balanceOf は合計と収支を返す」のテストに同じ値が書かれています。

</details>

## 5.4 項目ごとに合計する

### 問題 6

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

**`Map`** は、キーと値の組を入れておく入れ物です（本編第8章）。この関数で使っている書き方は次のとおりです。

| 書き方 | 意味 |
| --- | --- |
| `new Map<string, number>()` | キーが文字列、値が数値の、空の `Map` を作る |
| `totals.get(キー)` | そのキーの値を返す。なければ `undefined` を返す |
| `totals.set(キー, 値)` | そのキーに値を入れる。すでにあれば、置き換える |
| `[...totals]` | `[キー, 値]` の組の配列にする。順番は、キーを入れた順 |
| `([category, total]) => ...` | 引数で受け取った `[キー, 値]` の組を、分割代入で 2 つの変数に分ける |
| `(...) => ({ category, total })` | オブジェクトをそのまま返すアロー関数。`{ }` を `( )` で囲む。囲まないと、関数の本体の `{ }` として読まれる |

`A ?? B` は、`A` が `null` か `undefined` なら `B` に、そうでなければ `A` になります（本編第6章）。

`sampleEntries` を渡したとします。

1. `for` の中で、明細を 1 件ずつ処理するたびに、`totals` の中身はどう変わりますか。
2. 50 行目の `[...totals]` は、どんな配列になりますか。
3. 関数の戻り値は、どうなりますか。
4. 47 行目の `?? 0` を消すと、どうなりますか。

<details>
<summary>答えと解説</summary>

1. 次のとおりです。

   | 明細 | `totals` の中身 |
   | --- | --- |
   | a（収入） | 空のまま（`if` を通らない） |
   | b（食費 800） | 食費 → 800 |
   | c（交通費 1200） | 食費 → 800、交通費 → 1200 |
   | d（食費 500） | 食費 → 1300、交通費 → 1200 |

2. `[["食費", 1300], ["交通費", 1200]]` です。
3. `[{ category: "食費", total: 1300 }, { category: "交通費", total: 1200 }]` です。
4. 型エラーになります。

   ```
   Object is possibly 'undefined'.
   ```

47 行目では、今までの合計にこの明細の金額を足して入れ直します。その分類が初めて出てきたときは、`get` が `undefined` を返すので、`?? 0` で `0` から始めています。`get` の戻り値の型は `number | undefined` なので、`?? 0` がないと、足し算に使えません。

**確かめ方**：`try.ts` で、`totalsByCategory(sampleEntries)` を表示します。改修用フォルダの `src/summary.ts` の `for` の中に `console.log(totals, [...totals]);` を入れると、1 件ずつの変化と、配列にしたときの形が見えます。

</details>

## 5.5 変更を読む

### 問題 7

`summary.ts` に、次の変更が入ったとします。

```diff
   return [...totals]
     .map(([category, total]) => ({ category, total }))
-    .sort((a, b) => b.total - a.total);
+    .sort((a, b) => a.total - b.total);
 }
```

1. 画面のどこの表示が、どう変わりますか（`render.ts` の `renderSummary` で表示しています）。
2. この変更は、型チェックで見つかりますか。テストで見つかりますか。

<details>
<summary>答えと解説</summary>

1. 「分類ごとの支出」の並び順が、金額の小さい順に変わります。
2. 型チェックでは見つかりません。テストで見つかります。「totalsByCategory は支出を分類ごとに合計し、金額の大きい順に返す」のテストが失敗します。

`b.total - a.total` も `a.total - b.total` も結果は数値です。型はどちらも正しいので、型チェックは通ります。**型チェックが見るのは、値の種類が合っているかどうかまで**です。並び順や計算の結果が正しいかどうかはテストで確かめます。

小さい順に変えるのが目的なら、テストの名前と期待する値も一緒に直します。差分にテストの変更が入っていなければ、「意図せずに変わったのでは」と疑えます。

**確かめ方**：改修用フォルダの `src/summary.ts` で書き換えて、`npm test P05` を実行します。`totalsByCategory` の行を見ます。

</details>

### 問題 8

`summary.ts` に、次の変更が入ったとします。

```diff
 export function totalOf(entries: Entry[], kind: EntryKind): number {
   return entries
     .filter((entry) => entry.kind === kind)
-    .reduce((sum, entry) => sum + entry.amount, 0);
+    .reduce((sum, entry) => sum + entry.amount);
 }
```

読むのに必要なことは次の 2 つです。

- `reduce` は、最初の値を渡さないと、配列の最初の要素を `sum` の最初の値として使います。
- そのため、空の配列に最初の値を渡さずに `reduce` を使うと、エラー（例外。ここでは `TypeError`）を投げます。

1. この変更は、型チェックで見つかりますか。`sum` の型が何になるかを考えて答えてください。
2. 型チェックをせずに実行したとします。支出の明細だけがあり、収入が 1 件もない配列を `balanceOf`（39〜41行目。問題 5）に渡すと、何が起きますか。

<details>
<summary>答えと解説</summary>

1. 見つかります。`sum` の型が `Entry` になるからです。最初の値を渡さないと、`sum` の型は配列の要素の型になります。型エラーは 2 つ出ます。

   ```
   Type 'Entry' is not assignable to type 'number'.
     Type 'Expense' is not assignable to type 'number'.
   Operator '+' cannot be applied to types 'Entry' and 'number'.
   ```

   1 つ目は `return` の行で、`reduce` の結果（`Entry`）を `number` として返せない、というエラーです。2 つ目は、明細に数値を足せない、というエラーです。

2. エラーが投げられ、`balanceOf` は値を返しません。

   ```
   TypeError: Reduce of empty array with no initial value
   ```

`balanceOf` は `totalOf(entries, "income")` を呼びます。収入が 1 件もないので、`filter` の結果が空の配列になり、`reduce` がエラーを投げます。収入の側でエラーが投げられた時点で処理が止まるので、支出の側の `totalOf` は呼ばれません。集計の関数では、空の配列を渡したときにどうなるかをテストします。テストの `balanceOf([])` の行がそれに当たります。

**確かめ方**：改修用フォルダの `src/summary.ts` で書き換えると、`return` と `sum + entry.amount` に赤い波線が出ます。2 は、`try.ts` に次の内容を書いて実行します。`node` は型チェックをしないので、型エラーがあっても実行できます。

```ts
import { balanceOf } from "./summary.ts";
import { sampleEntries } from "./testdata.ts";

console.log(balanceOf(sampleEntries.slice(1))); // 支出の 3 件だけ
```

`TypeError: Reduce of empty array with no initial value` と表示され、その下に `at Array.reduce`・`at totalOf`・`at balanceOf` の行が並びます。

</details>

## まとめ

`totalsByCategory` が何をする関数かを、次の 3 つに分けて説明してください。

1. 何を受け取り、何を返すか
2. 中で、どういう順に処理しているか
3. 収入の明細は、どう扱われるか

<details>
<summary>説明の例</summary>

1. 明細の配列を受け取り、分類とその合計の組（`{ category, total }`）の配列を返す。合計の大きい順に並んでいる。
2. 空の `Map` を作り、明細を 1 件ずつ見て、その分類の今までの合計に金額を足して入れ直す。最後に、`Map` を `[分類, 合計]` の組の配列にし、オブジェクトに変えて、合計の大きい順に並べ替える。
3. `if (entry.kind === "expense")` を通らないので、無視される。収入には分類がないので、この `if` がないと型エラーになる。

</details>

---

## 改修：入金元ごとの収入を表示する

「分類ごとの支出」の下に、「入金元ごとの収入」を表示します。収入を入金元ごとに合計し、金額の大きい順に並べます。HTML の見出しとリスト（`id="source-totals"`）、要素の取得（`elements.sourceTotals`）は、改修用フォルダに用意してあります。

**進め方**

#### 入金元ごとに合計する関数を書く

1. `practice/exercises/P05-summary/src/summary.ts` の、一番下の `totalsBySource` の `throw` の行を書き換える
   - `totalsByCategory`（問題 6）と同じ形で書けます
   - 戻り値は、すぐ上の型 `SourceTotal`（`{ source, total }`）の配列です
   ```sh
   npm test P05
   ```
   - **こうなれば OK**：「テスト: OK」

#### 画面につなぐ

2. 画面を起動したままにする
   ```sh
   npm run dev P05
   ```
   - **こうなれば OK**：家計簿の画面が表示される
3. 収入を 3 件、次の順に追加する
   - 日付は、どれも月の選択欄にまだない同じ月（2027 年 3 月など）にします
   - 副業 30,000 円、給料 200,000 円、給料 180,000 円の順です
   - **こうなれば OK**：追加した 3 件が一覧に表示される
4. `practice/exercises/P05-summary/src/render.ts` の `renderSummary` で、`elements.sourceTotals` に結果を表示する
   - 「分類ごとの支出」を表示している行と同じ形で書けます
   - `createText("li", 文字列)` は、その文字列の入った `<li>` を作ります
   - ほかのファイルの関数は、先頭の `import` に名前を足すと使えます
   - **こうなれば OK**：「入金元ごとの収入」の下に、入金元ごとの合計が表示される
5. 画面で次を 1 つずつ試す
   - [ ] 月を手順 3 の月にすると、「入金元ごとの収入」の下に `給料: 380,000円`、`副業: 30,000円` の順に表示される
   - [ ] 月をほかの月にすると、その月の収入だけの合計に変わる
   - [ ] 種別を「支出」にすると、「入金元ごとの収入」の下に何も表示されない

#### 仕上げる

6. 画面を `Ctrl` + `C` で止め、`src/try.ts` を作っていたら消す
   ```sh
   git status
   ```
   - **こうなれば OK**：表示に `try.ts` が出ない
7. 型チェックとテストを実行する
   ```sh
   npm run check P05
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
8. 自分の変更を差分で読む
   ```sh
   git diff practice/exercises/P05-summary
   ```
   - **こうなれば OK**：`summary.ts` と `render.ts` の 2 つのファイルが表示される
9. コミットする
   ```sh
   git add practice/exercises/P05-summary
   git commit -m "実践編 第5章 改修: 入金元ごとの収入を表示する"
   ```
   - **こうなれば OK**：表示の 1 行目に、付けたメッセージが出る

**テストで確かめるもの**

次の 5 件の明細を渡したときの結果を調べます。

| 種別 | 入金元（収入） | 分類（支出） | 金額 |
| --- | --- | --- | --- |
| 収入 | 給料 | — | 200,000 |
| 収入 | 副業 | — | 30,000 |
| 支出 | — | 交通費 | 1,200 |
| 収入 | 給料 | — | 180,000 |
| 収入 | 臨時収入 | — | 50,000 |

| 呼び出し | 返す値 |
| --- | --- |
| `totalsBySource(上の 5 件)` | `[{ source: "給料", total: 380000 }, { source: "臨時収入", total: 50000 }, { source: "副業", total: 30000 }]` |
| `totalsBySource([])` | `[]` |
| `totalsBySource(支出が 1 件だけの配列)` | `[]` |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- 表示：`renderSummary` の `elements.categoryTotals.replaceChildren(...)` の 5 行

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- `totalsBySource`：`totalsByCategory` の中身をコピーして、`"expense"` を `"income"` に変え、`category` を `source` に変えます（`category` は 4 か所）。
- `render.ts`：次の形で足します。

  ```ts
  elements.sourceTotals.replaceChildren(
    ...totalsBySource(entries).map(({ source, total }) => createText("li", `${source}: ${formatYen(total)}`)),
  );
  ```

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

| 表示 | よくある原因 |
| --- | --- |
| 型チェックで（複数行なら最後の行に）`Property 'source' does not exist on type 'Expense'.` | 種別を確かめる前に `entry.source` を読んでいるか、`if` の条件が `"expense"` のままです。`if (entry.kind === "income")` の中で読みます |
| 型チェックで `Property 'category' does not exist on type 'Income'.` | `if` の条件は直しましたが、中が `entry.category` のままです |
| 型チェックで `Property 'source' is missing in type '{ category: string; total: number; }' but required in type 'SourceTotal'.` | 返すオブジェクトのプロパティの名前が、`category` のままです |
| テストで、`副業` と `臨時収入` の順番が逆 | 並べ替えていません。`Map` から取り出した順（入れた順）のままです |
| テストで、`給料` が最後に来る | 並べ替えの向きが逆です。`b.total - a.total` にします |
| 型チェックで `Cannot find name 'totalsBySource'.` | `render.ts` で `totalsBySource` を `import` していません。`implicitly has an 'any' type` が一緒に出ても、`import` を足せば消えます |
| テストは合格するが、画面に何も表示されない | `render.ts` をまだ直していません。または、収入の明細がありません |
| テストは合格するが、「入金元ごとの収入」の下に、分類が表示される | `render.ts` で、`totalsByCategory` を呼んだままです。`totalsBySource` を呼びます |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[practice/solutions/P05-summary/src/summary.ts](../solutions/P05-summary/src/summary.ts)、[practice/solutions/P05-summary/src/render.ts](../solutions/P05-summary/src/render.ts)

> **コラム: 同じ形の関数が 2 つになったら**
> `totalsByCategory` と `totalsBySource` はほとんど同じ形です。共通の部分を、1 つの関数にまとめる書き方もあります。ただし、まとめると読む人が追う場所が増えます。2 つまでは並べて書いたままでよく、まとめるかは 3 つ目が要るときに考えます。

---

## チェックリスト

- [ ] `sortByDate` が、並べ替える前に配列をコピーしている理由を説明できる
- [ ] `reduce` の 2 つ目の引数の `0` が、何のためにあるかを説明できる
- [ ] 並び順の向きが変わる変更が、型チェックでは見つからず、テストで見つかる理由を説明できる

## 詳しく学ぶ

- JavaScript Primer：[配列](https://jsprimer.net/basic/array/)（`filter`・`map`・`reduce`・`sort`）、[Map/Set](https://jsprimer.net/basic/map-and-set/)
- サバイバルTypeScript：[Map<K, V>](https://typescriptbook.jp/reference/builtin-api/map)、[配列の破壊的操作](https://typescriptbook.jp/reference/values-types-variables/array/array-operations)
