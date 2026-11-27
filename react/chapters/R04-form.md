# React 編 第4章 イベントとフォーム

- **この章で学ぶこと**
  - ボタンや入力欄のイベントに、何を渡すか
  - 入力欄に打った文字を、React 版では誰が持っているか
  - イベントの型の読み方と、「追加」を押してから明細ができるまで

---

## 4.1 読む範囲

完成版の `react/app/src/components/EntryItem.tsx` の「削除」ボタン、`EntryForm.tsx` の全体（DOM 版の `index.html` のフォームと `main.ts` の `submit`）、`validate.ts` の `parseEntryForm` を読みます。

## 4.2 イベントには、関数を渡す

JSX では、`onClick` や `onSubmit` に、**呼んだ結果ではなく関数そのもの**を渡します。React は、イベントが起きたときにその関数を呼びます。

DOM 版では、「削除」ボタンに `data-id` を付け、一覧の全体に `click` の処理を 1 つ登録していました（実践編 第4章の問題 1）。

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

React 版では、ボタン 1 つずつに関数を渡します。

`react/app/src/components/EntryItem.tsx`（18〜20行目）

```tsx
      <button className="remove" onClick={() => onRemove(entry.id)}>
        削除
      </button>
```

- JSX の `{ }` の中の式は、コンポーネントの関数が呼ばれたとき（表示するとき）に計算されます。
- 引数を渡したいときは、アロー関数で包みます。`() => onRemove(entry.id)` は、「クリックされたら `onRemove(entry.id)` を呼ぶ関数」です。
- アロー関数は、その行の `entry` を覚えています（本編第3章）。どの明細のボタンかを `data-id` で伝える必要がありません。
- React が渡すイベントをそのまま受け取る関数は、アロー関数で包まずに、関数の名前だけを書きます（`EntryForm.tsx` の 65 行目の `onSubmit={handleSubmit}`）。送信のとき、React がイベントを引数にして `handleSubmit` を呼びます。

## 問題 1：型エラーを読む

この問題では画面を使いません。画面を起動していたら、先に `Ctrl` + `C` で止めてから書き換えます（画面は止めずに進める第1章の決まりと違う理由は、2 の答えにあります）。型チェックの表示だけを読みます。

改修用フォルダの `src/components/EntryItem.tsx` の 18 行目を、アロー関数で包まない形に書き換えます。

```tsx
      <button className="remove" onClick={onRemove(entry.id)}>
```

型チェックを実行すると、次のエラーが出ます。

```sh
npm run typecheck R04
```

```text
react/exercises/R04-form/src/components/EntryItem.tsx(18,34): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'.
```

- `onRemove` の型は `(id: string) => void` です（同じファイルの 6 行目）。
- `MouseEventHandler<HTMLButtonElement>` は、ボタンのクリックを処理する関数の型です（クリックのイベント `MouseEvent<HTMLButtonElement>` を受け取る関数）。

1. エラーの `'void'` は、どの式の型ですか。
2. このまま画面を表示すると、`onRemove(entry.id)` はいつ呼ばれますか。

<details>
<summary>答えと解説</summary>

1. **`onRemove(entry.id)`**。`onRemove` を呼んだ結果です。`onRemove` は何も返さないので、型は `void` です。`onClick` に渡せるのは関数（か `undefined`）なので、型が合いません。
2. **`EntryItem` が呼ばれたとき**。`{ }` の中の式は、JSX を作るときに計算されます。ボタンを押す前に、表示しただけで、全部の明細の `onRemove` が呼ばれます。画面を開くと、明細が全部消え、保存からも消えます。そのため、この問題では画面を止めました。

</details>

## 問題 2：`onChange` を消した入力欄

HTML の `<input value="…">` を思い出して、説明の前に予測します。金額の欄は、次のように書いてあります。`amount` は、`EntryForm` の state です。

`react/app/src/components/EntryForm.tsx`（27行目）

