# 実践編 第7章 変更を読む・総合

- **この章で学ぶこと**
  - ほかの人が足した機能を、差分から読み解く
  - 差分に混ざった、意図しない動きの変化を見つける
  - 症状だけが書かれた報告から、原因の場所を自分で探す

---

## 7.1 この章の進め方

この章では、どのファイルをどの順で読むかを自分で選びます。使える読み方は、次のとおりです。

| 読み方 | 扱った章 |
| --- | --- |
| 動かしてから読む、ファイルの名前から見当を付ける、全文検索で探す | 第1章 |
| 型の定義から、作る場所と使う場所をたどる（定義へ移動、参照へ移動） | 第2章 |
| `node` で関数を呼んで確かめる | 第3章 |
| イベントからたどる、開発者ツールで要素とクラスを見る、`debugger;` で止める、差分を読む | 第4章 |
| テストを仕様として読む | 第5章 |
| 開発者ツールで、保存されたデータと通信を見る | 第6章 |

**場面の設定**：同僚が、家計簿のアプリに「検索」の機能を足しました。絞り込みの欄に入力欄が増え、文字を入れると、その文字を含む明細だけが一覧に表示されます。あなたは、この変更を読んで確かめる役です。

| フォルダ | 中身 |
| --- | --- |
| `practice/app/` | 変更の前（これまで読んできた完成版） |
| `practice/exercises/P07-changes/` | 変更の後（検索の機能が入った版）。この章の改修用フォルダでもあります |

`npm run dev P07` で起動して、検索の欄を使います。メモを「昼食」にした支出を 1 件追加し、検索の欄に「昼」と入れます。結果を見たら、画面を `Ctrl` + `C` で止めます。

次のコマンドで、変更の前と後の差分を表示できます（`--no-index` は、2 つのフォルダやファイルを直接比べる指定です）。このコマンドは章末の改修で使います。フォルダ全体の差分には、改修で探す箇所も入っているためです。問題では、本文に載せた差分を読みます。

```sh
git diff --no-index practice/app practice/exercises/P07-changes
```

ファイルを 1 つだけ比べるときは、2 つのファイルの名前を並べます。

```sh
git diff --no-index practice/app/src/state.ts practice/exercises/P07-changes/src/state.ts
```

表示が長いときは、`q` キーで終わります。

本文の差分は、ファイル名を示す行（`diff --git`〜`+++`）を省き、`@@` の行から載せています。

## 7.2 変更の全体をつかむ

### 問題 1

変更されたファイルと行の数は、次のとおりです。

| ファイル | 足された行 | 消された行 |
| --- | --- | --- |
| `index.html` | 1 | 0 |
| `src/elements.ts` | 2 | 0 |
| `src/main.ts` | 4 | 0 |
| `src/render.ts` | 8 | 3 |
| `src/state.ts` | 4 | 2 |
| `src/types.ts` | 1 | 0 |
| `src/state.test.ts` | 10 | 2 |
| `src/summary.test.ts` | 24 | 1 |

`tsconfig.json` にも 1 行の違いがありますが、フォルダの場所の違いによるものなので、無視して構いません。テストの 2 つのファイルは、後で扱います（`summary.test.ts` は問題 5、`state.test.ts` は章末の改修）。

1. 検索の機能を足すために、それぞれのファイルで、何を変えたと思いますか。差分を見る前に、ファイルの名前と行の数から予測してください。
2. 検索の機能に関係がありそうなのに、この一覧に出てこないファイルはどれですか。

<details>
<summary>答えと解説</summary>

1. 次のように予測できます。

   | ファイル | 予測 |
   | --- | --- |
   | `index.html` | 検索の入力欄を足した |
   | `src/elements.ts` | その入力欄を取得できるようにした（型と、取得の 2 か所） |
   | `src/main.ts` | 入力されたときの処理を登録した |
   | `src/types.ts` | 絞り込みの条件（`Filter`）に、検索語を足した |
   | `src/state.ts` | 最初の状態に、検索語を足した |
   | `src/render.ts` | 検索の結果を、画面に反映するようにした |

