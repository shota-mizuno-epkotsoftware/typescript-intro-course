# React 編 第5章 データの流れと集計

- **この章で学ぶこと**
  - state を、どのコンポーネントに置くか
  - 子のコンポーネントで起きた操作を、親のコンポーネントに伝える方法
  - 画面に出す値のうち、state に入れるものと入れないもの

---

## 5.1 読む範囲

| ファイル | 読む場所 | DOM 版の対応 |
| --- | --- | --- |
| `react/app/src/App.tsx` | 状態を更新する関数（59〜77行目）、絞り込みと `return`（79〜108行目）。27〜57行目の `useEffect` は第6章 | `practice/app/src/main.ts` のイベントの登録、`render.ts` の `render`（104〜110行目） |
| `react/app/src/components/FilterBar.tsx` | 全体 | `render.ts` の `renderFilter`、`main.ts` の絞り込みの `change`（70〜79行目） |
| `react/app/src/components/Summary.tsx` | 全体 | `render.ts` の `renderSummary` |

画面で試すときは、この章の改修用フォルダを起動します。

```sh
npm run dev R05
```

## 5.2 state は、それを使うコンポーネントの共通の親に置く

**state は、その値を使うコンポーネントすべての、共通の親に置きます。** 親は、props で子に値を渡します。データは、親から子へ、一方向に流れます。

明細は、`FilterBar`・`Summary`・`EntryList` の 3 つが使うので、3 つの親である `App` に置いてあります。`Summary` と `EntryList` には、絞り込んだ後の明細（`visibleEntries`）を渡しています。

`react/app/src/App.tsx`（97〜106行目）

```tsx
      <section className="panel">
        <h2>集計</h2>
        <FilterBar entries={state.entries} filter={state.filter} onFilterChange={handleFilterChange} />
        <Summary entries={visibleEntries} />
      </section>

      <section className="panel">
        <h2>明細</h2>
        <EntryList entries={visibleEntries} onRemove={handleRemove} />
      </section>
```

- 1 つのコンポーネントしか使わない値は、そのコンポーネントの中に置きます。入力途中の日付や金額は、`EntryForm` の state です（第4章の 4.3）。
- フォームの種別と入力エラーは、この決まりの例外です。`EntryForm` しか使いませんが、`App` の state にあります。DOM 版の `AppState` と `state.ts` を、そのまま使うためです。

> **DOM 版では**
> 状態は、`main.ts` の変数 `state` 1 つで、どの関数からも読めました。React 版では、state を持つのは 1 つのコンポーネントで、ほかのコンポーネントには props で渡した分だけが届きます。コンポーネントが受け取るものが、props の型を見れば分かります。

## 5.3 子から親へは、関数を呼んで知らせる

子は、親から props で受け取った関数を呼んで、親の state を更新してもらいます。

絞り込みの月を変えたときの流れは、次のとおりです。

`react/app/src/components/FilterBar.tsx`（26行目）

```tsx
        <select value={filter.month} onChange={(event) => onFilterChange({ month: event.target.value })}>
```

`react/app/src/App.tsx`（71〜73行目）

```tsx
  function handleFilterChange(changes: Partial<Filter>): void {
    setState((prev) => setFilter(prev, changes));
  }
```

- 渡す関数の型は、props の型に書きます。`onFilterChange: (changes: Partial<Filter>) => void` は、「絞り込みの一部を受け取り、何も返さない関数」です（`FilterBar.tsx` の 9 行目）。
- 名前には習慣があります。親が作る関数は `handle〜`、props の名前は `on〜` と付けます。`<FilterBar onFilterChange={handleFilterChange} />` は、「絞り込みが変わったら、`handleFilterChange` で処理する」と読めます。
- `setState` そのものは渡しません。渡すのは、「絞り込みを変える」のように、してほしいことを表す関数です。子は、state の形や更新のしかたを知らずに済みます。

> **DOM 版では**
> `main.ts` の `change` の処理が、`update(setFilter(state, { month: elements.filterMonth.value }));` と、状態の更新まで 1 か所で行っていました（70〜72行目）。React 版では、「操作を受け取る」のは `FilterBar`、「状態を更新する」のは `App` と、分かれています。