```tsx
  const [amount, setAmount] = useState("");
```

`react/app/src/components/EntryForm.tsx`（77〜85行目）

```tsx
        <label>
          金額
          <input
            inputMode="numeric"
            autoComplete="off"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
```

問題 1 で書き換えた `EntryItem.tsx` の 18 行目を元の `onClick={() => onRemove(entry.id)}` に戻し、改修用フォルダの `EntryForm.tsx` から 83 行目（`onChange` の行）を消します。

1. 画面で、金額の欄に `500` と打つと、欄には何が表示されますか。
2. 日付を入れ、金額の欄に `500` と打ってから「追加」を押すと、明細は追加されますか。

予測を書いたら、`npm run dev R04` で画面を起動し、Console を開いてから金額の欄で試します。

<details>
<summary>答えと解説</summary>

1. **何も表示されません。** 打っても、欄は空のままです。
2. **追加されません。** 「金額は 1 以上の整数で入力してください」と表示されます。`amount` が `""` のままなので、`parseEntryForm` には空の文字列が渡ります。

`value={amount}` は、最初の値ではありません。「この欄には、いつも `amount` の値を表示してください」という注文です。`value` を書いた入力欄では、React は打つたびに欄の文字を `value` と比べ、違えば `value` に戻します。第1章の 1.5 の働き（前の JSX との違いだけを画面に反映する）とは別の働きです。`amount` は `""` のまま変わらないので、打った文字は消えて `""` に戻ります。

Console には、赤い字で次の表示が出ています。`without an onChange handler` は「`onChange` がない」、`read-only field` は「書き換えられない欄」という意味です。`defaultValue` は、最初の値だけを決める書き方です（この講座では使いません）。

```text
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

> **HTML では**
> `<input value="500">` の `value` は、最初に表示する値です。その後は、打った文字を入力欄が自分で持ちます。DOM 版は、この値を「追加」のときに `elements.amount.value` で読んでいました。

答えを読んだら、消した 83 行目（`onChange={(event) => setAmount(event.target.value)}`）を元に戻し、金額の欄に文字を打てることを見ておきます。

</details>

## 4.3 入力欄の値は、state が持つ

表示する値を state で決める入力欄を、**制御された入力欄**と呼びます。`value` にその state を渡し、`onChange` で入力に合わせて state を更新します。この 2 つは、必ず組で書きます。

1. 文字を打つと、`onChange` に渡した関数が呼ばれます。打った後の値は、`event.target.value` で読めます。
2. その値で、state を更新します（`setAmount`）。
3. `EntryForm` がもう一度呼ばれ（第3章）、新しい `amount` が `value` に入り、欄に表示されます。

| 入力欄 | 表示を決める属性 | `onChange` で読む値 | state の型（最初の値） |
| --- | --- | --- | --- |
| 文字の入力欄 | `value` | `event.target.value` | `string`（`useState("")`） |
| チェックボックス | `checked` | `event.target.checked`（`true` か `false`。`value` はチェックの有無で変わらないので使わない） | `boolean`（`useState(false)`） |

入力途中の値は、`EntryForm` の state です（`EntryForm.tsx` の 26〜30 行目。第3章の 3.6）。`App` の state（`AppState`）には入れていません。

## 4.4 イベントの型

イベントの処理に名前を付けて関数にするときは、引数のイベントに型を書きます。

`react/app/src/components/EntryForm.tsx`（36〜41行目）

```tsx
  function handleKindChange(event: ChangeEvent<HTMLSelectElement>): void {
    const value = event.target.value;
    if (value === "income" || value === "expense") {
      onKindChange(value);
    }
  }
