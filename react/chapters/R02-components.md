# React 編 第2章 コンポーネントと props

- **この章で学ぶこと**
  - 大文字で始まるタグが何をしているかと、タグに書いた属性の行き先
  - 配列を画面に並べる書き方と、`key` の役目
  - 条件で表示を変える書き方と、思いがけないものが表示される場合

---

## 2.1 読む範囲

| ファイル | 読む場所 | DOM 版の対応 |
| --- | --- | --- |
| `react/app/src/App.tsx` | コンポーネントを並べている所（81〜108行目の `return`） | `practice/app/src/render.ts` の `render` |
| `react/app/src/components/EntryList.tsx` | 全体 | `render.ts` の `renderList`（99〜102行目） |
| `react/app/src/components/EntryItem.tsx` | 全体 | `render.ts` の `createEntryItem` |
| `react/app/src/components/EntryForm.tsx` | 種別による表示の切り替え（86〜102行目） | `render.ts` の `renderForm`（42〜43行目） |

`EntryItem.tsx` の 18 行目の `onClick` は、第4章で読みます。この章では、「ボタンが押されると、`{ }` の中の関数が動く」とだけ読みます。

画面で試すときは、この章の改修用フォルダを起動します。

```sh
npm run dev R02
```

## 2.2 コンポーネントは、JSX を返す関数

コンポーネントは、JSX を返す関数です（第1章の 1.3）。JSX の中に大文字で始まるタグを書くと、React がその名前の関数を呼び、返ってきた JSX をその場所に入れます。

`react/app/src/App.tsx`（103〜106行目）

```tsx
      <section className="panel">
        <h2>明細</h2>
        <EntryList entries={visibleEntries} onRemove={handleRemove} />
      </section>
```

`react/app/src/components/EntryList.tsx`（5〜11行目）

```tsx
type EntryListProps = {
  entries: Entry[];
  onRemove: (id: string) => void;
};

export function EntryList({ entries, onRemove }: EntryListProps) {
  return (
```

- タグに書いた属性は、1 つのオブジェクトにまとまって、関数の引数に渡ります。このオブジェクトを **props** と呼びます。105 行目では、`EntryList` に、`entries` と `onRemove` の 2 つのプロパティを持つオブジェクトが渡ります。
- 受け取る側は、引数の props から `entries` と `onRemove` を分割代入（本編第4章）で取り出しています。この例では、props の型を `type` で書いています。
- 小文字で始まるタグ（`<section>`・`<h2>`）は、HTML の要素です。大文字で始まるタグは、自分で書いたコンポーネントです。コンポーネントの名前は、必ず大文字で始めます。
- props の名前は、自分で決めます。`onRemove` は、`EntryList` の作者が決めた名前で、HTML の決まった属性ではありません。値には、関数も渡せます。
- props は書き換えません。受け取った値を使って、JSX を作るだけにします（書き換えても再描画は起きず、画面と値がずれます。同じ種類の不具合を、第3章の 3.5 で読みます）。

> **DOM 版では**
> 画面の部分ごとに、`renderList(entries, elements)` のような関数を作り、`render` から呼んでいました。React 版では、関数を自分では呼ばず、タグの形で書きます。

## 問題 1：型エラーを読む

改修用フォルダの `src/components/EntryList.tsx` の 15 行目から、`onRemove={onRemove}` を消します。

```tsx
          <EntryItem key={entry.id} entry={entry} />
```

`key` は、2.3 で読む React 用の特別な名前です。

型チェックを実行すると、次のエラーが出ます。

```sh
npm run typecheck R02
```

```text
react/exercises/R02-components/src/components/EntryList.tsx(15,12): error TS2741: Property 'onRemove' is missing in type '{ key: string; entry: Entry; }' but required in type 'EntryItemProps'.
```

1. エラーの `'{ key: string; entry: Entry; }'` は、何の型ですか。
2. `'EntryItemProps'` は、どのファイルに書いてありますか。足りないと言われているのは、どのプロパティですか。
3. このエラーを直さずに画面を動かすと、「削除」を押したときに何が起きると思いますか。

<details>
<summary>答えと解説</summary>