2. `src/summary.ts` です。絞り込みの処理（`filterEntries`）は `summary.ts` にあります（第5章）。検索も絞り込みの一種なのに、このファイルは変わっていません。

**確かめ方**：1 の予測は、問題 2〜4 の差分と見比べます。

</details>

## 7.3 差分を 1 つずつ読む

ここでは、一部のファイルの差分を読みます。残りのファイルの差分は、章末の改修の中で、自分で表示して読みます。

### 問題 2

`src/types.ts` の差分です。

```diff
@@ -23,6 +23,7 @@ export type EntryKind = "income" | "expense";
 export type Filter = {
   month: string;
   kind: "all" | EntryKind;
+  keyword: string;
 };
 
 export type CategoriesState =
```

`@@ -23,6 +23,7 @@` の行は、差分がファイルのどのあたりかを示しています（変更の前は 23 行目から 6 行、後は 23 行目から 7 行）。

この 1 行だけを足して、ほかのファイルを変えなかったとすると、完成版のどこに型エラーが出ますか。`Filter` 型の値を作っている場所を探して、答えてください。

探すときは、`practice/app/src` を `filterEntries(`・`month:` の順に全文検索します（`kind:` は 30 件近く出るので後にします）。`{ month, kind }` のように、名前だけで書いた場所もあります。

<details>
<summary>答えと解説</summary>

`state.ts` の `createInitialState`（`filter: { month: "all", kind: "all" }` の行）と、`summary.test.ts`（`filterEntries` に `{ month, kind }` を渡している行）です。

```
Property 'keyword' is missing in type '{ month: string; kind: "all"; }' but required in type 'Filter'.
```

`summary.test.ts` にも、同じ形のエラーが出ます（`kind` の型の部分だけが違います）。

`keyword` は省略できない項目なので、`Filter` を作っている場所すべてに型エラーが出ます。第2章の改修で体験した、「型を変えると、直す場所を型チェックが教えてくれる」のと同じです。

`setFilter` の引数の型は `Partial<Filter>`（一部の項目だけでよい）なので、`main.ts` の `setFilter(state, { month: ... })` には型エラーが出ません。`state.test.ts` の `filter: { month: "all", kind: "all" }` は、比べる値として書いているだけです。`Filter` 型の変数に入れていないので、型エラーになりません。

**確かめ方**：改修用フォルダの `src/state.ts` の 4 行目で、`keyword: ""` を消します。その行に赤い波線が出ます。

</details>

### 問題 3

`index.html`、`src/elements.ts`、`src/main.ts` の差分です（`elements.ts` は、2 か所のうち 1 か所だけを載せています）。

```diff
@@ -40,6 +40,7 @@
             <option value="expense">支出</option>
           </select>
         </label>
+        <label>検索 <input id="filter-keyword" autocomplete="off" /></label>
       </div>
       <dl class="totals">
         <dt>収入</dt><dd id="total-income"></dd>
```

```diff
@@ -63,6 +64,7 @@ export function getElements(): Elements {
     formErrors: findElement("#form-errors"),
     filterMonth: findSelect("#filter-month"),
     filterKind: findSelect("#filter-kind"),
+    filterKeyword: findInput("#filter-keyword"),
     totalIncome: findElement("#total-income"),
     totalExpense: findElement("#total-expense"),
     balance: findElement("#balance"),
```

```diff
@@ -78,6 +78,10 @@ elements.filterKind.addEventListener("change", () => {
   }
 });
 
+elements.filterKeyword.addEventListener("input", () => {
+  update(setFilter(state, { keyword: elements.filterKeyword.value }));
+});
+
 elements.entryList.addEventListener("click", (event) => {
   if (!(event.target instanceof HTMLButtonElement)) {
     return;
```