```

- `ChangeEvent<HTMLSelectElement>` は、「選択欄の `onChange` のイベント」の型です。`< >` の中は、`onChange` を書いた要素の型です（本編第8章の 8.3）。
- `ChangeEvent` では、`event.target` もその要素の型になるので、`event.target.value` を、`instanceof` で調べずに読めます。
- 送信のイベントは `SubmitEvent<HTMLFormElement>` です（43 行目）。イベントの型は、`react` から `import type` で読み込みます（2 行目）。
- JSX の中に直接書いたアロー関数（`onChange={(event) => setAmount(event.target.value)}`）は、渡す先から `event` の型が決まるので、型を書きません。

## 問題 3：金額を数で持つ

金額は数なので、state も数で持とうとして、改修用フォルダの `EntryForm.tsx` の 27 行目を次のように書き換えました。

```tsx
  const [amount, setAmount] = useState(0);
```

型チェックを実行すると、エラーが 3 つ出ます。

```sh
npm run typecheck R04
```

```text
react/exercises/R04-form/src/components/EntryForm.tsx(47,21): error TS2322: Type 'number' is not assignable to type 'string'.
react/exercises/R04-form/src/components/EntryForm.tsx(56,15): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<number>'.
react/exercises/R04-form/src/components/EntryForm.tsx(83,44): error TS2345: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<number>'.
```

- `SetStateAction<number>` は、「`number` の state を更新する関数に渡せるもの」の型です。
- `Number("")` は `0` です（本編第10章の 10.9）。

1. 83 行目のエラーで、`'string'` と言われているのは、どの式ですか。
2. エラーを消すために次の 3 か所を直した状態で、画面の金額の欄に `500` と打ってから全部消すと、欄には何が表示されますか。
   - 83 行目：`setAmount(Number(event.target.value))`
   - 56 行目：`setAmount(0)`
   - 47 行目：`amount,` を `amount: String(amount),` に
3. 型エラーを出さずに、金額の欄を空にもできるようにするには、どう直しますか。

<details>
<summary>答えと解説</summary>

1. **`event.target.value`**。入力欄の値は、数を打っても文字列です。`number` の state には入れられません。
2. **`0`**。全部消したときの `event.target.value` は `""` で、`Number("")` は `0` です。state が `0` になり、欄に `0` と表示されます。欄を空にできません。
3. **2 の書き換えも含めて、全部を元に戻します**（`git restore`）。27 行目は `useState("")` です。入力途中の値は、打ったとおりの文字列で持ちます。

文字列を数に変えて正しい金額かを調べるのは、「追加」を押したときの `parseEntryForm` の役目です（実践編 第3章）。

</details>

## 4.5 「追加」を押してから、明細ができるまで

送信の処理は、`<form>` の `onSubmit` に渡します（`EntryForm.tsx` の 65 行目）。フォームの中のボタンを押すと、`submit` のイベントが起きます。これは DOM 版と同じです。

`react/app/src/components/EntryForm.tsx`（43〜61行目）

```tsx
  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();

    const result = parseEntryForm(
      { kind, date, amount, category: selectedCategory, source, memo },
      crypto.randomUUID(),
    );
    if (!result.ok) {
      onErrors(result.errors);
      return;
    }

    setDate("");
    setAmount("");
    setCategory("");
    setSource("");
    setMemo("");
    onAdd(result.entry);
  }