1. **15 行目のタグに書いた属性をまとめたオブジェクトの型**。`key` と `entry` が載っています。`key` は React が受け取るので、`EntryItem` の props には入りません（2.3 で読みます）。
2. **`EntryItem.tsx`（4〜7行目）。足りないのは `onRemove`**。`EntryItemProps` は `entry` と `onRemove` の 2 つを必要としていますが、渡しているのは `entry` だけです。
3. **Console に `TypeError: onRemove is not a function` が出て、明細は消えません。** `EntryItem` の中の `onRemove` が `undefined` で、関数として呼べません。型チェックは、画面を動かす前にこの間違いを見つけています。
   - 画面は、真っ白にはなりません。エラーが起きたのは、画面を作る途中ではなく、ボタンを押したときの処理の中です。

`EntryItem.tsx` は、props の型を `interface` で書いています（本編第5章の 5.7）。`type` で書いても意味は同じです。

`react/app/src/components/EntryItem.tsx`（4〜9行目）

```tsx
interface EntryItemProps {
  entry: Entry;
  onRemove: (id: string) => void;
}

export function EntryItem({ entry, onRemove }: EntryItemProps) {
```

</details>

## 2.3 配列は `map` で並べ、`key` を付ける

配列を画面に並べるには、`map` で、配列の値 1 つを JSX 1 つに変えます。`{ }` の中に JSX の配列を入れると、React が順に並べて表示します。

DOM 版では、`map` で要素の配列を作り、`replaceChildren` で一覧の中身を入れ替えていました。

`practice/app/src/render.ts`（99〜102行目）

```ts
function renderList(entries: Entry[], elements: Elements): void {
  elements.entryList.replaceChildren(...sortByDate(entries).map(createEntryItem));
  elements.emptyMessage.classList.toggle("hidden", entries.length > 0);
}
```

`react/app/src/components/EntryList.tsx`（10〜21行目）

```tsx
export function EntryList({ entries, onRemove }: EntryListProps) {
  return (
    <>
      <ul className="entries">
        {sortByDate(entries).map((entry) => (
          <EntryItem key={entry.id} entry={entry} onRemove={onRemove} />
        ))}
      </ul>
      {entries.length === 0 && <p className="status">明細はまだありません。</p>}
    </>
  );
}
```

**`map` で並べる要素には、`key` を付けます。** `key` は、React が行を見分けるための印です。

- 明細が追加・削除されたとき、React は `key` を手がかりに、前の一覧と新しい一覧のどの行が同じ明細の行かを調べます。
- `key` には、一覧の中でほかの行と重ならず、変わらない値を渡します。明細では `entry.id` です。
- `key` は、React が使う特別な名前です。`key` は React が受け取り、props には入りません。そのため、props の型（`EntryItemProps`）には `key` を書きません。

## 問題 2：警告を読む

改修用フォルダの `src/components/EntryList.tsx` の 15 行目から、`key={entry.id}` を消したとします。

```tsx
          <EntryItem entry={entry} onRemove={onRemove} />
```

明細が 1 件以上あると、Console に、赤い字で次の警告が出ます。

```text
Each child in a list should have a unique "key" prop.

Check the render method of `EntryList`. See https://react.dev/link/warning-keys for more information.
```

1. 警告は、どのコンポーネントを調べるように言っていますか。
2. 型チェック（`npm run typecheck R02`）は、エラーを出すと思いますか。
3. 一覧は、表示されると思いますか。

予測を書いたら、15 行目から `key={entry.id}` を消して試します。画面で一覧を、開発者ツールの Console で警告を見ます。`npm run typecheck R02` も実行します。

<details>
<summary>答えと解説</summary>

1. **`EntryList`**。2 行目の `Check the render method of` の後ろに、`map` を書いているコンポーネント（並べる側）の名前が出ます。1 行目は、「並べる要素には、それぞれ重ならない `key` が要る」という意味です。
2. **出しません。** `key` は props に入りません（2.3）。`EntryItemProps` が求める `entry` と `onRemove` はそろっています。
3. **表示されます。** 追加や削除も動きます。ただし、`key` がないと、React は行を順番（何番目か）で見分けます。そのため、行の削除や並べ替えのときに、画面の表示がずれる不具合の原因になります（第7章で読みます）。

</details>

## 2.4 条件で表示を変える

条件で表示を変えるには、`{ }` の中に、三項演算子か `&&` を書きます。

- `条件 ? A : B` は、条件が `true` なら A を、`false` なら B を表示します。
- `条件 && A` は、条件が `true` のときだけ A を表示します。
- **`true`・`false`・`null`・`undefined` は、画面に何も表示されません。**
- 数は、`0` も含めて、そのまま表示されます。

`EntryList.tsx` の 18 行目は、明細が 0 件のときだけ `<p>` を表示します。0 件でないときは、式の値が `false` なので、何も表示されません。