`"input"` は、入力欄の文字が変わるたびに起きるイベントです（本編第10章）。

- `update` は、`entries` が変わったときだけ保存します（第1章の問題 9）。

1. 検索の欄に、半角で `ab` と 2 文字入力すると、`update` は何回呼ばれますか。
2. そのとき、明細は保存し直されますか。
3. この 3 つの差分は、これまでのコードの、どの部分と同じ形で書かれていますか。

<details>
<summary>答えと解説</summary>

1. 2 回です（1 文字ごとに 1 回）。日本語の入力では、変換の途中でもイベントが起きるので、文字の数より多くなります。
2. 保存し直されません。`setFilter` は、明細の配列を変えないからです（第1章の問題 9）。
3. 月や種別の絞り込みと同じ形です（`update(setFilter(...))` を呼ぶ）。

**確かめ方**：改修用フォルダの `src/main.ts` で、`update` の先頭に `console.log("update");` を入れます。`npm run dev P07` で起動し、検索の欄に入力します。最初の 1 回の表示は、ページを開いて分類を読み込んだときのものです。

</details>

### 問題 4

`src/state.ts` の差分です。

```diff
@@ -1,10 +1,12 @@
 import { monthOf } from "./summary.ts";
 import type { AppState, CategoriesState, Entry, EntryKind, Filter } from "./types.ts";
 
+const noFilter: Filter = { month: "all", kind: "all", keyword: "" };
+
 export function createInitialState(entries: Entry[]): AppState {
   return {
     entries,
-    filter: { month: "all", kind: "all" },
+    filter: noFilter,
     categories: { status: "loading" },
     formKind: "expense",
     formErrors: [],
@@ -22,7 +24,7 @@ export function removeEntry(state: AppState, id: string): AppState {
   return {
     ...state,
     entries,
-    filter: monthRemains ? state.filter : { ...state.filter, month: "all" },
+    filter: monthRemains ? state.filter : noFilter,
   };
 }
 
```

この差分には、2 種類の変更が入っています。

- 検索語を足すのに、必要な変更
- 「ついでに」行われた、コードの整理

1. それぞれ、どの行ですか。`noFilter` に名前を付けたこと自体は、どちらに入れても構いません。
2. 「ついで」の変更で、画面の動きが変わる場面があります。どんな操作をしたときに、何が変わりますか。`removeEntry` の、変更の前と後の式を見比べて答えてください。

<details>
<summary>答えと解説</summary>

1. 必要な変更は、最初の状態の `filter` に `keyword: ""` を足すことです（`noFilter` を作って、`createInitialState` で使っている部分）。「ついで」の変更は `removeEntry` の `filter:` の行です。「絞り込みなし」を表す `noFilter` ができたので、ここでも使うように書き換えています。
2. 月で絞り込んでいて、その月の最後の明細を削除したときです。変更の前は、月の絞り込みだけが外れていました。変更の後は、種別の絞り込みと検索語まで外れます。

変更の前の `{ ...state.filter, month: "all" }` は、今の絞り込みをコピーして、月だけを `"all"` にします。変更の後の `noFilter` は、絞り込みを全部なくします。

| | `month` | `kind` | `keyword` |
| --- | --- | --- | --- |
| 削除の前の `state.filter` | `"2027-01"` | `"expense"` | `"テスト"` |
| 変更の前 `{ ...state.filter, month: "all" }` | `"all"` | `"expense"` | `"テスト"` |
| 変更の後 `noFilter` | `"all"` | `"all"` | `""` |

差分を読むときは、**機能に必要な変更と、ついでの変更を分けて**読みます。ついでの変更は、動きが変わらないはずのものです。本当に変わらないかは、変更の前と後の式を言葉にして比べると分かります。

**確かめ方**：`npm run dev P07` の画面で、次の順に試します。