```

- `kind`・`onErrors`・`onAdd` は、`App` から props で受け取ったものです。種別と入力エラーは `App` の state にあり、`EntryForm` は、関数を呼んで `App` に知らせます（第5章で読みます）。

## 問題 4：DOM 版の送信と並べる

`practice/app/src/main.ts`（40〜61行目）

```ts
elements.form.addEventListener("submit", (event) => {
  event.preventDefault();

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
  if (!result.ok) {
    update(setFormErrors(state, result.errors));
    return;
  }

  elements.form.reset();
  update(addEntry(state, result.entry));
});
```

4.5 の `handleSubmit` と見比べて、DOM 版の次の行が、React 版ではどうなっているかを答えてください。

1. `date: elements.date.value,`（46 行目）
2. `elements.form.reset();`（59 行目）
3. `update(addEntry(state, result.entry));`（60 行目）
4. 改修用フォルダの `src/components/EntryForm.tsx` の `setDate("");`（55 行目）のすぐ下に `console.log(date);` を書き、日付に `2026-11-05`、金額に `500` を入れて「追加」を押すと、Console に何が出ますか。種別は「支出」で、分類が表示されています。日付を空に戻した直後の `date` の値を考える問いです。

<details>
<summary>答えと解説</summary>

1. **state の `date` を、そのまま渡しています**（47 行目）。打つたびに state に入れてあるので、入力欄から読む必要がありません。
2. **5 つの state を、空の文字列に更新しています**（55〜59 行目）。入力欄は state の値を表示しているので、文字の欄は空になります。分類の欄は、先頭の分類の表示に戻ります（理由は第5章で読みます）。フォームの種別は変わりません。
3. **`onAdd(result.entry)` を呼んでいます**（60 行目）。`onAdd` の正体は、`App` の `handleAdd` です（第2章の問題 4 と同じたどり方）。`handleAdd` が、`addEntry` で新しい state を作ります。
4. **`2026-11-05`**。`setDate("")` を呼んでも、その回の `date` は変わりません（第3章の 3.3）。欄が空になるのは、`EntryForm` がもう一度呼ばれたときです。

</details>

---

## 改修：フォームに「固定費」のチェック欄を足す

支出の明細に、固定費（家賃や定期券など、毎月決まって出ていくお金）かどうかを入力できるようにします。チェックを入れて追加した支出は、一覧に「交通費（固定費）」のように表示されます。

改修用フォルダでは、型・検証・保存・表示の側（`types.ts`・`validate.ts`・`storage.ts`・`format.ts`）に、固定費の項目 `fixed` を足してあります。実践編 第2章の改修を終えた状態です。足りないのは、フォームのチェック欄です。今は、`EntryForm.tsx` の 47 行目で、いつも `fixed: false` を渡しています。

**進め方**

#### チェック欄を表示する

1. 画面を起動したままにする（止めていたら、次を実行する）
   ```sh
   npm run dev R04
   ```
   - **こうなれば OK**：家計簿の画面が表示される
2. `react/exercises/R04-form/src/components/EntryForm.tsx` に、固定費の state と、チェック欄を足す
   - state は、`useState` の並びの最後に足します。最初の値は `false` です
   - チェック欄は `<input type="checkbox" checked={state} onChange={…} />` の形にし、`onChange` で `event.target.checked` を読みます（4.3）
   - チェック欄は `<label>` で囲み、`<label>` の中の最初に「固定費」と書きます。ほかの欄と同じ形です
   - 置く場所は、メモの `<label>` のすぐ上です。分類と入金元を出し分けている三項演算子の、外側に足します
   - 支出のときだけ表示します。`条件 && (…)` の形を使います（第2章の 2.4）
   ```sh
   npm test R04
   ```
   - **こうなれば OK**：「テスト: OK」
3. 画面で、チェック欄を押す
   - チェックを入れたまま、フォームの種別を「収入」にし、「支出」に戻します
   - **こうなれば OK**：押すたびにチェックが付いたり外れたりし、収入にすると欄が消え、支出に戻した後もチェックが付いている

#### 明細に反映する

4. `handleSubmit` で、`parseEntryForm` に渡している `fixed: false` を、state の値に変える
   - 同じ分類で、チェックを入れた支出と、チェックを外した支出を 1 件ずつ追加します
   - 追加の後にチェックを外す処理は、まだありません（手順 5 で書きます）。2 件目の前に、自分でチェックを外します
   - **こうなれば OK**：「（固定費）」が付くのは、チェックを入れた支出だけ
5. 追加の後、チェックを外した状態に戻す
   - ほかの欄を空に戻している所に、1 行足します
   - **こうなれば OK**：チェックを入れて追加すると、追加の後、チェックが外れている
6. この章の画面を読み込み直す
   - [ ] 手順 4 で付いた「（固定費）」の表示が残っている

#### 仕上げる

7. 画面を `Ctrl` + `C` で止め、型チェックとテストを実行する
   ```sh
   npm run check R04
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
8. 自分の変更を差分で読む
   ```sh
   git diff react/exercises/R04-form
   ```
   - **こうなれば OK**：`EntryForm.tsx` の 1 つのファイルだけが表示され、変わった行が、固定費の state・チェック欄・送信のときに渡す値・送信の後に外す行だけ