DOM 版では、要素を HTML に置いておき、`hidden` のクラスを付け外しして隠していました（2.3 の `render.ts` の 101 行目）。React 版では、表示しない要素は、画面に作りません。

## 問題 3：支出があるときだけ見出しを出す

集計の「分類ごとの支出」の見出しは、支出が 1 件もないときにも表示されます。そこで、支出があるときだけ見出しを出そうとして、改修用フォルダの `src/components/Summary.tsx` の 22 行目を、次のように書き換えました。

```tsx
      {totalsByCategory(entries).length && <h3>分類ごとの支出</h3>}
```

`A && B` の値は、A が `false` として扱われる値（`false`・`0`・`""` など）なら、A そのものです。そうでなければ、B です。

1. 支出が 1 件以上あるとき、この行は何を表示しますか。
2. 支出が 1 件もないとき、この行は何を表示しますか。
3. ねらいどおりに動くようにするには、どう直しますか。

予測を書いたら、`Summary.tsx` の 22 行目を上のコードに書き換えて試します。支出があるときと 1 件もないときで、見出しの所に何が表示されるかを画面で見ます。

- 支出が 1 件もなければ、先に 1 件追加し、「集計」の月を「すべて」にします。
- 「集計」の種別（入力フォームの種別ではありません）を「すべて」にすると支出がある状態、「収入」にすると支出が 1 件もない状態になります。

<details>
<summary>答えと解説</summary>

1. **見出し「分類ごとの支出」**。配列の長さは 1 以上なので、式の値は `<h3>` です。
2. **`0`**。配列の長さは `0` で、`false` として扱われるので、式の値は `0` そのものです。React は数の `0` をそのまま表示します。
3. **左側を、`true` か `false` になる式にします**。`{totalsByCategory(entries).length > 0 && <h3>分類ごとの支出</h3>}` と書けば、支出がないときの式の値は `false` で、何も表示されません。

</details>

## 問題 4：props をたどる

エディタの「参照へ移動」（名前の上で `Shift` + `F12`。実践編 第2章）を使うと、たどりやすくなります。`EntryItem.tsx` の 9 行目の `EntryItem` の上で使うと、`<EntryItem … />` と書いた場所が開きます。そこで `onRemove={…}` の右辺を読み、その名前の出どころを同じようにたどります。

`EntryItem.tsx` の「削除」ボタンは、押されると `onRemove(entry.id)` を呼びます（18 行目）。

「削除」を押すと、どのファイルの何という関数に、何が渡りますか。`EntryList` がすることも含めて、コードをたどって答えてください。

<details>
<summary>答えと解説</summary>

**`App.tsx` の `handleRemove`（75〜77行目）に、明細の ID が渡ります。** `App.tsx` の 105 行目で `EntryList` に渡した `handleRemove` を、`EntryList` は 15 行目でそのまま `EntryItem` に渡しています。`EntryList` 自身は呼びません。

</details>

---

## 改修：大きな支出を目立たせる

10,000 円以上の支出の行に、`large` というクラスを付けます。`large` の付いた行は、背景が薄い灰色になり、金額が太字になります。CSS は、改修用フォルダの `style.css` に用意してあります。実践編 第4章と同じ改修です。

**進め方**

#### 大きな支出かを調べる関数を書く

1. `react/exercises/R02-components/src/format.ts` の、一番下の `isLargeExpense` の `throw` の行を書き換える
   - 10,000 円以上の支出なら `true`、それ以外（10,000 円未満の支出と、収入）なら `false` を返します
   - 支出は、`entry.kind === "expense"` の明細です
   ```sh
   npm test R02
   ```
   - **こうなれば OK**：`isLargeExpense` の 3 行に `✔` が付く（`EntryItem` の 1 行は `✖` のまま。「失敗の内容」にも、同じ名前がもう一度出ます）

#### 画面につなぐ

2. 画面を起動したままにする（止めていたら、次を実行する）
   ```sh
   npm run dev R02
   ```
   - **こうなれば OK**：家計簿の画面が表示される
3. `src/components/EntryItem.tsx` の `<li>` に、条件で `large` のクラスを付ける
   - 画面に 10,000 円以上の支出がなければ、先に 1 件追加しておきます
   - `className` の値は三項演算子で書きます。`isLargeExpense(entry)` が `true` なら `"large"`、それ以外は `undefined` を渡します（`undefined` なら `class` の属性そのものが付きません）
   - ほかのファイルの関数は、先頭の `import` に名前を足すと使えます
   - **こうなれば OK**：10,000 円以上の支出の行は、背景が薄い灰色になり、金額が太字になる