1. 月の選択欄にまだない月（2027 年 1 月など）の日付で、メモが「テスト」の支出を 1 件追加する
2. 月をその月、種別を「支出」にし、検索の欄に「テスト」と入れる
3. その支出を削除する。種別が「すべて」に戻り、検索の欄も空になります

正しい動き（種別の「支出」と検索の「テスト」が残る）は、章末の改修を終えた後に同じ手順で確かめます。

</details>

### 問題 5

同僚の変更には、テストの追加がありませんでした。そこで、変更を読む側で、検索の仕様をテストとして書き足しました。改修用フォルダの `summary.test.ts` に入っています。

`practice/exercises/P07-changes/src/summary.test.ts`（19〜40行目）

```ts
const search = (keyword: string) =>
  filterEntries(sampleEntries, { month: "all", kind: "all", keyword }).map((entry) => entry.id);

test("filterEntries は、検索語がメモに含まれる明細だけを残す", () => {
  assert.deepEqual(search("昼"), ["b"]);
  assert.deepEqual(search("夕食"), []);
});

test("filterEntries は、検索語が分類か入金元に含まれる明細も残す", () => {
  assert.deepEqual(search("食"), ["b", "d"]);
  assert.deepEqual(search("給料"), ["a"]);
});

test("filterEntries は、メモ・分類・入金元のほかの項目（種別や日付など）は調べない", () => {
  assert.deepEqual(search("expense"), []);
  assert.deepEqual(search("2026"), []);
});

test("filterEntries は、月・種別・検索語のすべてに合う明細だけを残す", () => {
  const ids = filterEntries(sampleEntries, { month: "2026-11", kind: "expense", keyword: "食費" }).map((entry) => entry.id);
  assert.deepEqual(ids, ["d"]);
});
```

テストデータ（`src/testdata.ts` の `sampleEntries`）は、第5章の問題 1 と同じ次の 4 件です（第5章の改修の 5 件とは別です）。

| ID | 種別 | 日付 | 入金元（収入） | 分類（支出） | メモ |
| --- | --- | --- | --- | --- | --- |
| a | 収入 | 2026-10-25 | 給料 | — | — |
| b | 支出 | 2026-10-28 | — | 食費 | 昼食 |
| c | 支出 | 2026-11-02 | — | 交通費 | — |
| d | 支出 | 2026-11-05 | — | 食費 | — |

1. これらのテストから、検索の仕様を 4 つ読み取ってください。
2. `search("食")` の期待する値は `["b", "d"]` です。b と d は、それぞれどの項目に「食」を含んでいますか。
3. 画面を起動していたら `Ctrl` + `C` で止め、`npm test P07` を実行します。これらのテストは失敗します。失敗の表示から、今の `filterEntries` が検索語をどう扱っているかを読み取ってください。

<details>
<summary>答えと解説</summary>

1. 次の 4 つです。
   - メモに検索語が含まれる明細を残す
   - 分類（支出）や入金元（収入）に検索語が含まれる明細も残す
   - 種別や日付など、ほかの項目は調べない
   - 月・種別の絞り込みと組み合わせて使える
2. b は、分類の「食費」とメモの「昼食」の両方です。d は、分類の「食費」です。
3. 今の `filterEntries` は検索語を無視しています。

   ```
   + actual - expected
     [
   +   'a',
       'b',
   +   'c',
   +   'd'
     ]
   ```

   「昼」で検索したのに、4 件すべてが返っています。

</details>

### 問題 6

最後は、コードを書かずに設計を考える問いです。

このアプリに「明細を編集する」機能を足すとします。一覧の「編集」ボタンを押すと、その明細の内容がフォームに入り、直して保存できる機能です。これまでに読んだ構造に合わせるなら、どのファイルに、何を足しますか。分かる範囲で、箇条書きにしてください。

<details>
<summary>答えの例</summary>

自分の答えは、この後の「次の形に当てはめて考える」の 4 つで見直します。4 つのそれぞれに当たる変更が、自分の答えに入っていれば十分です。ファイルの名前や関数の名前が答えの例と違っていても構いません。

