# 実践編 第4章 イベントから再描画まで

- **この章で学ぶこと**
  - ボタンや選択欄を操作してから画面が変わるまでを、イベントからたどる読み方
  - 条件で見た目を変える仕組みと、実行時のエラーを開発者ツールで調べる方法
  - コードの変更（差分）の読み方

---

## 4.1 読む範囲と、使う道具

この章では、画面の操作を出発点にして、コードをたどります。

| ファイル | 読む場所 |
| --- | --- |
| `practice/app/src/main.ts` | 絞り込みと削除の処理（70〜89行目） |
| `practice/app/src/state.ts` | `removeEntry`（18〜27行目） |
| `practice/app/src/render.ts` | `renderSummary`（65〜77行目）、`createEntryItem`（79〜97行目） |
| `practice/app/style.css` | 色を決めているクラス（70〜71行目） |
| `practice/app/src/elements.ts`、`practice/app/index.html` | 要素を取得する処理と、その要素（問題 7） |

<!-- app-map: chapter=4 -->

開発者ツールは、画面の上で右クリックして「検証」を選ぶと開きます（Chrome の場合）。使うのは次の 3 つのタブです。

| タブ | 分かること |
| --- | --- |
| Elements（要素） | 今の画面の HTML。要素を選ぶと、右の「Styles」（スタイル）に、その要素に効いている CSS が表示される |
| Console（コンソール） | `console.log` の表示と、実行時のエラー |
| Sources（ソース） | 処理を途中で止めたときの、変数の値 |

## 4.2 削除ボタンから、画面が変わるまで

### 問題 1

一覧の「削除」ボタンは、`render.ts` の `createEntryItem` が作っています。

`practice/app/src/render.ts`（86〜87行目）

```ts
  const removeButton = createText("button", "削除", "remove");
  removeButton.dataset.id = entry.id;
```

読むのに必要な書き方は次の 2 つです。

- `createText(タグ, 文字, クラス)` は、文字の入った要素を作り、3 つ目の引数のクラスを付ける関数です（同じファイルの 13〜18行目）。
- `要素.dataset.名前 = 値` は、その要素に `data-名前="値"` という属性を付けます。`data-` で始まる属性は、要素に自由な情報を持たせるために使います。

`practice/app/src/main.ts`（81〜89行目）

```ts
elements.entryList.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }
  const id = event.target.dataset.id;
  if (id !== undefined) {
    update(removeEntry(state, id));
  }
});
```

- `click` のイベントを登録しているのは、ボタンではなく、一覧の全体（`elements.entryList`）です（イベント委譲。本編第11章の 11.4）。
- 一覧の中の要素をクリックすると、`click` のイベントは外側の一覧にも届きます。

1. `id` が `"abc"` の明細の「削除」ボタンは、HTML ではどう書かれますか。`<button` から `</button>` までを書いてください。
2. 一覧の中の日付の文字をクリックすると、何が起きますか。そのとき、`event.target` はどの要素ですか。
3. 85 行目の `id` の型は何ですか。答えを書いてから、エディタで `id` にマウスカーソルを合わせて調べてください。

<details>
<summary>答えと解説</summary>

1. `<button class="remove" data-id="abc">削除</button>` です。
2. 何も起きません。`event.target` は、日付の `span` です。82 行目の `if` で、クリックされたものがボタンでなければ `return` しています。

   一覧の 1 行は、`createEntryItem` が作る次の形です。処理を登録したのは外側の `ul` で、`event.target` は実際にクリックした内側の要素です。

   ```html
   <ul id="entry-list">                            <!-- click の処理を登録した要素 -->
     <li>
       <span class="date">2026-11-10</span>        <!-- 日付をクリックすると、event.target はこの span -->
       <span>…</span>
       <span class="amount amount-expense">…</span>
       <button class="remove" data-id="abc">削除</button>  <!-- 削除をクリックすると、event.target はこの button -->
     </li>
   </ul>
   ```
3. `string | undefined` です。

一覧は `render` のたびに作り直されるので、ボタンごとではなく一覧に 1 つだけ処理を登録しています。ボタンごとに登録すると、作り直すたびに登録し直す必要があります。処理の中では、クリックされたのがボタンかどうかを確かめています。

`data-id` の付いていないボタンもありうるので、`dataset.id` の型は `string | undefined` です。`main.ts` の 86 行目で、`undefined` でないことを調べてから使っています。

