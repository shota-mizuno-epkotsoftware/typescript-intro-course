# React 編 第3章 状態と再描画

- **この章で学ぶこと**
  - state を更新してから画面が変わるまでと、更新した直後の state の値、フックを呼ぶ場所の決まり

---

## 3.1 読む範囲と、この章の決まり

完成版の `react/app/src/App.tsx` の `useState` と状態を更新する関数（27〜57行目の `useEffect` は第6章で読みます）、`state.ts` の `addEntry`・`removeEntry`、`components/EntryForm.tsx` の `useState` の並びを読みます。

改修用フォルダ（`react/exercises/R03-state/`）の家計簿では、「削除」を押しても明細が消えません。章の最後の改修で直すので、それまでは追加と絞り込みで試します。画面は次のコマンドで起動します。

```sh
npm run dev R03
```

## 3.2 state を更新すると、関数がもう一度呼ばれる

**state**（状態）は、コンポーネントが覚えておく値です。state を更新すると、React がコンポーネントの関数をもう一度呼び、返ってきた JSX に合わせて画面を直します。DOM 版では、状態を変数に入れ、画面を作り直す `render` を自分で呼んでいました。

`practice/app/src/main.ts`（20〜27行目）

```ts
// 状態を新しくし、明細が変わっていれば保存して、画面を作り直す
function update(next: AppState): void {
  if (next.entries !== state.entries) {
    saveEntries(next.entries);
  }
  state = next;
  render(state, elements);
}
```

`react/app/src/App.tsx`（24〜25行目）

```tsx
export function App({ initialEntries }: AppProps) {
  const [state, setState] = useState(createInitialState(initialEntries));
```

`react/app/src/App.tsx`（59〜61行目）

```tsx
  function handleAdd(entry: Entry): void {
    setState((prev) => addEntry(prev, entry));
  }
```

- `useState(最初の値)` は、「今の値」と「更新する関数」の 2 つが入った配列を返します。25 行目は、それを分割代入（本編第4章）で `state` と `setState` に取り出しています。
- `setState` を呼ぶと、React が新しい値を覚え、`App` をもう一度呼びます。このとき `useState` は、覚えている新しい値を返します。60 行目の、関数を渡す形は 3.4 で読みます。

state の更新でコンポーネントの関数がもう一度呼ばれることを、**再描画**（再レンダー）と呼びます。もう一度呼ばれるのは、その state を持つコンポーネントと、その JSX の中に置いたコンポーネントです。このアプリでは、`App` が呼ばれると、`EntryForm` や `EntryList` も、`EntryList` の中の `EntryItem` も呼ばれます。

**開発中は、React がコンポーネントの関数を 2 回ずつ呼びます。** 原因は、`main.tsx` で `App` を `<StrictMode>` で囲んでいることです。間違いを見つけやすくするための仕組みです。

`react/app/src/main.tsx`（11〜15行目）

```tsx
createRoot(root).render(
  <StrictMode>
    <App initialEntries={loadEntries()} />
  </StrictMode>,
);
```

## 問題 1：App は何回呼ばれるか

改修用フォルダの `src/App.tsx` で、25 行目の下に次の 1 行を足します。

```tsx
  console.log("App が呼ばれた");
```

- ページを開くと、分類の読み込みが終わったときに、`setState` が 1 回呼ばれます（`App.tsx` の 40 行目。この問題の行番号は、1 行足す前のものです）。
- 「集計」の月と種別は、`App` の state の `filter` が持っています。種別を変えると、`App.tsx` の 72 行目の `setState` が呼ばれます。
- 金額の欄に打った文字は、`EntryForm.tsx` の 27 行目の state が持っています。1 文字打つたびに `setAmount` が呼ばれ、この state が更新されます（仕組みは第4章で読みます）。

次のとき、Console に「App が呼ばれた」は何行出ますか。同じ表示が続けて出ても、全部数えます。Console が同じ表示をまとめて横に回数を出すときは、その数を読みます。