![上に App があり、state として明細・絞り込みの条件・分類の一覧・フォームの種別・入力エラーを持つ。visibleEntries は絞り込んだ後の明細。その下に 4 つの子がある。EntryForm は state.formKind・state.categories・state.formErrors を受け取り、onKindChange・onAdd・onErrors を呼ぶ。EntryForm は、入力途中の値を自分の state に持つ。FilterBar は state.entries と state.filter を受け取り、onFilterChange を呼ぶ。onFilterChange は App の handleFilterChange。Summary は visibleEntries を受け取る。EntryList は visibleEntries と onRemove を受け取り、onRemove を EntryItem へそのまま渡す。EntryList の下に EntryItem があり、entry と onRemove を受け取り、「削除」を押すと onRemove を呼ぶ。下向きの矢印は props で渡す値、上向きの矢印は子が呼ぶ props の関数。](images/R05-props-flow.svg "図5-1 親から子へは値、子から親へは関数の呼び出し")

## 問題 1：操作が `App` に届くまで

完成版（`react/app/`）のコードを読んで、次の問いに答えてください。削除の `onRemove` が `App` の `handleRemove` だということは、第2章の問題 4 でたどりました。1 は、5.3 の月の絞り込みと同じようにたどります。

1. フォームの種別を「収入」に変えると、`EntryForm` は props の `onKindChange` を呼びます。`App.tsx` で、`EntryForm` に `onKindChange` として渡している関数は何ですか。その関数は、`state.ts` のどの関数で新しい state を作りますか。
2. 1 で、state のうち、変わるプロパティは何ですか。`state.ts` を読んで答えてください。
3. 明細は、10 月の収入と支出が 1 件ずつです。「集計」の月を 10 月、種別を「収入」にすると、一覧には収入の 1 件だけが見えます。その収入を削除すると、一覧と月の選択欄には何が表示されますか。`state.ts` の `removeEntry`、`summary.ts` の `filterEntries`、`FilterBar.tsx` の 26 行目の `value` から考えます。

<details>
<summary>答えと解説</summary>

1. **`handleFormKindChange`**（67〜69行目）。`EntryForm` が呼ぶ `onKindChange` の正体です（91 行目）。`state.ts` の `setFormKind` で、新しい state を作ります。
2. **`formKind` と `formErrors`**。`setFormKind` は、種別を変えると同時に、入力エラーを空にします（`state.ts` の 37〜39行目）。
3. **一覧は空になり（「明細はまだありません。」）、月の選択欄は 10 月のまま**。一覧は `filterEntries` で絞り込んだ 10 月の収入だけで、その 1 件を削除しました。`removeEntry` が調べる絞り込む前の明細（`state.entries`）には 10 月の支出が残るので、`filter.month` は変わらず、選択欄の `value={filter.month}` も 10 月のままです。

</details>

## 問題 2：分類の欄で選ばれている値

この問題は、説明の前に予測します。DOM 版が、分類の欄の値をどう読んでいたかを思い出してください（`main.ts` の 48 行目の `elements.category.value`）。

`EntryForm` は、分類の欄で選んだ値を、`category` という state で持っています。

`react/app/src/components/EntryForm.tsx`（28行目）

```tsx
  const [category, setCategory] = useState("");
```

改修用フォルダの `EntryForm.tsx` の 47 行目の `category: selectedCategory` を `category` に書き換え、state の値をそのまま渡した場合を考えます。47 行目は、`parseEntryForm` に入力の値を渡している行です。

```tsx
      { kind, date, amount, category, source, memo },
```

ページを開くと、分類の欄には、先頭の「食費」が表示されています。

1. 分類の欄には触らずに、日付と金額を入れて「追加」を押すと、何が起きますか。
2. 分類の欄で「交通費」を選んでから、日付と金額を入れて「追加」を押すと、何が起きますか。

予測を書いたら、47 行目を上のように書き換えて、画面で試します。

<details>
<summary>答えと解説</summary>

1. **「分類を選んでください」と表示され、追加されません。** 画面には「食費」と表示されていますが、state の `category` は、最初の値の `""` のままです。`parseEntryForm` は、支出で分類が `""` のとき、このエラーを返します（実践編 第3章）。
2. **追加されます。** 選んだときに `onChange` が呼ばれ、`category` が `"交通費"` になっています。

> **DOM 版では**
> `elements.category.value` を読めば、画面に表示されている「食費」が返りました。値は入力欄そのものが持っていました。