4. 画面で次を 1 つずつ試す
   - [ ] 10,000 円未満の支出と、収入の行は、これまでどおりに表示される
   - [ ] 開発者ツールの Elements で、10,000 円以上の支出の `<li>` に `class="large"` が付いている

#### 仕上げる

5. 画面を `Ctrl` + `C` で止め、型チェックとテストを実行する
   ```sh
   npm run check R02
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
6. 自分の変更を差分で読む
   ```sh
   git diff react/exercises/R02-components
   ```
   - **こうなれば OK**：差分に出るのは `format.ts` と `EntryItem.tsx` の 2 つだけ

**テストで確かめるもの**

| 呼び出し・表示するもの | 返す値・画面の HTML |
| --- | --- |
| `isLargeExpense`（10,000 円の支出） | `true` |
| `isLargeExpense`（9,999 円の支出） | `false` |
| `isLargeExpense`（200,000 円の収入） | `false` |
| 10,000 円の支出の `EntryItem` | `<li class="large">` で始まる |
| 9,999 円の支出と、収入の `EntryItem` | `large` を含まない |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- 条件でクラスを変えている例：`Summary.tsx` の 20 行目
- クラスを付ける場所：`EntryItem.tsx` の 11 行目の `<li>`

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- `isLargeExpense`：`return entry.kind === "expense" && entry.amount >= 10000;`
- `EntryItem.tsx`：`<li>` を `<li className={isLargeExpense(entry) ? "large" : undefined}>` に変え、`import { ..., isLargeExpense } from "../format.ts";` に名前を足します。

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

| 表示 | よくある原因 |
| --- | --- |
| テスト「収入なら金額にかかわらず false を返す」で `true !== false` | 種別を調べていません。支出のときだけ `true` にします |
| テスト「10,000 円以上の支出なら true を返す」で `false !== true` | 10,000 円ちょうどを `false` にしています。`>` ではなく `>=` を使います |
| 型チェックで `Cannot find name 'isLargeExpense'.` | `EntryItem.tsx` で `isLargeExpense` を `import` していません |
| 型チェックで `Type 'boolean' is not assignable to type 'string'.` | `className={isLargeExpense(entry)}` と、結果をそのまま渡しています。三項演算子で、クラスの名前の文字列にします |
| 型チェックの 1 行目に `Type '"large" \| false' is not assignable to type 'string \| undefined'.` | `className={isLargeExpense(entry) && "large"}` と書いています。条件が `false` のとき、`className` に `false` が渡ります。三項演算子で、`"large"` か `undefined` にします |
| `EntryList` のテストで `+ '<li class="">'` と `- '<li>'`（`App` のテストは `undefined !== 4`） | クラスを付けないときに、空の文字列 `""` を渡しています。`undefined` を渡します |
| テスト「10,000 円未満の支出と収入の行に large のクラスを付けない」が `✖`。`EntryList` のテストで `+ '<li class="large">'` | `className="large"` と、条件なしで付けています |
| `isLargeExpense` のテストは合格するが、「10,000 円以上の支出の行に large のクラスを付ける」が `✖` | `<li>` ではなく、中の `<span>` にクラスを付けています。Elements で、`large` がどの要素に付いているかを見ます |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[react/solutions/R02-components/src/format.ts](../solutions/R02-components/src/format.ts)、[react/solutions/R02-components/src/components/EntryItem.tsx](../solutions/R02-components/src/components/EntryItem.tsx)

---

## チェックリスト

- [ ] `<EntryList entries={…} onRemove={…} />` と書いたとき、`EntryList` の関数に何が渡るかを説明できる
- [ ] `key` を付けなくても型エラーにならないのに、付ける必要がある理由を説明できる
- [ ] `{配列.length && <タグ>}` と書くと、`0` が表示されることがある理由を説明できる

## 詳しく学ぶ

- React 公式ドキュメント：[初めてのコンポーネント](https://ja.react.dev/learn/your-first-component)、[コンポーネントに props を渡す](https://ja.react.dev/learn/passing-props-to-a-component)、[条件付きレンダー](https://ja.react.dev/learn/conditional-rendering)、[リストのレンダー](https://ja.react.dev/learn/rendering-lists)、[TypeScript の使用](https://ja.react.dev/learn/typescript)