**確かめ方**：`npm run dev P04` で起動し、明細を 1 件追加します。「削除」ボタンの上で右クリックして「検証」を選ぶと、Elements のタブで、そのボタンの HTML が見えます。

</details>

### 問題 2

「削除」ボタンを押してから、画面の一覧と集計が変わるまでに、どの関数がどの順で呼ばれますか。`main.ts` の 81〜89 行目から始めて、次の 2 つに答えてください。

1. 呼ばれる関数の名前を順に書いてください。`render` の中で呼ばれる関数は、`render` とだけ書けば構いません。
2. 87 行目の `removeEntry(state, id)` に渡す `state` には、削除する前と後のどちらの状態が入っていますか。`state` が宣言されている場所（`main.ts` 18 行目）と、`state` を入れ替えている場所を探して答えてください。

<details>
<summary>答えと解説</summary>

1. 次の順です。
   - `click` の処理（`main.ts` 81 行目）
   - `removeEntry`（`state.ts`）：その明細を除いた、新しい状態を作る
   - `update`（`main.ts`）：明細の配列が変わっているので `saveEntries` で保存し、状態を入れ替える
   - `render`（`render.ts`）：新しい状態から、フォーム・絞り込み・集計・一覧を作り直す
2. 削除する前の状態です。

- `state` は、`main.ts` の 18 行目で `let` で宣言された 1 つの変数です。イベントの処理は、呼ばれた時点でこの変数を読みます。
- `state` を入れ替えるのは、`update` の中の `state = next;`（25 行目）だけです。
- そのため、`removeEntry` が受け取るのは削除前の状態で、`removeEntry` が返した新しい状態（`next`）が、`update` の中で `state` に入ります。

追加（第3章）・削除・絞り込みは、どれも第1章の図1-3 の流れを通ります。違うのは、新しい状態を作る関数と、保存するかどうかです。

| 操作 | 状態を作る関数 | 保存 |
| --- | --- | --- |
| 追加 | `addEntry` | する |
| 削除 | `removeEntry` | する |
| 絞り込み | `setFilter` | しない |
| 種別の切り替え | `setFormKind` | しない |

**確かめ方**：改修用フォルダの `src/main.ts` の `update` と `src/state.ts` の `removeEntry` の先頭に、`console.log("update")` と `console.log("removeEntry", state.entries.length)` を入れて、「削除」を押します。ページを開いたときにも `update` が 1 回表示されるので、「削除」を押した後に増えた行を見ます。表示される順番と、`removeEntry` が受け取った明細の件数を見ます。

</details>

### 問題 3

`practice/app/src/state.ts`（18〜27行目）

```ts
export function removeEntry(state: AppState, id: string): AppState {
  const entries = state.entries.filter((entry) => entry.id !== id);
  const { month } = state.filter;
  const monthRemains = month === "all" || entries.some((entry) => monthOf(entry.date) === month);
  return {
    ...state,
    entries,
    filter: monthRemains ? state.filter : { ...state.filter, month: "all" },
  };
}
```

読むのに必要なことは次の 4 つです。

- `some` は、条件に合う要素が 1 つでもあれば `true` を返す、配列のメソッドです。
- `monthOf` は、日付から `"2026-10"` の形の月を取り出します。
- 選択欄の `value` に選択肢にない値を入れると、何も選ばれていない空白の表示になります。
- 月の選択肢は、今ある明細の月から作られます（`render.ts` の `renderFilter`）。

10 月の明細が 1 件、11 月の明細が 1 件あり、月の絞り込みで「2026年10月」を選んでいるとします。

1. この状態で、10 月の明細を削除すると、返される状態の `filter.month` は何ですか。
2. 25 行目を消して、`filter` を変えないようにしたとします。同じ操作をすると、月の選択欄・一覧・集計はどうなりますか。

<details>
<summary>答えと解説</summary>

1. `"all"` です。10 月の明細がなくなり、`monthRemains` が `false` になります。
2. 月の選択欄は何も選ばれていない空白の表示になり、一覧は空で「明細はまだありません。」と表示され、集計は 0 円になります。11 月の明細が 1 件残っているのに、です。

   月の選択肢は、今ある明細から作られます（第1章の問題 7）。10 月の明細がなくなると、選択肢から「2026年10月」が消えます。それなのに、状態の `filter.month` が `"2026-10"` のままだと、「選択肢にない月で絞り込んでいる」状態になります。