- `types.ts`：`AppState` に、「今、編集している明細の `id`（編集していなければ `null`）」を足す
- `state.ts`：編集を始める関数（編集する明細の `id` を入れ、`formKind` をその明細の種別にする）、明細を置き換える関数（`id` が同じ明細を、新しい明細に入れ替えた配列を作る）を足す
- `render.ts`：`createEntryItem` に「編集」ボタンを足す（`data-id` を付ける）。`renderForm` で、編集中かどうかで、ボタンの文言を「追加」か「保存」に変える
- `main.ts`：一覧の `click` の処理で、「削除」と「編集」のどちらのボタンかを見分ける。「編集」なら、その `id` の明細を探し、日付・金額などを入力欄に入れる。`submit` の処理で、編集中なら、その明細の `id` を `parseEntryForm` に渡して、追加ではなく置き換えを呼ぶ
- `validate.ts`：変えない。入力の検証は、追加でも編集でも同じ
- `storage.ts`：変えない。明細の配列が変われば、`update` が保存する
- テスト：`state.test.ts` に、置き換える関数のテストを足す

次の形に当てはめて考えます。細かな点は違っていて構いません。

1. 画面に出すものを、状態に足す
2. 状態を新しくする関数を足す
3. 状態から画面を作る部分を直す
4. イベントから、その関数を呼ぶ

入力欄に明細の内容を入れる部分だけは、この形に収まりません。このアプリは、入力途中の値を状態に持たず、入力欄が持っています（`main.ts` は「追加」が押されたときに入力欄から値を読みます）。`render` の中で入れると、描き直すたびに入力途中の値が明細の値に戻ってしまいます。そのため、「編集」が押されたときに 1 回だけ入れます。

</details>

## まとめ

ほかの人の変更を読むときに確かめることを、4 つ以上挙げてください。

<details>
<summary>答えの例</summary>

- 変更されたファイルの一覧を見て、変更の大きさと、手の入った場所をつかむ。変わっているはずなのに、変わっていないファイルがないか
- 1 つずつの差分で、その行が変更の前と後で何をするかを言葉にする
- 機能に必要な変更と、ついでの整理を分ける。ついでの整理で、動きが変わっていないか
- これまでのコードと、同じ形で書かれているか。違う所があれば、理由があるか
- テストが足されているか。なければ、仕様をテストとして書いてみる
- 型チェックとテストを実行し、画面でも、足した機能とこれまでの機能の両方を試す

</details>

---

## 改修：検索の機能を仕上げる

同僚の変更について、次の 3 つを行います。

**削除の不具合**（差分で入ったもの）：問題 4 で見つけた、`removeEntry` の不具合を直します。

**検索の不具合**（利用者からの報告）：次の報告が届いています。原因の場所は自分で探してください。

- メモで検索すると、一覧は絞り込まれるのに、上の集計（収入・支出・収支）の金額が変わりません。月や種別で絞り込んだときは、集計も変わるのに。
- それと、検索して 1 件も見つからなかったとき、一覧が空になるだけで、何も表示されません。

**検索の対象を広げる**（小さな機能）：メモだけでなく、分類（支出）と入金元（収入）も検索します。

**進め方**

#### 準備

1. テストを実行し、失敗しているテストを見る
   - 画面を起動していたら、先に `Ctrl` + `C` で止めます
   ```sh
   npm test P07
   ```
   - **こうなれば OK**：「--- 失敗の内容 ---」より上に、`✖` で始まる行が 5 つある

#### 削除の不具合を直す

2. `src/state.ts` の `removeEntry` の `filter:` の行を、変更の前の式（問題 4 の差分の `-` の行）に戻す
   ```sh
   npm test P07
   ```
   - **こうなれば OK**：テスト「removeEntry は、月の絞り込みを外すとき、種別と検索語の絞り込みは残す」が合格する