1. ページを開いてから、分類の選択肢が出るまで
2. 「集計」の種別を「支出」に変えたとき（フォームの種別ではありません）
3. 金額の欄に 1 文字打ったとき

予測を書いたら、Console に「App が呼ばれた」が何行出るかを数えます。1 はページを読み込み直してから、2 と 3 は操作の前に Console の左上の丸に斜線のボタンで表示を消してから数えます。

<details>
<summary>答えと解説</summary>

1. **4 行**。最初の表示で 2 行、分類の読み込みが終わったときの `setState` で 2 行です。どちらも、開発中は 2 回ずつ呼ばれます。
2. **2 行**。種別を変えると、`handleFilterChange` が `setState` を呼びます（`App.tsx` の 71〜73行目）。`App` が持つ state が変わるので、`App` がもう一度呼ばれます。
3. **0 行**。金額の欄の state を持っているのは `EntryForm` です。もう一度呼ばれるのは `EntryForm` だけで、`App` は呼ばれません。

**確かめ方**：3 は、`EntryForm.tsx` の 25 行目の下に `console.log("EntryForm が呼ばれた");` を足して、1 文字打ちます。「EntryForm が呼ばれた」が 2 行出ます。

</details>

## 問題 2：更新の直後の値

DOM 版の `update`（3.2 の抜粋）を思い出して、説明の前に予測します。先に、「集計」の月と種別を「すべて」にして、今の明細の件数を控えます。本文では 2 件を例にします。その後で、改修用フォルダの `src/App.tsx` の `handleAdd` に、1 行足します。

```tsx
  function handleAdd(entry: Entry): void {
    setState((prev) => addEntry(prev, entry));
    console.log("追加の直後", state.entries.length);
  }
```

1. 1 件追加すると、Console に出る数は何ですか。
2. 続けてもう 1 件追加すると、何が出ますか。

<details>
<summary>答えと解説</summary>

1. **2**（控えた件数）。追加する前の件数です。
2. **3**（控えた件数より 1 多い数）。

画面の一覧は、どちらのときも正しい件数に増えています。理由は、次の 3.3 で説明します。

> **DOM 版では**
> `update(addEntry(state, entry));` の次の行では、`update` が `state = next;` を実行し終えています。そこに同じ `console.log` を書くと、増えた後の数が出ます。

</details>

## 3.3 state は、その回の値のまま

**`setState` を呼んでも、その回の `state` は変わりません。** `setState` は、「次はこの値で呼んでください」と React に頼むだけです。`state` は、`App` が呼ばれるたびに作られる別の変数です。新しい値が入るのは、次に呼ばれたときの `state` です。

- `handleAdd` も、`App` が呼ばれるたびに作り直されます。関数は、作られた場所の変数を覚えていて、後で呼ばれたときもその変数を使います（**クロージャ**。本編第3章の 3.4）。前の回に作られた `handleAdd` が使うのは、前の回の `state` です。少し待っても、新しい値にはなりません。

![左右に 2 つの枠がある。左は前の回に呼ばれた App で、state.entries は明細 2 件。その回に作った handleAdd は、この state を覚えている。handleAdd の中で setState を呼ぶと、「次はこの値で」と React に頼み、矢印が右の枠の state に向かう。その後の console.log(state.entries.length) は、覚えている左の state を読むので 2 を出す。右は次に呼ばれた App で、state.entries は明細 3 件。handleAdd も新しく作られ、右の state を覚えている。下の EntryForm の onAdd は、右の新しい handleAdd を指している。次に「追加」を押すと、右の handleAdd が動く。](images/R03-snapshot.svg "図3-1 state は、その回の値のまま")

## 問題 3：続けて 2 回更新する

同じ内容の明細を、1 回の「追加」で 2 件足そうとして、改修用フォルダの `handleAdd` を次のように書き換えました。`copy` は、`id` を変え、メモを「コピー」にした明細です。