**確かめ方**：1 は、`state.test.ts` の「removeEntry は、絞り込み中の月の明細がなくなったら、月の絞り込みを外す」のテストが検査しています。画面では、月の選択欄にまだない月（たとえば 2025 年 10 月）の明細を 1 件追加し、その月を選んでから、その明細を削除します。月の選択欄が「すべて」に戻ります。

2 は、その月の明細を足し直してから、改修用フォルダの `src/state.ts` の 25 行目を消し、同じ操作を試します。

</details>

### 問題 4

`practice/app/src/main.ts`（70〜79行目）

```ts
elements.filterMonth.addEventListener("change", () => {
  update(setFilter(state, { month: elements.filterMonth.value }));
});

elements.filterKind.addEventListener("change", () => {
  const kind = elements.filterKind.value;
  if (kind === "all" || kind === "income" || kind === "expense") {
    update(setFilter(state, { kind }));
  }
});
```

`setFilter`（`state.ts` 29〜31行目）は、`{ ...state.filter, ...changes }` で新しい `filter` を作ります（第1章の問題 9）。後に書いた `changes` の項目が、前の項目を上書きします。

最初の `filter` が `{ month: "all", kind: "all" }` の状態から、種別の選択欄で「支出」を選び、続けて月の選択欄で「2026年11月」を選んだとします。

1. 1 回目と 2 回目の `change` の処理で、`setFilter` に渡す 2 つ目の引数は、それぞれ何ですか。
2. 2 回目の `update` の後、状態の `filter` は何ですか。
3. そのとき、2 つの選択欄には何が表示されていますか。`render.ts` の `renderFilter` の最後の 2 行（61〜62行目）を読んで答えてください。

<details>
<summary>答えと解説</summary>

1. 1 回目は `{ kind: "expense" }`、2 回目は `{ month: "2026-11" }` です。
2. `{ month: "2026-11", kind: "expense" }` です。
3. 月の選択欄は「2026年11月」、種別の選択欄は「支出」です。

- 2 回目の `setFilter` は、前の `filter`（`kind` が `"expense"`）をコピーしてから、`month` だけを上書きします。そのため、種別の絞り込みは外れません。
- `renderFilter` は、`render` のたびに、選択欄の値を状態の `filter` に合わせ直します。選択欄の表示も、状態から作っています。

`setFilter` に変えたい項目だけを渡せるのは、2 つ目の引数の型が `Partial<Filter>`（`Filter` の項目の一部だけを持つ型。第1章の問題 9）だからです。種別の処理にだけ `if` があるのは、`string` を `"all" | EntryKind` に絞るためです（第2章の問題 8）。

**確かめ方**：改修用フォルダの `src/main.ts` の `update` の先頭に `console.log(next.filter);` を入れ、画面で同じ順に選びます。

</details>

## 4.3 条件で見た目を変える

### 問題 5

`practice/app/src/render.ts`（66〜70行目）

```ts
  const balance = balanceOf(entries);
  elements.totalIncome.textContent = formatYen(totalOf(entries, "income"));
  elements.totalExpense.textContent = formatYen(totalOf(entries, "expense"));
  elements.balance.textContent = formatYen(balance);
  elements.balance.className = balance < 0 ? "negative" : "positive";
```

`practice/app/style.css`（70〜71行目）

```
.amount-income, .positive { color: var(--income); }
.amount-expense, .negative { color: var(--expense); }
```

読むのに必要なことは次の 3 つです。

- `要素.className = 文字列` は、その要素のクラスを、渡した文字列に置き換えます。
- CSS の `.negative { ... }` は、「`negative` というクラスの付いた要素の見た目」を決めています。
- `--income` は緑、`--expense` は赤の色です。

1. 収入が 1,000 円、支出が 1,500 円のとき、収支の要素（`<dd id="balance">`）のクラスと文字の色はどうなりますか。
2. 収支がちょうど 0 円のときは、どうなりますか。
3. 一覧の支出の金額を赤くしているのは、どのクラスですか。画面の金額の上で右クリックして「検証」を選び、Elements と Styles で調べてください。そのクラスを付けている `render.ts` の行も探してください。

<details>
<summary>答えと解説</summary>