#### 検索の不具合を直す

3. 検索の処理が今どこに書かれているかを探し、報告の 2 つの症状が起きる理由を考える
   - 探し方は、全文検索、`git diff --no-index`、イベントからたどる、のどれでも構いません
   - **こうなれば OK**：検索語を使って明細を選んでいる行（1 か所）が見つかり、集計の金額が変わらない理由を説明できる（答えは章末の折りたたみ「コラム: なぜ、集計が変わらなかったのか」）
4. 検索の条件を、集計と一覧の両方に効く場所に書く
   - 書く場所は、手順 3 で考えた理由から決めます
   - `文字列.includes(検索語)` は、検索語が含まれていれば `true` を返します。検索語が `""` なら必ず `true` です
   - メモは `(entry.memo ?? "").includes(検索語)` と、かっこで囲んで調べます（メモがないときは `""` として扱う）
   - 「…分類か入金元に含まれる明細も残す」と「…すべてに合う明細だけを残す」のテストは、手順 6 まで失敗します
   ```sh
   npm test P07
   ```
   - **こうなれば OK**：テスト「filterEntries は、検索語がメモに含まれる明細だけを残す」が合格する
5. 元の場所にある検索の処理を消し、その関数を変更の前の形に戻す
   - 検索の欄に状態の検索語を入れる部分は、検索の機能に必要なので残します
   - 2 つ目のコマンドは、`ファイル` を手順 3 で見つけたファイルの名前にして、変更の前と比べます
   ```sh
   npm run typecheck P07
   git diff --no-index practice/app/src/ファイル practice/exercises/P07-changes/src/ファイル
   ```
   - **こうなれば OK**：「型チェック: OK」のまま、差分が検索の欄に値を入れる部分だけになる

#### 検索の対象を広げる

6. `filterEntries` で、メモに加えて、分類と入金元も調べる
   - 分類と入金元は、`format.ts` の `entryLabel(entry)` で取り出せます（第2章の問題 4）
   - 使うには、`summary.ts` の先頭に `import { entryLabel } from "./format.ts";` を足します
   ```sh
   npm test P07
   ```
   - **こうなれば OK**：「テスト: OK」

#### 仕上げる

7. 画面を起動し、次を試す
   ```sh
   npm run dev P07
   ```
   - [ ] 検索すると、一覧と一緒に、集計の金額と「分類ごとの支出」も、見つかった明細だけのものに変わる
   - [ ] 検索して 1 件も見つからないとき、「明細はまだありません。」が表示される（月や種別で 1 件もないときと同じ文）
   - [ ] 「食費」で検索すると、分類が「食費」の支出が表示される。メモにない言葉で試してください
   - [ ] 問題 4 の確かめ方の手順で削除すると、月だけが「すべて」に戻り、種別と検索の欄はそのまま残る
   - [ ] 検索の欄を空にすると、元の表示に戻る
8. 画面を `Ctrl` + `C` で止め、`src/try.ts` を作っていたら消す
   ```sh
   git status
   ```
   - **こうなれば OK**：表示に `try.ts` が出ない