```tsx
  function handleAdd(entry: Entry): void {
    const copy = { ...entry, id: crypto.randomUUID(), memo: "コピー" };
    setState(addEntry(state, entry));
    setState(addEntry(state, copy));
  }
```

`setState` には、このように新しい値をそのまま渡すこともできます。`setState(値)` は、state 全体をその値に置き換えるよう React に頼む書き方です。1 回の操作の中で何回か頼むと、React は書いた順に処理します。

1. 日付と金額を入れて「追加」を 1 回押すと、一覧の明細は何件増えますか（予測を書いてから押します）。
2. 増えるのは、`entry` と `copy` のどちらですか（複数なら両方）。

この書き換えは、次の 3.4 でも使うので、答えを読んだ後も戻さずに進みます。

<details>
<summary>答えと解説</summary>

1. **1 件**。2 行とも、同じ `state`（追加する前の値）から次の値を作っています。
2. **`copy`**（メモが「コピー」の明細）。1 行目は「前の明細＋`entry`」、2 行目は「前の明細＋`copy`」を React に頼んでいます。後から頼んだ 2 行目の値が使われます。

</details>

## 3.4 前の state から次の state を作るときは、関数を渡す

`setState` には、新しい値の代わりに、「前の state を受け取って、次の state を返す関数」を渡せます。React は、その時点でいちばん新しい state を引数に入れて、この関数を呼びます。問題 3 の `handleAdd` の 2 行を次のように変えて試し、終わったら `App.tsx` を戻します。

```tsx
    setState((prev) => addEntry(prev, entry));
    setState((prev) => addEntry(prev, copy));
    // 画面: 明細が 2 件増える
```

## 3.5 state は書き換えず、新しく作る

**配列やオブジェクトの state を更新するときは、元を変えずに、新しい配列やオブジェクトを作って渡します。** React は前後の state を `===` で比べるので、同じオブジェクトを渡すと、中身を書き換えていても（本編第4章）画面は変わりません。元の配列を書き換える `push`・`splice` は使わず、新しい配列を作る `filter`・`[...配列]` を使います。

実践編の `state.ts` の関数（`addEntry`・`setFilter` など）は、元の state を変えずに新しい state を返します。画面を変えるには、その戻り値を `setState` に渡します。

`react/app/src/state.ts`（14〜16行目）

```ts
export function addEntry(state: AppState, entry: Entry): AppState {
  return { ...state, entries: [...state.entries, entry], formErrors: [] };
}
```

## 問題 4：書き換えた state を渡す

改修用フォルダの `src/App.tsx` の `handleAdd` を、次のように書き換えます。フォームの種別は「支出」、「集計」の月と種別は「すべて」で始めます。

```tsx
  function handleAdd(entry: Entry): void {
    state.entries.push(entry);
    setState(state);
  }
```

- 入力欄については、`EntryForm.tsx` の 55〜60 行目で、`onAdd` の前に何をしているかを見ます。
- 明細の保存は、`state.entries` が前と違う配列になったときに動きます。DOM 版の `update` の `if (next.entries !== state.entries)` と同じ判定です（仕組みは第6章）。

1. 日付と金額を入れて「追加」を押すと、一覧と入力欄は、それぞれどうなりますか。
2. そのまま「集計」の種別を「支出」に変えると、一覧はどうなりますか。
3. 2 の後でページを読み込み直すと、追加した明細は残っていますか。

<details>
<summary>答えと解説</summary>

1. **一覧は変わらず、日付・金額・メモの欄は空に戻ります。** `setState` に渡した `state` は、前の state と同じオブジェクトです。React は変わっていないと判断し、一覧と集計を変えません。日付・金額・メモの欄は、`EntryForm` の state が空の文字列に更新されたので、空に戻ります。分類の欄も、先頭の分類に戻ります。
2. **追加したはずの明細が、一覧に現れます。** 種別を変えると、`setFilter` が新しい state を作るので、`App` がもう一度呼ばれます。`push` で足した明細は配列に入っているので、このときに表示されます。
3. **残っていません。** `push` では同じ配列のままなので、保存が動きません。2 の `setFilter` も `{ ...state, filter: … }` で新しい state を作りますが、`entries` には同じ配列がそのまま入ります（本編第4章の 4.6）。そのため、このときも保存は動きません。