1. クラスは `negative` で、赤で表示されます。
2. クラスは `positive` で、緑で表示されます（`balance < 0` が `false` のため）。
3. `amount-expense` のクラスです。Styles に `.amount-expense, .negative` の `color` が表示されます。付けているのは `createEntryItem` の 93 行目です。

   `practice/app/src/render.ts`（93行目）

   ```ts
       createText("span", formatSignedYen(entry), `amount amount-${entry.kind}`),
   ```

   クラスは、空白で区切って複数付けられます。収入なら `amount amount-income`、支出なら `amount amount-expense` になります。

TypeScript のコードは、色を直接決めていません。条件に合わせてクラスの名前を付け替えるだけで、色は CSS が決めています。見た目を直すときは、「クラスを付けているコード」と「そのクラスの CSS」の両方を見ます。

**確かめ方**：画面で、まだ明細のない月に収入 1,000 円と支出 1,500 円を追加し、その月で絞り込みます。収支の金額の上で右クリックして「検証」を選びます。Elements のタブで `<dd id="balance" class="negative">` が見え、右の Styles に `.negative` の `color` が表示されます。明細を足して収支をプラスにすると、クラスが `positive` に変わります。

</details>

### 問題 6

`practice/app/src/render.ts`（13〜18行目）

```ts
function createText(tag: string, text: string, className = ""): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  element.className = className;
  return element;
}
```

引数の `className = ""` は**既定値**で、呼び出すときに 3 つ目の引数を省くと `""` が使われます。

メモに `<b>太字</b>` と入力して、明細を追加したとします。

1. 一覧には、どう表示されますか。
2. 15 行目が `element.innerHTML = text;` だったら、どう表示されますか。それは、なぜ危険ですか。

<details>
<summary>答えと解説</summary>

1. 入力したとおり、`<b>太字</b>` という文字がそのまま表示されます。
2. 「太字」という文字が太字で表示されます。入力が HTML として解釈されるので、`<img src="x" onerror="alert(1)">` のように、属性にプログラムを書いた HTML を入力されると、それも画面で動きます（`<script>` の要素は動きませんが、ほかの書き方で動かせます）。

`textContent` は、渡した文字列を、ただの文字として入れます。`innerHTML` は、HTML として解釈して入れます。

保存されたデータやサーバーから来たデータに、ほかの人の入力が混ざっていれば、その人の書いたプログラムが自分の画面で動きます。

このアプリでは、画面に文字を入れるときは、どこでも `textContent` を使っています（本編第10章）。

**確かめ方**：画面で、メモに `<b>太字</b>` と入れて追加します。

</details>

## 4.4 実行時のエラーを読む

型チェックに通っていても、実行時にエラーが起きることがあります。

### 問題 7

`index.html` の `id="balance"` を、間違えて `id="balanse"` と書いたとします。ページを開くと、コンソールに次のように表示されます。

```
Uncaught Error: 要素が見つかりません: #balance
    at findElement (elements.ts:26:11)
    at getElements (elements.ts:68:14)
    at main.ts:17:18
```

これを**スタックトレース**と呼びます。エラーが起きた場所と、そこに来るまでに、どの関数から呼ばれたかを示しています。

1. エラー（例外）を投げたのは、どのファイルの、何行目ですか。
2. その関数は、どこから呼ばれましたか。下の 2 行を、ファイルを開いて確かめてください。
3. このとき、集計・一覧・月の選択欄はどうなっていますか。`main.ts` の 17 行目より後の処理は、動きますか。
4. このつづりの間違いを、型チェック（`npm run typecheck P04`）は見つけられますか。

<details>
<summary>答えと解説</summary>

1. `elements.ts` の 26 行目です。`findElement` の中の `throw new Error(...)` の行です。
2. `getElements` の中の `balance: findElement("#balance"),`（`elements.ts` 68 行目）から呼ばれ、その `getElements` は `main.ts` の 17 行目から呼ばれました。
3. 月の選択欄、集計、一覧は空のままです。明細が保存されていても、HTML に書いた「明細はまだありません。」が表示されます。17 行目でエラーが投げられると、そこで処理が止まり、後の処理（イベントの登録と `render`）は動きません。
4. 見つけられません。

   型チェックは、HTML の中身を知りません。`findElement("#balance")` に渡した文字列が HTML にある `id` と合っているかは、実行して初めて分かります。そこで `findElement` は、要素が見つからなければ、どの要素かが分かるメッセージを付けてすぐにエラーを投げています。`null` のまま先に進むと、後で別の場所でエラーになり、原因を探しにくくなります。