完成版が、この食い違いをどう解決しているかは、5.4 で読みます。

</details>

## 問題 3：合計を state に持つ

この問題も、説明の前に予測します。支出の合計を画面に出すために、改修用フォルダの `src/App.tsx` を次の 3 か所で書き換え、合計を state に持たせます。

```tsx
  const [state, setState] = useState(createInitialState(initialEntries));
  const [expenseTotal, setExpenseTotal] = useState(0);
```

```tsx
  function handleAdd(entry: Entry): void {
    setState((prev) => addEntry(prev, entry));
    if (entry.kind === "expense") {
      setExpenseTotal((prev) => prev + entry.amount);
    }
  }
```

```tsx
        <h2>集計</h2>
        <p className="status">支出の合計: {expenseTotal}円</p>
```

明細が 1 件もない状態から、500 円の支出と 1,200 円の支出を追加すると、「支出の合計: 1700円」と表示されます。続けて、次の操作を順にします。

1. 500 円の支出を削除すると、「支出の合計」は何円と表示されますか。
2. 続けて「集計」の種別を「収入」に変えると、「支出の合計」は何円と表示されますか。
3. 続けてページを読み込み直すと、「支出の合計」は何円と表示されますか。

予測を書いたら、上の 3 か所を書き換え、ブラウザのシークレットウィンドウ（プライベートウィンドウ）で画面を開いて試します。これまでの明細とは保存される場所が別になり、明細のない状態から始まります。操作のたびに、「支出の合計」と、すぐ下の集計の「支出」の金額を見比べます。

<details>
<summary>答えと解説</summary>

1. **1700円**。`expenseTotal` を更新しているのは `handleAdd` だけです。削除しても変わりません。その下の集計の「支出」は、1,200円に変わっています。
2. **1700円**。絞り込みを変えても、`expenseTotal` は変わりません。集計の「支出」は、0円です。
3. **0円**。保存されているのは明細だけです。`expenseTotal` は、`useState(0)` の最初の値から始まります。集計の「支出」は、1,200円です。

合計を別の state に持つと、表示する明細が変わる所すべて（追加・削除・絞り込み・ページを開いたとき）で、合計も合わせて更新しなければなりません。1 か所でも忘れると、ずれます。

</details>

## 5.4 表示する値は、state から計算する

**state に入れるのは、元になる値だけです。** 元の値から計算できる値は、state に入れずに、コンポーネントが呼ばれるたびに計算します。

`react/app/src/App.tsx`（79行目）

```tsx
  const visibleEntries = filterEntries(state.entries, state.filter);
```

`react/app/src/components/Summary.tsx`（10行目）

```tsx
  const balance = balanceOf(entries);
```

- このアプリの state（`AppState`）にあるのは、明細・絞り込みの条件・分類の一覧・フォームの種別・入力エラーの 5 つです。絞り込んだ後の明細、収入と支出の合計、収支、月の選択肢は、どれも state にありません。
- 元の値が変われば、コンポーネントがもう一度呼ばれ、計算もやり直されます。

`react/app/src/components/EntryForm.tsx`（32〜34行目）

```tsx
  const categoryItems = categories.status === "ready" ? categories.items : [];
  // 分類の選択欄の value に渡す値
  const selectedCategory = category === "" ? (categoryItems[0] ?? "") : category;
```

`selectedCategory` は state ではなく、呼ばれるたびに計算する値です。「選んだ値（`category`）」と「分類の一覧（`categories`）」の 2 つから求めます。分類の選択欄の `value` には、この値を渡しています（`EntryForm.tsx` の 89 行目）。

問題 2 で、何も選んでいないのに「食費」と表示された理由は、この計算です。分類の一覧は、ページを開いた後、読み込みが終わってから届きます（第6章）。届くと `EntryForm` がもう一度呼ばれ、`category` は `""` のまま、`selectedCategory` が一覧の先頭の「食費」になります。

> **DOM 版では**
> `render` も、呼ばれるたびに `filterEntries(state.entries, state.filter)` を計算していました（`render.ts` の 105 行目）。「状態から画面を作る」形にしてあったので、この考え方は React 版でも同じです。

---

## 問題 4：props を 1 つ足す