</details>

## 3.6 フックは、コンポーネントの一番上で呼ぶ

**フック**（`useState` のように、`use` で始まる React の関数）は、`if` や `for` の中ではなく、コンポーネントの関数の一番上で、毎回同じ順番で呼びます。

React は、state を「何番目の `useState` か」で見分けています。`EntryForm` には `useState` が 5 つ並んでいて、React は、1 番目が日付、2 番目が金額、という順番で値を覚えています。一覧の行のように同じコンポーネントを何か所かに表示すると、React は表示している場所ごとに、state を別に覚えます。呼ぶ回数や順番が回によって変わると、React はどの値を返せばよいか分からなくなります。

`react/app/src/components/EntryForm.tsx`（26〜30行目）

```tsx
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [memo, setMemo] = useState("");
```

**リンター**は、コードを実行せずに読んで、間違いになりやすい書き方を知らせる道具です。この決まりを破っていないかは、リンターを動かす次のコマンドで調べられます。ESLint というリンターも、同じ内容を知らせます。

```sh
npm run lint R03
```

## 問題 5：リンターの表示を読む

改修用フォルダの `src/components/EntryForm.tsx` の 29〜30 行目を、次のように書き換えます。入金元の欄は種別が収入のときにしか表示しないので、state も収入のときだけ作ろうとした、という書き換えです。

```tsx
  const [memo, setMemo] = useState("");
  if (kind === "income") {
    const [source, setSource] = useState("");
  }
```

`npm run lint R03` を実行すると、次の表示が出ます。エディタには型エラーの赤い波線も出ますが（`if` の中で作った `source` は、外から見えないため）、ここではリンターの表示だけを読みます。

```text
  x react-hooks(rules-of-hooks): React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
    ,-[react/exercises/R03-state/src/components/EntryForm.tsx:31:33]
 29 |   const [memo, setMemo] = useState("");
 30 |   if (kind === "income") {
    :       ^^^^^^^^|^^^^^^^^
    :               `-- When this condition is false, this Hook is skipped.
 31 |     const [source, setSource] = useState("");
    :                                 ^^^^^^|^^^^^
    :                                       `-- This Hook call is not reachable on every render path.
 32 |   }
    `----
  help: Move the Hook call before the condition, or call it unconditionally and branch inside the Hook/effect instead.