スタックトレースは、**一番上の行がエラーを投げた場所で、下に行くほど呼び出しの元**です。2 行目は 1 行目を呼び出した場所、3 行目は 2 行目を呼び出した場所です。`elements.ts:26:11` は、「`elements.ts` の 26 行目の 11 文字目」です。

**確かめ方**：次の順で行います。

1. 改修用フォルダの `index.html` で `id="balance"` を `id="balanse"` に変える
2. `npm run dev P04` で開き、コンソールを見る。スタックトレースの中のファイルの名前をクリックすると、その行が開きます（表示の細かな形は、ブラウザによって少し違います）
3. 画面を `Ctrl` + `C` で止め、`index.html` は変えたまま `npm run typecheck P04` を実行する。「型チェック: OK」と表示されます

</details>

### 問題 8

コードに `debugger;` と書くと、開発者ツールを開いているとき、その行で処理が止まります。止まっている間は、そのときの変数の値を見られます。

改修用フォルダの `src/main.ts` の `update` を、次のように書き換えたとします。

```ts
function update(next: AppState): void {
  debugger;
  if (next.entries !== state.entries) {
```

絞り込みが「すべて」で、明細が 3 件ある状態で「削除」ボタンを押したとします。`debugger;` の行で止まります（`update` は、状態が変わるたびに呼ばれます）。

1. 止まった時点で、`state.entries` と `next.entries` の件数は、それぞれ何件ですか。
2. 止まっている間、画面の一覧には、何件表示されていますか。

<details>
<summary>答えと解説</summary>

1. `state.entries` は 3 件、`next.entries` は 2 件です。
2. 3 件です。

止まったのは `update` の最初の行です。`next` は、`removeEntry` が作った新しい状態で、明細が 1 件減っています。`state` は入れ替える前の古い状態です。画面を作り直す `render` もまだ呼ばれていません。

止まっている間は、開発者ツールの Sources のタブで、次のことができます。

- 右の「Scope」（スコープ）で、その時点の変数の値を見る
- コードの中の変数に、マウスカーソルを合わせて、値を見る
- 上の `▶` のボタンで、続きを実行する

**確かめ方**：次の順で行います。

1. `npm run dev P04` で起動し、明細を 3 件にしておく
2. 開発者ツールを開く
3. 改修用フォルダの `src/main.ts` に `debugger;` を書いて、保存する。ページが読み込み直されます。分類の読み込みが終わると `update` が呼ばれ、そこで 1 回止まります
4. `▶` のボタンで、続きを実行する
5. 「削除」を押す。止まったら、`state.entries` と `next.entries` の件数を見る

</details>

## 4.5 変更を読む

コードを読む仕事の多くは、ほかの人が書いた変更（**差分**）を読むことです。差分は、`git diff` の表示と同じ次の形で表されます。

- `-` で始まる行：消された行
- `+` で始まる行：足された行
- 何も付いていない行：変わっていない行（前後の様子を示すために表示される）

### 問題 9

`state.ts` に、次の変更が入ったとします。

```diff
 export function removeEntry(state: AppState, id: string): AppState {
-  const entries = state.entries.filter((entry) => entry.id !== id);
+  const entries = state.entries.filter((entry) => entry.id === id);
   const { month } = state.filter;
```

1. 変わったのは、どこですか。
2. 明細が 3 件あるとき、そのうちの 1 件の「削除」を押すと、一覧はどうなりますか。

<details>
<summary>答えと解説</summary>

1. `!==` が `===` に変わっています。
2. 「削除」を押した明細だけが残り、ほかの 2 件が消えます。

`filter` は、条件が `true` になる要素だけを残します（本編第7章）。`entry.id !== id` は「押した明細でないものを残す」、`entry.id === id` は「押した明細だけを残す」です。

差分を読むときは、変わった文字だけでなく、**その行が変更の前と後で何をするか**を言葉にします。1 文字の違いで、動きが正反対になることもあります。

`!==` も `===` も結果は `boolean` なので、この変更は型チェックに通ります。見つけられるのはテストです。

**確かめ方**：改修用フォルダの `src/state.ts` で、同じように書き換えて、`npm test P04` を実行します。「removeEntry は id が一致する明細だけを除く」のテストが失敗します。章末の改修がまだなので、`isLargeExpense` のテストも一緒に失敗しますが、ここでは見なくて構いません。

元に戻す前に `git diff practice/exercises/P04-events/src/state.ts` を実行すると、自分の変更が同じ形で表示されます。先頭の `diff --git`・`index`・`---`・`+++` の行は比べているファイルを、`@@` の行は変わった場所の行番号を示します。