**テストで確かめるもの**

| 表示するもの | 画面の HTML |
| --- | --- |
| 種別が支出の `EntryForm` | 分類の欄とメモの欄の間に、固定費の欄の `<label>固定費<input type="checkbox"/>` と `</label>` の 2 行がある |
| 種別が収入の `EntryForm` | 「固定費」を含まない |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- state の並び：`EntryForm.tsx` の 26〜30 行目
- 入力欄の形：メモの欄（103〜106行目）
- 支出のときだけ表示する形：`EntryList.tsx` の 18 行目の `条件 && <タグ>`
- 欄を空に戻している所：`handleSubmit` の 55〜59 行目

</details>

<details>
<summary>ヒント 2：書き出し</summary>

- state：`const [fixed, setFixed] = useState(false);`
- チェック欄：`<input type="checkbox" checked={fixed} onChange={(event) => setFixed(event.target.checked)} />`

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

| 表示 | よくある原因 |
| --- | --- |
| チェック欄を押しても、チェックが付かない。Console に ``You provided a `checked` prop to a form field without an `onChange` handler.`` | `checked` だけを書いて、`onChange` を書いていません |
| チェックが付くが、もう一度押しても外れない（テストは合格する）。型チェックで `Argument of type 'string' is not assignable to parameter of type 'SetStateAction<boolean>'.` | `event.target.value` を渡しています。チェックボックスは `event.target.checked` を使います |
| テストで、ファイルの名前の行（`EntryForm.test.ts` など）が `✖` になり、`'test failed'` とだけ出る。型チェックで `JSX expressions must have one parent element.` | 三項演算子の `( )` の中に、`<label>` を 2 つ並べています。`( )` の中に書けるのは、1 つの要素です。チェック欄は、三項演算子の外側（メモの `<label>` の上）に足します |
| テストで、`+` の行に `<input type="checkbox" value="false"/>` が出る。型チェックで `Type 'boolean' is not assignable to type 'string \| number \| readonly string[] \| undefined'.` | `value={fixed}` と書いています。チェックボックスは `checked={fixed}` です |
| テスト「収入のとき、固定費のチェック欄を表示しない」が `✖` | 条件を付けずに、チェック欄を足しています。支出のときだけ表示します |
| テスト「分類の欄とメモの欄の間に、固定費のチェック欄を表示する」で、`+` の行と `-` の行に、同じ内容の行（メモの欄など）が出る | チェック欄を置く場所が違い、欄の並ぶ順番がずれています。分類・入金元の欄の後、メモの欄の前に置きます |
| テストは合格するが、チェックを入れて追加しても「（固定費）」が付かない | `handleSubmit` の `fixed: false` を、state の値に変えていません |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[react/solutions/R04-form/src/components/EntryForm.tsx](../solutions/R04-form/src/components/EntryForm.tsx)

---

## チェックリスト

- [ ] `value` だけを書いて `onChange` を書かないと、文字が打てなくなる理由を説明できる
- [ ] 金額の欄の state を、数ではなく文字列で持っている理由を説明できる
- [ ] `<input type="checkbox">` で、`value` と `event.target.value` を使わない理由を説明できる

## 詳しく学ぶ

- React 公式ドキュメント：[イベントへの応答](https://ja.react.dev/learn/responding-to-events)、[state を使って入力に反応する](https://ja.react.dev/learn/reacting-to-input-with-state)、[`<input>`](https://ja.react.dev/reference/react-dom/components/input)