`Summary` に、絞り込む前の全部の明細の件数も表示することにしました。件数は `App` が `state.entries.length` で求め、`allCount` という名前の props で渡します。完成版（`react/app/`）のコードを読んで答えます。ファイルは書き換えません。

1. `allCount` を `Summary` に届けるために直す所を、ファイル名と行番号で 3 つ挙げてください（表示する行は除きます）。
2. 3 つのうち `Summary.tsx` の 2 つだけを直し、`App.tsx` を直し忘れました。`npm run typecheck rapp` は、`App.tsx` の何行目に、どんなエラーを出しますか。

<details>
<summary>答えと解説</summary>

1. **次の 3 つです。** 受け取る側の型、受け取る側の引数、渡す側のタグです（第2章の 2.2）。
   - `Summary.tsx` の 5〜7 行目：`SummaryProps` に `allCount: number;` を足す
   - `Summary.tsx` の 9 行目：引数を `{ entries, allCount }` にする
   - `App.tsx` の 100 行目：`<Summary entries={visibleEntries} allCount={state.entries.length} />` にする
2. **100 行目に、`allCount` がないというエラーが出ます。** 型に足したプロパティは、渡すのが必須だからです（第2章の問題 1 で読んだ `onRemove` と同じ形）。

   ```text
   react/app/src/App.tsx(100,10): error TS2741: Property 'allCount' is missing in type '{ entries: Entry[]; }' but required in type 'SummaryProps'.
   ```

   `Summary` を呼んでいるテストのファイル（`Summary.test.ts`）にも、同じエラーが出ます。

</details>

## 改修：集計に「入金元ごとの収入」を足す

集計の「分類ごとの支出」の下に、「入金元ごとの収入」の一覧を足します。実践編 第5章と同じ改修です。

入金元ごとに合計する関数 `totalsBySource` は、改修用フォルダの `src/summary.ts` に用意してあります。足りないのは、画面に表示する部分です。

**進め方**

#### 一覧を表示する

1. 画面を起動したままにする（止めていたら、次を実行する）
   ```sh
   npm run dev R05
   ```
   - 画面が表示されたら、入金元と月が違う収入を 2 件追加します（たとえば、10 月の「給料」と 11 月の「副業」）
   - **こうなれば OK**：一覧にその 2 件があり、「集計」の月の欄で、両方の月を選べる
2. `react/exercises/R05-flow/src/components/Summary.tsx` の、「分類ごとの支出」の一覧（`</ul>`）の下に、見出しと一覧を足す
   - 見出しは `<h3>入金元ごとの収入</h3>` です
   - 一覧の形は、すぐ上の「分類ごとの支出」と同じです。`totalsBySource(entries)` は、`{ source, total }` の配列を返します
   - `key` には、`source` を渡します
   - 先頭の `import { balanceOf, totalOf, totalsByCategory } from "../summary.ts";` の `{ }` の中に、`totalsBySource` を足します
   - **こうなれば OK**：集計に「入金元ごとの収入」の見出しと、「給料: 200,000円」の形の行が表示される

#### 収入がないときは、見出しも出さない

3. 収入が 1 件もないときは、見出しと一覧の両方を表示しないようにする
   - `totalsBySource(entries)` の結果は、条件と一覧の両方で使うので、`return` の前で変数に入れます
   - 条件は、`配列.length > 0` のように、`true` か `false` になる式にします。`配列.length &&` と書くと、`0` が表示されます（第2章の問題 3）
   - 見出しと一覧の 2 つは、`<>` と `</>` で囲んでから、`条件 && (…)` の `( )` に入れます。`( )` の中に書けるのは、1 つの要素です
   ```sh
   npm test R05
   ```
   - **こうなれば OK**：「テスト: OK」
4. 画面で次を 1 つずつ試す
   - [ ] 収入があるとき、「入金元ごとの収入」に、入金元ごとの合計が、金額の大きい順に表示される
   - [ ] 同じ入金元の収入を 2 件追加すると、1 行にまとまり、金額が合計になる
   - [ ] 「集計」の種別を「支出」に変えると、見出しと一覧が消える。`0` のような余分な文字も出ない
   - [ ] 種別を「すべて」に戻し、手順 1 で使った月の 1 つで絞り込むと、その月の収入だけが入金元ごとに合計される。ほかの月にしかない入金元は消える
   - [ ] Console に、`key` の警告（`Each child in a list should have a unique "key" prop.`）が出ていない