</details>

### 問題 10

`main.ts` に、次の変更が入ったとします。使っている `confirm` は、ブラウザの機能です。

- `confirm("文")` は、「OK」と「キャンセル」のボタンが付いた確認の窓を出します。
- 「OK」を押すと `true`、「キャンセル」を押すと `false` を返します。

```diff
   const id = event.target.dataset.id;
-  if (id !== undefined) {
+  if (id !== undefined && confirm("この明細を削除しますか？")) {
     update(removeEntry(state, id));
   }
```

1. この変更で、画面の動きはどう変わりますか。
2. 「キャンセル」を押したとき、`removeEntry` と `update` は呼ばれますか。保存はされますか。

<details>
<summary>答えと解説</summary>

1. 「削除」を押すと、確認の窓が出ます。「OK」を押したときだけ、明細が削除されます。
2. どちらも呼ばれません。保存もされません。

`&&` は、左が `false` なら、右を実行しません。`id` が `undefined` のときは確認の窓も出ません。左が `true` のときだけ `confirm` が呼ばれ、その結果が `false`（キャンセル）なら、`if` の中は実行されません。

機能を足す変更を読むときは次の 2 つを確かめます。

- 足した機能が、意図したとおりに動くか（「OK」で削除される）
- これまでの動きを、壊していないか（「キャンセル」では何も変わらない。ボタン以外をクリックしても、窓は出ない）

**確かめ方**：改修用フォルダの `src/main.ts` で、同じように書き換えて、画面で試します。

</details>

## まとめ

「削除」を押しても、明細が一覧から消えない不具合があったとします。原因は、削除の流れ（問題 2：`click` の処理 → `removeEntry` → `update` → `render`）のどこかにあります。問題 7 と問題 8 の道具を使って、原因の段階を絞り込む手順を考えます。

1. コンソールにエラーが出ていました。最初に何を見ますか。
2. エラーは出ていません。`update` の最初の行に `debugger;` を書いて「削除」を押しても、止まりませんでした（ページを開いたときの 1 回目は、`▶` で続けた後です）。原因は、流れのどの段階にありますか。
3. 2 と違い、`update` で止まりました。`next.entries` に、消したはずの明細が残っていました。次に、どこで止めて何を調べますか。残っていなかったら、原因はどこにありますか。

<details>
<summary>説明の例</summary>

1. スタックトレースを読む（問題 7）。一番上の行がエラーを投げた場所で、下の行をたどると、`click` の処理からどの関数を通ってそこに来たかが分かる。
2. `update` まで来ていない。一覧の `click` の処理（`main.ts` 81〜89 行目）の、82 行目か 86 行目の `if` で先に進んでいない。86 行目なら、ボタンに `data-id` を付ける `createEntryItem`（`render.ts`）も調べる。
3. 残っていれば、`removeEntry`（`state.ts`）の先頭で止め、受け取った `id` が押した明細のものかを調べる。
   - 合っていれば、原因は `removeEntry` の、明細を除く条件にある。
   - 違っていれば、原因はボタンに `id` を付ける `createEntryItem`（`render.ts`）か、`click` の処理にある。

   残っていなければ、状態は正しく作られている。原因は `update` の残りの行か、画面を作り直す `render`（`render.ts`）にある。

`debugger;` で止める場所を 1 つ決めると、流れを「そこより前」と「そこより後」に分けられる。止まったかどうかと、止まった時点の値で、どちらに原因があるかが分かる。

</details>

---

## 改修：大きな支出を目立たせる

10,000 円以上の支出の行に、`large` というクラスを付けます。`large` の付いた行は、背景が薄い灰色になり、金額が太字になります。CSS は、改修用フォルダの `style.css` に用意してあります。

**進め方**

#### 大きな支出かを調べる関数を書く

1. `practice/exercises/P04-events/src/format.ts` の、一番下の `isLargeExpense` の `throw` の行を書き換える
   - 10,000 円以上の支出なら `true`、それ以外（10,000 円未満の支出と、収入）なら `false` を返します
   - 支出は、`entry.kind === "expense"` の明細です
   ```sh
   npm test P04
   ```
   - **こうなれば OK**：「テスト: OK」

#### 画面につなぐ

2. 画面を起動したままにする
   ```sh
   npm run dev P04
   ```
   - **こうなれば OK**：家計簿の画面が表示される