=== 結果 ===
lint: エラー 1 件、警告 0 件
```

1. 表示が問題にしているのは、何行目の、どの呼び出しですか。
2. `kind` が `"expense"` のときと `"income"` のときで、`EntryForm` の中で呼ばれる `useState` は、それぞれいくつですか。画面は操作せず、コードを上からたどって数えます。
3. どう直しますか。

<details>
<summary>答えと解説</summary>

1. **31 行目の `useState("")`**。表示の 1 行目の `called conditionally` は、「条件によって呼ばれたり呼ばれなかったりする」という意味です。30 行目の下の説明は、「この条件が `false` のとき、このフックは飛ばされる」です。
2. **`"expense"` のとき 4 つ、`"income"` のとき 5 つ**。支出のときは `if` の中を通りません。種別を変えると呼ぶ回数が変わるので、毎回同じ順番で呼ぶ、という決まりを破っています。
3. **`useState` を `if` の外に出し、一番上で呼びます**（元の 29 行目の形）。入金元の欄を表示するかどうかは、state を作るかどうかではなく、JSX の側で決めます（`EntryForm.tsx` の 86〜102行目）。

呼ぶ回数が変わるコードを画面で試すと、React がエラーを投げ、画面が表示されなくなります。

</details>

## 問題 6：削除の流れを DOM 版と並べる

`App.tsx` の `handleRemove`（75〜77行目）が呼ばれてから画面の明細が消えるまでを、DOM 版の `update(removeEntry(state, id));`（`main.ts` の 87 行目）と次の 3 段階で並べて説明してください。`handleRemove` は、一覧の「削除」を押すと呼ばれます。ボタンから `handleRemove` までの道は、第2章の問題 4 でたどりました。この問題では、React 版は完成版（`react/app/`）を読みます。

1. 新しい状態を作る
2. 状態を入れ替える
3. 画面を作り直す

<details>
<summary>答えと解説</summary>

| 段階 | DOM 版 | React 版 |
| --- | --- | --- |
| 1. 新しい状態を作る | `removeEntry(state, id)`（`state.ts`） | `removeEntry(prev, id)`（同じ `state.ts`）。`prev` は、React が渡す、いちばん新しい state |
| 2. 状態を入れ替える | `update` の中の `state = next;`（`main.ts` 25 行目）。その場で変わる | `setState` が React に頼む。その回の `state` は変わらず、次に呼ばれた `App` の `state` が新しい値になる |
| 3. 画面を作り直す | `update` が `render` を呼ぶ（`main.ts` 26 行目） | React が `App` をもう一度呼び、返ってきた JSX に合わせて画面を直す。`render` にあたる呼び出しは書かない |

</details>

---

## 改修：削除しても明細が消えない不具合を直す

改修用フォルダの家計簿は、「削除」を押しても明細が消えません。原因を読み、直します。

**進め方**

#### 症状を見る

1. 画面を起動したままにする（止めていたら、次を実行する）
   ```sh
   npm run dev R03
   ```
   - **こうなれば OK**：家計簿の画面が表示される
2. 「集計」の月と種別を「すべて」にして明細を 2 件追加し、1 件の「削除」を押して、次を 1 つずつ見る
   - [ ] 「削除」を押しても、行が消えない
   - [ ] 「集計」の種別を「支出」に変え、「すべて」に戻すと、その行が消えている
   - [ ] ページを読み込み直すと、その行が戻っている

#### 原因を読む

3. `react/exercises/R03-state/src/state.ts` の `removeEntry`（18〜29行目）を読み、3.5 の決まり（state は書き換えず、新しく作る）に合わない行を探す
   - `配列.findIndex(関数)` は、関数が `true` を返す最初の要素の位置を返します。見つからなければ `-1` です
   - `配列.splice(位置, 1)` は、その位置の要素を 1 つ取り除きます。元の配列を書き換えます
   - **こうなれば OK**：元の配列やオブジェクトを書き換えている行と、受け取った `state` をそのまま返している行を見つけた
4. テストを実行する
   ```sh
   npm test R03
   ```
   - 2 つのテストは、`removeEntry` に渡した**元の** state を調べています。`actual` は呼んだ後の元の値、`-` は期待した値にだけある行です
   - **こうなれば OK**：`removeEntry` の、名前の違う 2 つのテストが `✖` になり、最後に「テスト: 不合格あり」と出る（「失敗の内容」にも、同じ名前がもう一度出ます）

#### 直す

5. `removeEntry` を、受け取った `state` を変えずに、新しい状態を作って返す形に書き直す
   - 元の配列を変えずに要素を除くには、`filter` を使います（本編第7章）
   - 月の絞り込みを外すときは、絞り込みの条件 `state.filter` も、`state.filter.month = "all";` と書き換えずに、新しいオブジェクトを作ります。一部だけを変えた新しいオブジェクトは、`{ ...元のオブジェクト, 変える項目 }` で作ります（本編第4章）
   - その月の明細が残っているかは、新しく作った配列で調べます（`state.entries` は、除く前のままです）。月の絞り込みを外す条件そのもの（その月の明細がなくなったとき）は、変えません
   ```sh
   npm test R03
   ```
   - **こうなれば OK**：「テスト: OK」
6. 画面で次を 1 つずつ試す
   - [ ] 「削除」を押すと、その行がすぐに消える
   - [ ] ページを読み込み直しても、削除した行は戻らない
   - [ ] 月で絞り込み、その月の最後の 1 件を削除すると、月の絞り込みが「すべて」に戻る

#### 仕上げる

7. 画面を `Ctrl` + `C` で止め、型チェックとテストを実行する
   ```sh
   npm run check R03
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
8. 自分の変更を差分で読む
   ```sh
   git diff react/exercises/R03-state
   ```
   - **こうなれば OK**：`state.ts` の 1 つのファイルだけが表示される（問題で書き換えたファイルが出たら、`git restore ファイルのパス` で戻す）