#### 仕上げる

5. 画面を `Ctrl` + `C` で止め、型チェックとテストを実行する
   ```sh
   npm run check R05
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
6. 自分の変更を差分で読む
   ```sh
   git diff react/exercises/R05-flow
   ```
   - **こうなれば OK**：`Summary.tsx` の 1 つのファイルだけが表示される

**テストで確かめるもの**

| 表示するもの | 画面の HTML |
| --- | --- |
| 給料 200,000 円の収入がある `Summary` | 「分類ごとの支出」の一覧の後に、`<h3>入金元ごとの収入</h3>`、`<ul class="plain-list">`、`<li>給料: 200,000円</li>`、`</ul>` |
| 副業 30,000 円と給料 180,000 円の `Summary` | `<li>給料: 180,000円</li>`、`<li>副業: 30,000円</li>` の順 |
| 支出だけの `Summary` | 「分類ごとの支出」の一覧の `</ul>` で終わる |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- 一覧の形：`Summary.tsx` の 22〜29 行目
- 計算の結果を変数に入れている例：`Summary.tsx` の 10 行目
- `条件 && <タグ>` の例：`EntryList.tsx` の 18 行目

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- `import` に `totalsBySource` を足し、`const balance = …;` の下に `const sourceTotals = totalsBySource(entries);` を足します。
- 「分類ごとの支出」の `</ul>` の下に、次を足します。

  ```tsx
        {sourceTotals.length > 0 && (
          <>
            <h3>入金元ごとの収入</h3>
            <ul className="plain-list">
              {sourceTotals.map(({ source, total }) => (
                <li key={source}>
                  {source}: {formatYen(total)}
                </li>
              ))}
            </ul>
          </>
        )}
  ```

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

テストの表示で、`-` で始まる行は「テストが期待しているのに、画面にない行」、`+` で始まる行は「画面にあるのに、テストが期待していない行」です。

| 表示 | よくある原因 |
| --- | --- |
| テスト「収入が 1 件もないとき、入金元ごとの収入の見出しを表示しない」で `+ '</ul>0'` と `- '</ul>'` | `sourceTotals.length && (…)` と書いています。長さが `0` のとき、`0` が表示されます。`sourceTotals.length > 0 &&` にします |
| 同じテストで、`+ '<h3>入金元ごとの収入</h3>'` が出る | 条件を付けずに、見出しと一覧を足しています（手順 3 がまだです） |
| 同じテストで、`+ '<ul class="plain-list">'` と `+ '</ul>'` だけが出る | 見出しにだけ条件を付けています。一覧も、`<>` の中に入れます |
| テストで、ファイルの名前の行（`Summary.test.ts` など）が `✖` になる。型チェックで `JSX expressions must have one parent element.` | `条件 && (…)` の `( )` の中に、`<h3>` と `<ul>` を並べています。`<>` と `</>` で囲みます |
| テストで `ReferenceError [Error]: totalsBySource is not defined` が出て、`App` のテストも `✖` になる。型チェックで `Cannot find name 'totalsBySource'.` | `Summary.tsx` で `totalsBySource` を `import` していません |
| Console に `Each child in a list should have a unique "key" prop.` | `<li>` に `key` を付けていません |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[react/solutions/R05-flow/src/components/Summary.tsx](../solutions/R05-flow/src/components/Summary.tsx)

---

## チェックリスト

- [ ] 明細の配列を、`EntryList` や `Summary` ではなく、`App` の state に置いている理由を説明できる
- [ ] 支出の合計を state に持つと、どんな操作でずれるかを説明できる
- [ ] 分類の欄に「食費」と表示されていても、state の `category` が `""` のことがある理由を説明できる

## 詳しく学ぶ

- React 公式ドキュメント：[コンポーネント間で state を共有する](https://ja.react.dev/learn/sharing-state-between-components)、[state 構造の選択](https://ja.react.dev/learn/choosing-the-state-structure)、[コンポーネントを純粋に保つ](https://ja.react.dev/learn/keeping-components-pure)
- 発展：コンポーネントの階層が深く、props で渡すのが大変なときの仕組みに、コンテクストがあります。この講座では扱いません。[コンテクストで深くデータを受け渡す](https://ja.react.dev/learn/passing-data-deeply-with-context)