9. 型チェックとテストを実行する
   ```sh
   npm run check P07
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
10. 自分の変更を差分で読む
    ```sh
    git diff practice/exercises/P07-changes
    ```
    - **こうなれば OK**：表示されるのが `state.ts`・`summary.ts`・`render.ts` の 3 つのファイルだけで、ついでの変更が混ざっていない
11. コミットする
    ```sh
    git add practice/exercises/P07-changes
    git commit -m "実践編 第7章 改修: 検索の機能を仕上げる"
    ```
    - **こうなれば OK**：表示の 1 行目に、付けたメッセージが出る

**テストで確かめるもの**（主なもの）

テストデータは、問題 5 の表の 4 件（a〜d）です。

| 呼び出し | 返す値 |
| --- | --- |
| `filterEntries`（検索語が `"昼"`） | b だけの配列 |
| `filterEntries`（検索語が `"食"`） | b と d の配列 |
| `filterEntries`（検索語が `"expense"` や `"2026"`） | 空の配列（種別や日付は調べない） |
| `filterEntries`（月が 2026-11、種別が支出、検索語が `"食費"`） | d だけの配列 |
| `removeEntry`（月・種別・検索語で絞り込み中に、その月の最後の明細を削除） | 返す状態の `filter` は、月だけが `"all"` になり、種別と検索語は残る |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- 報告の 2 つの症状（集計が変わらない、見つからないときに何も表示されない）は、同じ原因です
- 検索の不具合の原因：`keyword` を全文検索します（「含めるファイル」は `practice/exercises/P07-changes/src`）。検索語を使って明細を選んでいる行が、1 か所だけあります
- 集計が変わらない理由：`render.ts` の `render` 関数で、集計（`renderSummary`）と一覧（`renderList`）に、それぞれ何を渡しているかを見ます
- 検索の対象を広げる：`filterEntries` の中で、メモと `entryLabel(entry)` の、どちらかに検索語が含まれていれば残します

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- `render.ts`：`renderList` を、完成版（`practice/app/src/render.ts`）と同じ形に戻します。引数の `keyword` と、`matched` を作っている行を消し、`render` 関数の中の呼び出しも元に戻します。`renderFilter` に足された行（検索の欄に、状態の検索語を入れる部分）は、そのまま残します。
- `summary.ts`：`filterEntries` に、3 つ目の `filter` を足します。

  ```ts
      .filter((entry) => entryLabel(entry).includes(filter.keyword) || (entry.memo ?? "").includes(filter.keyword));
  ```

  26 行目の末尾の `;` は消します（`;` は、足した行の末尾に 1 つだけ付けます）。

  条件を `matchesKeyword` のような関数に分けても構いません（解答例は、関数に分けた形です）。`entryLabel` を使うには、ファイルの先頭に `import { entryLabel } from "./format.ts";` を足します。

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

| 表示 | よくある原因 |
| --- | --- |
| テスト「月の絞り込みを外すとき、種別と検索語の絞り込みは残す」で `+ keyword: ''` `- keyword: '給'` と `+ kind: 'all'` `- kind: 'income'` | 最初の状態です。`removeEntry` が、絞り込みを全部なくしています |
| 同じテストで、`+ keyword: ''` `- keyword: '給'` だけ | 種別は残していますが、検索語を残していません。今の絞り込みをコピーして、月だけを変えます |
| テスト「検索語がメモに含まれる明細だけを残す」で、`+ 'a'` `+ 'c'` `+ 'd'` | 最初の状態です。`filterEntries` が、検索語を使っていません |
| テスト「検索語が分類か入金元に含まれる明細も残す」で `- 'd'` | メモだけを調べています。`entryLabel(entry)` も調べます |
| 型チェックで `Property 'category' does not exist on type 'Entry'.`（`summary.ts`） | `entry` は、収入か支出か分からない `Entry` 型のままです（種別の `filter` は `"all"` も通すので、型は絞り込まれません）。分類と入金元は、`entryLabel(entry)` で取り出します |
| 型チェックで `'entry.memo' is possibly 'undefined'.` | メモのない明細があります。`(entry.memo ?? "")` にします |
| 型チェックで `'\|\|' and '??' operations cannot be mixed without parentheses.`（テストでは、ファイルの名前の行だけが `✖` になる） | `entry.memo ?? ""` を、かっこで囲んでいません |
| テスト「検索語がメモに含まれる明細だけを残す」で `+ 'b'`、または（戻り値に `boolean` と書いた関数に分けたとき）型チェックで `Type 'string \| boolean' is not assignable to type 'boolean'.` | `entry.memo ?? "".includes(...)` と書いています。`(entry.memo ?? "").includes(...)` と、かっこで囲みます |
| テスト「検索語がメモに含まれる明細だけを残す」で `+ []` | 2 つの条件を `&&`（かつ）でつないでいます。メモと `entryLabel(entry)` のどちらかに含まれていれば残すので、`\|\|` でつなぎます |
| 型チェックで `Cannot find name 'entryLabel'.` | `summary.ts` で `entryLabel` を `import` していません |
| 型チェックで `Expected 2 arguments, but got 3.`（`render.ts`） | `renderList` の引数は戻しましたが、`render` 関数の中の呼び出しを戻していません |
| テスト「…ほかの項目（種別や日付など）は調べない」が失敗する | 明細の全部の項目を調べています。調べるのは、メモと `entryLabel(entry)` です |
| テストは合格するが、「食費」で検索すると、集計は変わるのに一覧が空になる | `render.ts` の `renderList` に、メモだけを調べる検索の処理が残っています。`renderList` を元に戻します |
| テストは合格するが、検索しても何も変わらない | 完成版（`npm run dev app`）を起動しています |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[practice/solutions/P07-changes/src/state.ts](../solutions/P07-changes/src/state.ts)、[practice/solutions/P07-changes/src/summary.ts](../solutions/P07-changes/src/summary.ts)、[practice/solutions/P07-changes/src/render.ts](../solutions/P07-changes/src/render.ts)

<details>
<summary>コラム: なぜ、集計が変わらなかったのか（手順 3 で理由を考えてから開いてください）</summary>

同僚は、検索の処理を、一覧を描く関数（`renderList`）の中に書いていました。一覧は絞り込まれますが、集計を描く関数には、検索する前の明細が渡されたままです。「見つからなかったとき」の表示も、検索する前の件数で決まっていました。

```text
同僚の版  filterEntries（月・種別）         ─┬→ renderSummary（検索する前の明細）
                                             └→ renderList → メモで検索 → 一覧