**テストで確かめるもの**

`before` は、`id` が `a`・`b`・`c`・`d` の 4 件の明細を持つ状態です。

| 呼び出し | 返す値・確かめること |
| --- | --- |
| `removeEntry(before, "b")` | 明細の `id` が `a`・`c`・`d` の状態 |
| `removeEntry(before, "b")` の後の `before` | 明細は 4 件のまま |
| `removeEntry(before, "b")` | `before` とは別のオブジェクト。`entries` も別の配列 |
| 月と種別で絞り込んだ状態から、その月の最後の 1 件を除く | 月が `"all"`、種別はそのままの状態。元の状態の月は変わらない |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- 書き換えている行：21 行目（`splice`）と 26 行目（`state.filter.month = "all";`）
- そのまま返している行：28 行目（`return state;`）
- 新しく作って返す形の例：同じファイルの `addEntry` と `setFilter`

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- 明細を除く：`const entries = state.entries.filter((entry) => entry.id !== id);`
- 返す値：`return { ...state, entries, filter: 月が残っていれば state.filter、なければ { ...state.filter, month: "all" } };`

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

`A !== B` の表示は、左の `A` がテストの調べた実際の値（関数の返した値や、呼んだ後の元の状態の値）、右の `B` がテストの期待する値です。

| 表示 | よくある原因 |
| --- | --- |
| テスト「受け取った状態を変えず、新しい状態を返す」で、`actual` が `[ 'a', 'c', 'd' ]` | `state.entries = state.entries.filter(...)` のように、受け取った `state` のプロパティに代入しています。新しい配列は、別の変数に入れます |
| テスト「絞り込み中の月の明細がなくなったら、月の絞り込みを外す」で `'all' !== '2026-10'` | `state.filter.month = "all";` が残っています。元の `filter` を書き換えずに、`{ ...state.filter, month: "all" }` で新しく作ります |
| テスト「絞り込み中の月の明細がなくなったら、月の絞り込みを外す」で `'2026-10' !== 'all'` | その月の明細が残っているかを、除く前の `state.entries` で調べています。新しく作った配列で調べます |
| テスト「絞り込み中の月の明細がなくなったら、月の絞り込みを外す」で `'all' !== 'expense'` | 月の絞り込みを外すときに、種別まで `"all"` にしています。`{ ...state.filter, month: "all" }` の形で、月だけを変えます |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[react/solutions/R03-state/src/state.ts](../solutions/R03-state/src/state.ts)

---

## チェックリスト

- [ ] `setState` を呼んだ次の行で `state` を見ると、古い値のままである理由を説明できる
- [ ] 配列に `push` してから `setState` に渡しても、画面が変わらない理由を説明できる
- [ ] `setState(addEntry(state, entry))` を 2 回続けて書くと、1 件しか増えない理由を説明できる

## 詳しく学ぶ

- React 公式ドキュメント：[state：コンポーネントのメモリ](https://ja.react.dev/learn/state-a-components-memory)、[state はスナップショットである](https://ja.react.dev/learn/state-as-a-snapshot)、[一連の state の更新をキューに入れる](https://ja.react.dev/learn/queueing-a-series-of-state-updates)、[state 内のオブジェクトの更新](https://ja.react.dev/learn/updating-objects-in-state)、[state 内の配列の更新](https://ja.react.dev/learn/updating-arrays-in-state)、[`<StrictMode>`](https://ja.react.dev/reference/react/StrictMode)、[React のルール](https://ja.react.dev/reference/rules)