3. `src/render.ts` の `createEntryItem` で、行に `large` のクラスを付ける
   - 画面に 10,000 円以上の支出がなければ、先に 1 件追加しておきます
   - 明細の行（`<li>`）は、変数 `item` に入っています
   - `要素.classList.toggle("クラスの名前", 条件)` は、条件が `true` ならクラスを付け、`false` なら外します（第1章の問題 6）。`className` への代入と違い、ほかのクラスは消しません
   - ほかのファイルの関数は、先頭の `import` に名前を足すと使えます
   - **こうなれば OK**：10,000 円以上の支出の行が、薄い灰色の背景になる
4. 画面で次を 1 つずつ試す
   - [ ] 10,000 円以上の支出の行は、背景が薄い灰色になり、金額が太字になる
   - [ ] 10,000 円未満の支出と、収入の行は、これまでどおりに表示される
   - [ ] 開発者ツールの Elements で、10,000 円以上の支出の `<li>` に `class="large"` が付いている

#### 仕上げる

5. 画面を `Ctrl` + `C` で止め、型チェックとテストを実行する
   ```sh
   npm run check P04
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
6. 自分の変更を差分で読む
   ```sh
   git diff practice/exercises/P04-events
   ```
   - **こうなれば OK**：`format.ts` と `render.ts` の 2 つのファイルが表示される
7. コミットする
   ```sh
   git add practice/exercises/P04-events
   git commit -m "実践編 第4章 改修: 大きな支出を目立たせる"
   ```
   - **こうなれば OK**：表示の 1 行目に、付けたメッセージが出る

**テストで確かめるもの**

| 呼び出し | 返す値 |
| --- | --- |
| `isLargeExpense`（10,000 円の支出） | `true` |
| `isLargeExpense`（25,000 円の支出） | `true` |
| `isLargeExpense`（9,999 円の支出） | `false` |
| `isLargeExpense`（200,000 円の収入） | `false` |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- `isLargeExpense`：種別の確かめ方は、同じファイルの `formatSignedYen` や `entryLabel`
- クラスを付ける場所：`createEntryItem` の、`const item = document.createElement("li");` のすぐ下

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- `isLargeExpense`：`return entry.kind === "expense" && entry.amount >= 10000;`
- `render.ts`：`item.classList.toggle("large", isLargeExpense(entry));` を足し、`import { ..., isLargeExpense } from "./format.ts";` に名前を足します。

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

| 表示 | よくある原因 |
| --- | --- |
| テスト「収入なら金額にかかわらず false を返す」で `true !== false` | 種別を確かめていません。支出のときだけ `true` にします |
| テスト「10,000 円以上の支出なら true を返す」で `false !== true` | 10,000 円ちょうどを `false` にしています。`>` ではなく `>=` を使います |
| 型チェックで `Cannot find name 'isLargeExpense'.` | `render.ts` で `isLargeExpense` を `import` していません |
| 型チェックで `Type 'boolean' is not assignable to type 'string'.` | `item.className` に、`isLargeExpense(entry)` の結果をそのまま代入しています。`classList.toggle` を使います |
| テストは合格するが、画面の見た目が変わらない | `<li>` ではなく、中の `<span>` にクラスを付けています。Elements で、`large` がどの要素に付いているかを確かめます |
| テストは合格するが、全部の行が灰色になる | `classList.toggle("large")` と、2 つ目の引数（条件）を渡していません |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[practice/solutions/P04-events/src/format.ts](../solutions/P04-events/src/format.ts)、[practice/solutions/P04-events/src/render.ts](../solutions/P04-events/src/render.ts)

---

## チェックリスト

- [ ] ボタンごとではなく、一覧の全体に `click` の処理を登録している理由を説明できる
- [ ] `textContent` と `innerHTML` の違いと、入力の値を `innerHTML` に入れてはいけない理由を説明できる
- [ ] スタックトレースを上から読み、エラーが投げられた行と、呼び出した場所を見つけられる

## 詳しく学ぶ

- JavaScript Primer：[Todoアプリ「イベントとモデル」](https://jsprimer.net/use-case/todoapp/event-model/)、[例外処理](https://jsprimer.net/basic/error-try-catch/)（エラーとスタックトレース）
- サバイバルTypeScript：[デフォルト引数](https://typescriptbook.jp/reference/functions/default-parameters)（引数の既定値）