直した版  filterEntries（月・種別・検索語） ─┬→ renderSummary
                                             └→ renderList
```

このアプリでは、「どの明細を表示するか」を `filterEntries` の 1 か所で決め、その結果を集計と一覧の両方に渡しています（第1章の問題 7）。同じ決まりを 2 か所に分けて書くと、片方だけが古いまま残ります。機能を足すときは、新しい場所を作る前に、**同じ種類の処理がすでにどこにあるか**を探します。

</details>

---

## チェックリスト

- [ ] 変更されたファイルの一覧から、変更の全体と、気を付ける点の見当を付けられる
- [ ] 差分の中から、機能に必要な変更と、ついでの変更を分けて読める
- [ ] `{ ...state.filter, month: "all" }` と `noFilter` の、意味の違いを説明できる

## 実践編を終えて

実践編では、1 つのアプリを次の順で読みました。

1. 動かして、ファイルの地図を作り、入口から最初の表示までをたどる
2. データの型を読み、作る場所と使う場所をたどる
3. 入力が検査されて、明細になるまでを読む
4. 操作によって状態が変わり、画面が作り直されるまでを読む
5. 集計の処理を、テストと一緒に読む
6. 外から来るデータを、確かめてから使う部分を読む
7. ほかの人の変更を読み、直す

どの章でも中心にあったのは、「状態を変える → 状態から画面を作り直す」という形と、「外から来た値は、検査してから正しい型として扱う」という決まりです。

[React 編](../../react/chapters/R00-digest.md)（オプション）では、同じ家計簿のアプリを、React で書き直したものを読みます。`render` 関数と `update` 関数がしていた仕事を、React がどう肩代わりするかを見ていきます。

## 詳しく学ぶ

- JavaScript Primer：[Todoアプリ](https://jsprimer.net/use-case/todoapp/)（状態と表示を分けたアプリを、順に作っていく例）
- サバイバルTypeScript：[Partial<T>](https://typescriptbook.jp/reference/type-reuse/utility-types/partial)
