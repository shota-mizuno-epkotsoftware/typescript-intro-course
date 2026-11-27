# 実践編 第6章 外から来るデータ

- **この章で学ぶこと**
  - ブラウザに保存したデータを読み込むとき、何を検査しているか
  - サーバーからデータを読み込むとき、どの順で処理が進み、失敗したら何が起きるか
  - 検査せずに使うと、何が起きるか

---

## 6.1 読む範囲と、使う道具

フォームのほかに、外からデータが入る場所が 2 つあります。

| データ | 来る場所 | 読むファイル |
| --- | --- | --- |
| 保存された明細 | ブラウザの localStorage | `practice/app/src/storage.ts`（52 行） |
| 分類の一覧 | サーバーにある `categories.json` | `practice/app/src/categories.ts`（20 行）、`practice/app/src/main.ts` の `loadCategories` |

<!-- app-map: chapter=6 -->

開発者ツールは次の 2 つを使います。

| タブ | 分かること |
| --- | --- |
| Application | localStorage に保存されている中身（第1章）。値をダブルクリックすると、書き換えられる |
| Network | ページが行った通信の一覧。行を選ぶと、返ってきた中身（Response）が見える |

## 6.2 検査せずに使うと

### 問題 1

`JSON.parse` は JSON の文字列をデータにします（本編第2章）。次のコードは、保存された明細を `JSON.parse` で読み込み、結果を検査せずにそのまま返す書き方です（このアプリのコードではありません）。

```ts
type Entry = { kind: "expense"; id: string; date: string; amount: number; category: string };

function loadEntries(text: string): Entry[] {
  return JSON.parse(text);
}

const stored =
  '[{"kind":"expense","id":"a","date":"2026-11-01","amount":"800","category":"食費"},' +
  '{"kind":"expense","id":"b","date":"2026-11-02","amount":"500","category":"食費"}]';

const entries = loadEntries(stored);
const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
console.log(total);
```

保存されたデータの `amount` は、文字列の `"800"` と `"500"` です。

1. このコードは、型エラーになりますか。
2. 実行すると、何が表示されますか。

<details>
<summary>答えと解説</summary>

1. 型エラーになりません。
2. `0800500` と表示されます。

`JSON.parse` の戻り値の型は `any` です。`any` は、どんな型としても扱えるので、`Entry[]` として返しても型エラーになりません（本編第2章）。しかし、型は実行時に消えます。実際に入っているのは文字列なので、`0 + "800"` は `"0800"`、`"0800" + "500"` は `"0800500"` になります。

`total` の型は `number` のはずなのに、実行時には文字列が入っています。型と実行時の値が食い違っています。この先のコードは、型チェックに通ってもどこで壊れるか分かりません。

**確かめ方**：改修用フォルダに `src/try.ts`（第3章）を作って、このコードを貼り付けます。エディタで、赤い波線が出ないことを見ます。`node practice/exercises/P06-external/src/try.ts` で実行します。

</details>

## 6.3 保存された明細を読み込む

### 問題 2

`practice/app/src/storage.ts`（31〜48行目）

```ts
export function parseStoredEntries(text: string | null): Entry[] {
  if (text === null) {
    return [];
  }
  try {
    const data: unknown = JSON.parse(text);
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map(toEntry).filter((entry) => entry !== null);
  } catch {
    return [];
  }
}

export function loadEntries(): Entry[] {
  return parseStoredEntries(localStorage.getItem(STORAGE_KEY));
}
```

使っている書き方は次のとおりです。

| 書き方 | 意味 |
| --- | --- |
| `localStorage.getItem(名前)` | 保存された文字列を返す。保存がなければ `null` を返す |
| `JSON.parse(文字列)` | JSON として読めない文字列を渡すと、エラー（例外）を投げる |
| `Array.isArray(値)` | 値が配列なら `true` を返す |
| `catch {` | エラーの中身を使わないときは、`catch` の後ろの `(e)` を省ける |

1. `parseStoredEntries` に次の 3 つを渡すと、それぞれ、どの行の `return` で何が返りますか。
   - `null`
   - `"{壊れたデータ"`（JSON として読めない文字列）
   - `'{"entries": []}'`（JSON として読めるが、配列ではない）
2. 36 行目で、`const data: unknown` と、型を `unknown` にしています。この型注釈を消すと、`data` の型は何ですか。`unknown` にしておく利点は何ですか。
3. 読み込みの処理が、`loadEntries` と `parseStoredEntries` の 2 つの関数に分かれています。なぜですか（ヒント：テストを実行する Node.js では、`localStorage` を使えません）。

<details>
<summary>答えと解説</summary>

1. どれも、空の配列 `[]` が返ります。

   | 渡す値 | `return` する行 | 理由 |
   | --- | --- | --- |
   | `null` | 33 行目 | 保存がない |
   | `"{壊れたデータ"` | 42 行目 | `JSON.parse` がエラー（例外）を投げ、`catch` に入る |
   | `'{"entries": []}'` | 38 行目 | 配列ではない |

2. `any` です。`unknown` にしておくと、検査するまで使えません。

   `any` のままだと、問題 1 のように、検査せずに `Entry[]` として返しても型エラーになりません。`unknown` にすると、`data.map(...)` と書く前に、配列であることを検査する必要があります（本編第6章）。**外から来た値は、まず `unknown` で受け取り、検査してから、正しい型として扱います。**

3. `localStorage` を使う部分と、文字列を検査する部分を分けるためです。

   `parseStoredEntries` は文字列を受け取るだけなので、Node.js のテストで検査できます。ブラウザが要る部分（`loadEntries`）は、1 行だけの関数にしています。

**確かめ方**：`storage.test.ts` の「保存がない・JSON でない・配列でないときは空の配列を返す」のテストに、同じ 3 つの例があります。`src/try.ts`（第3章）で、`parseStoredEntries("{壊れたデータ")` のように自分で呼ぶこともできます。

</details>

### 問題 3

配列の要素を 1 つずつ検査しているのが `toEntry` です。

`practice/app/src/storage.ts`（6〜29行目）

```ts
function toEntry(value: unknown): Entry | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  // プロパティを名前で読めるように、Record 型の変数にコピーする
  const record: Record<string, unknown> = { ...value };
  const { kind, id, date, amount, source, category, memo } = record;

  if (typeof id !== "string" || typeof date !== "string" || !isValidDate(date)) {
    return null;
  }
  if (typeof amount !== "number" || !isValidAmount(amount)) {
    return null;
  }
  const common = typeof memo === "string" ? { id, date, amount, memo } : { id, date, amount };

  if (kind === "income" && typeof source === "string") {
    return { kind, ...common, source };
  }
  if (kind === "expense" && typeof category === "string") {
    return { kind, ...common, category };
  }
  return null;
}
```

`Record<string, unknown>` は、「キーが文字列で、値は何が入っているか分からない」オブジェクトの型です（本編第5章）。12 行目で取り出した `kind` や `amount` の型は、どれも `unknown` です。

配列の要素が次の値だったとき、`toEntry` は、それぞれどの行で `null` を返しますか。

1. `"明細ではない"`（文字列）
2. `{ kind: "expense", id: "x", date: "2026-11-01", amount: "800", category: "食費" }`
3. `{ kind: "expense", id: "y", date: "11/01", amount: 800, category: "食費" }`
4. `{ kind: "income", id: "z", date: "2026-11-01", amount: 800 }`

<details>
<summary>答えと解説</summary>

1. 8 行目です。オブジェクトではありません。
2. 18 行目です。`amount` が数値ではなく、文字列です。
3. 15 行目です。`date` が `"2026-11-01"` の形ではありません。
4. 28 行目です。収入なのに `source` がありません。22 行目の `if` も、25 行目の `if` も通りません。

`toEntry` は、検査に通った項目だけを使って、新しいオブジェクトを作っています。順に読むと、次のとおりです。

| 行 | 検査すること | 通った後の型 |
| --- | --- | --- |
| 7 | オブジェクトである | `value` が `object` |
| 14 | `id` と `date` が文字列で、日付の形である | `id`、`date` が `string` |
| 17 | `amount` が数値で、1 以上の整数である | `amount` が `number` |
| 22、25 | `kind` と、種別ごとの項目 | `kind` が `"income"`（または `"expense"`）、`source`（または `category`）が `string` |

金額と日付の条件には、フォームの検証と同じ関数（`isValidAmount`、`isValidDate`）を使っています。正しい金額の決まりが、1 か所にまとまります。

**確かめ方**：`storage.test.ts` の「形の正しくない明細だけを捨てる」のテストに同じ例があります。

</details>

### 問題 4

問題 2・3 で読んだ、読み込みの続きです。

1. 保存されたデータに、`{ kind: "expense", id: "x", date: "2026-11-01", amount: 800, category: "食費", secret: "abc" }` のように、余分な項目（`secret`）が入っていたとします。`toEntry` が返す明細に、`secret` は入りますか。
2. 配列の中に、形の正しくない明細が 1 件だけ混ざっていたとします。`parseStoredEntries` は、全部を捨てますか。その 1 件だけを捨てますか。

保存は、同じファイルの `saveEntries` が行います。

`practice/app/src/storage.ts`（50〜52行目）

```ts
export function saveEntries(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
```

- `JSON.stringify(値)` は、値を JSON の文字列にします。
- `localStorage.setItem(名前, 文字列)` は、その名前で文字列を保存します。同じ名前の保存があれば、置き換えます。

3. 2 の状態でアプリを開き、新しい明細を 1 件追加しました。形の正しくなかった 1 件は、localStorage に残っていますか。

<details>
<summary>答えと解説</summary>

1. 入りません。

   `toEntry` は、検査に通った項目だけで新しいオブジェクトを作るので（問題 3）、余分な項目は落ちます。

2. その 1 件だけを捨てます。

   40 行目の `data.map(toEntry)` で、要素ごとに `Entry` か `null` になり、`.filter((entry) => entry !== null)` で `null` が除かれます。このような単純な条件の `filter` では、結果の型からも `null` が除かれ、`Entry[]` になります。

3. 残っていません。

   明細を追加すると、`update` が今の明細の配列で保存を上書きします（`saveEntries`）。読み込めなかった 1 件は、状態に入っていないので、保存からも消えます。

**確かめ方**：次の順で行います。

1. `npm run dev P06` で起動し、分類が「食費」、金額が 777 円、メモが「書き換え用」の支出を 1 件追加する
2. 開発者ツールの Application で、`kakeibo:entries` の値をダブルクリックする。`"memo":"書き換え用"` を含む明細の `"amount":777` を、`"amount":"777"` に書き換える
3. ページを読み込み直す。書き換えた明細だけが表示されなくなります
4. もう 1 件追加してから、保存された値を見る。書き換えた明細は、なくなっています

</details>

## 6.4 分類の一覧を読み込む

分類の一覧は `practice/app/public/categories.json` にあります。開発用のサーバー（Vite）が、このファイルを `./categories.json` という URL で配っています。

### 問題 5

`practice/app/src/categories.ts`（13〜20行目）

```ts
export async function fetchCategories(): Promise<string[]> {
  const response = await fetch("./categories.json");
  if (!response.ok) {
    throw new Error(`分類を読み込めませんでした（${response.status}）`);
  }
  const data: unknown = await response.json();
  return parseCategories(data);
}
```

`fetch(URL)` は、サーバーにデータを取りに行く、ブラウザの機能です。時間がかかるので、Promise を返します（本編第9章）。使っている書き方は次のとおりです。

| 書き方 | 意味 |
| --- | --- |
| `await fetch(URL)` | サーバーからの返事（`Response`）を待つ |
| `response.ok` | 返事が「成功」なら `true`。ファイルが見つからない（404）などのときは `false` |
| `response.status` | 返事の番号。成功は `200` など、見つからないときは `404` |
| `await response.json()` | 返事の中身を、JSON として読み込む。JSON として読めなければ、`JSON.parse` と同じくエラーを投げる（問題 2）。`response.json()` は `Promise<any>` を返すので、`await` で取り出した値の型は `any` |

1. この関数の中に、`await` は 2 つあります。それぞれ、何を待っていますか。
2. サーバーが「見つからない（404）」と返事をしたとき、エラー（例外）が投げられるのは、14 行目と 16 行目のどちらですか。
3. 返事は「成功」で、中身が JSON でなかった（たとえば HTML だった）とき、エラーが投げられるのは、どの行ですか。
4. 18 行目で `const data: unknown` としているのは、なぜですか。

<details>
<summary>答えと解説</summary>

1. 14 行目は、サーバーからの返事が届くのを待っています。18 行目は、返事の中身を読み終わるのを待っています。
2. 16 行目です。14 行目の `fetch` がエラーを投げるのは、通信そのものができなかったとき（ネットワークがつながっていないなど）です。サーバーから「見つからない」という返事が来ても、`fetch` は成功として扱います。`response.ok` が `false` なので、16 行目で自分でエラーを投げています。
3. 18 行目です。`response.json()` が、JSON として読めないというエラーを投げます。16 行目は、返事が「成功」なら通り過ぎます。
4. `await response.json()` で取り出した値の型が `any` だからです。`storage.ts` の `JSON.parse` と同じ理由で、`unknown` で受け取り、`parseCategories` で検査しています。

**確かめ方**：`npm run dev P06` で起動し、開発者ツールの Network のタブを開いてから、ページを読み込み直します。一覧の中の `categories.json` を選ぶと、返事の番号（Status）と、中身（Response）が見えます。Status が `304` なら、前に読み込んだものを使い回した印です。中身は同じです。

![Chrome の開発者ツールの Network のタブ。上の図は通信の一覧で、上の段に通信の速さの選択欄「No throttling」があり（①）、一覧の categories.json の行は Status が 200、Type が fetch（②）。下の図は categories.json の行を選んだ後で、右の Headers・Preview・Response のタブのうち Response を選ぶと（③）、返ってきた中身が見える。中身は改修用フォルダの categories.json で、categories の配列に、食費、交通費、100、日用品、null、空の文字列、娯楽、食費、その他が入っている。](images/P06-network.svg "図6-1 Network のタブで見る場所")

</details>

### 問題 6

`practice/app/src/categories.ts`（1〜11行目）

```ts
export function parseCategories(data: unknown): string[] {
  if (
    typeof data !== "object" ||
    data === null ||
    !("categories" in data) ||
    !Array.isArray(data.categories)
  ) {
    throw new Error("分類のデータの形が正しくありません");
  }
  return data.categories.filter((item) => typeof item === "string");
}
```

`"categories" in data` は、`data` に `categories` というプロパティがあれば `true` になります（本編第6章）。

1. 次の値を渡すと、それぞれ、何が返りますか。または、何が起きますか。
   - `{ categories: ["食費", 100, "交通費", null] }`
   - `{ items: ["食費"] }`
   - `["食費"]`
2. `storage.ts` の `parseStoredEntries` は、形が正しくないとき、空の配列を返していました。`parseCategories` は、エラー（例外）を投げています。この違いは、なぜですか。それぞれのデータが読めず、空の配列のまま先に進んだとき、利用者がアプリで何をできなくなるかを考えて答えてください。

<details>
<summary>答えと解説</summary>

1. 次のとおりです。

   | 渡す値 | 結果 |
   | --- | --- |
   | `{ categories: ["食費", 100, "交通費", null] }` | `["食費", "交通費"]` を返す（文字列だけを残す） |
   | `{ items: ["食費"] }` | エラーを投げる（`categories` がない） |
   | `["食費"]` | エラーを投げる（配列にも `categories` というプロパティはない） |

2. 失敗したときに、アプリをどう動かしたいかが違うからです。

   - 保存された明細が読めないとき：明細が 1 件もない状態で、アプリを使い始められます。そのため、空の配列を返して先に進みます。
   - 分類の一覧が読めないとき：分類が選べないと、支出を追加できません。利用者に知らせる必要があるので、エラーを投げて、呼び出した側（`loadCategories`）に失敗を伝えます。

外から来たデータが正しくないときの対応には、「既定の値で先に進む」「エラーを投げて知らせる」があります。どちらにするかは、そのデータがないと何が困るかで決めます。

**確かめ方**：`practice/app/src/categories.test.ts` に同じ例があります。`assert.throws(関数, 正規表現)` は、関数を呼ぶとエラーが投げられ、そのメッセージが正規表現に合うことを検査します。

</details>

### 問題 7

`practice/app/src/main.ts`（29〜38行目）

```ts
async function loadCategories(): Promise<void> {
  try {
    const items = await fetchCategories();
    update(setCategories(state, { status: "ready", items }));
  } catch (e) {
    console.error(e);
    const message = "分類を読み込めませんでした。ページを読み込み直してください。";
    update(setCategories(state, { status: "error", message }));
  }
}
```

1. `fetchCategories` や `parseCategories` がエラーを投げたとき、そのエラーはどこで受け取られますか。
2. そのとき、画面には何が表示されますか。投げられたエラーのメッセージ（「分類のデータの形が正しくありません」など）は、どこに表示されますか。
3. 画面に出すメッセージを、`e` の中身ではなく、決まった文にしているのはなぜですか。

<details>
<summary>答えと解説</summary>

1. 33 行目の `catch` です。`await` している関数の中で投げられたエラーは、`try`〜`catch` で受け取れます（本編第9章）。投げられたエラーは、`catch` が見つかるまで、呼び出し元へ順に戻ります（`parseCategories` → `fetchCategories` → `loadCategories`）。
2. 画面には、「分類を読み込めませんでした。ページを読み込み直してください。」と、赤い文字で表示されます。投げられたエラーのメッセージは、開発者ツールのコンソールに表示されます（`console.error`）。
3. 利用者が読んで、次に何をすればよいか分かる文にするためです。

   ブラウザが投げるエラーは英語で、`Unexpected token '<', "<!doctype "... is not valid JSON` のような、利用者には意味の分からない文です。そこで、利用者に見せる文は画面に、原因を調べるためのエラーはコンソールに、分けて出しています。

成功しても失敗しても最後は `update(setCategories(...))` です。読み込みの結果も、状態（`state.categories`）に入れて、`render` に表示させています（第2章の問題 7）。

**確かめ方**：改修用フォルダの `src/categories.ts` で、`"./categories.json"` を `"./categorie.json"` に変えて、画面とコンソールを見ます。

この手順では、エラーは 16 行目ではなく、18 行目で投げられます。開発用のサーバーが、見つからないファイルの代わりに `index.html` の中身を「成功」として返すためです。Network のタブで、`categorie.json` の返事の中身が HTML になっていることを見てください。URL を変えたままだと、章末の改修で報告の不具合を再現できません。

</details>

### 問題 8

次の 2 行は、イベントを登録する処理（40〜89 行目）の後にあります。`main.ts` の最後の 2 行です（第1章の問題 6）。

`practice/app/src/main.ts`（91〜92行目）

```ts
render(state, elements);
await loadCategories();
```

読むのに必要なことは次の 3 つです。

- `await` の後ろの行は、待ちが終わるまで実行されません（本編第9章）。
- `function` で書いた関数は、定義より前の行からも呼べます。
- フォームの分類と入金元の欄を切り替えているのは、種別の `change` の処理（63〜68行目）が呼ぶ `update` → `render` です。`render` の中の `renderForm`（`render.ts` 39〜53行目）は、種別の選択欄の値も、状態の `formKind` に合わせ直します。

通信が遅く、分類の読み込みに 10 秒かかったとします。

1. その 10 秒の間に、種別を「収入」に切り替えて、収入を追加できますか。
2. この 2 行を、イベントを登録する処理より前（19 行目のあたり）に移したとします。読み込みを待っている 10 秒の間、種別の `change` の処理は、もう登録されていますか。
3. 2 のとき、その 10 秒の間に種別を「収入」に切り替えると、フォームの分類と入金元の欄はどうなりますか。
4. 3 の後で読み込みが終わると、種別の選択欄の表示はどうなりますか。

<details>
<summary>答えと解説</summary>

1. できます。イベントの登録と最初の `render` が、`await` より前に済んでいるからです（第1章の図1-3）。
2. まだ登録されていません。登録する行は `await loadCategories();` の後ろになるので、読み込みが終わるまで実行されません。
3. 切り替わりません。分類の欄が表示されたままで、入金元の欄は出てきません。種別の選択欄の表示だけが「収入」に変わります。処理が登録されていないので、`update` も `render` も呼ばれません。
4. 「支出」に戻ります。読み込みが終わると `update` → `render` が動き、`renderForm` が選択欄の値を状態の `formKind`（`"expense"` のまま）に合わせ直します。

![時間を横に取った図。上の帯は今のコードで、イベントを登録し、render の後で分類の読み込みを待つ。待っている間に種別を収入に切り替えると、登録済みの処理が動き、フォームが切り替わる。読み込みが終わると update と render が動く。下の帯は 2 行を前に書いた場合で、render の後すぐに読み込みを待ち、終わってから update と render、その後でイベントを登録する。待っている間に種別を切り替えても、処理がまだないので、フォームは変わらない。さらに「追加」を押すと、ページが読み込み直される。読み込みが終わると、render で選択欄が支出に戻る。](images/P06-wait-order.svg "図6-2 登録してから待つか、待ってから登録するか")

2 のとき、読み込みを待っている間に「追加」を押すと、ページが読み込み直されて、入力した内容が消えます。フォームの送信を止める処理（`submit` の処理の中の `event.preventDefault()`。本編第10章）もまだ登録されていません。

時間のかかる処理を待つ前に、画面を使える状態にしておきます。待っている間は、「読み込んでいます…」のように、状況を表示します。

**確かめ方**：1 は、開発者ツールの Network のタブで通信の速さを一番遅い設定にして、ページを読み込み直します（設定の場所は、問題 5 の答えの中の図6-1 の ①）。「分類を読み込んでいます…」が表示されている間に、種別を「収入」に切り替えます。表示は短い間だけなので、うまくいかなければ、何度か試してください。確かめたら、設定を元に戻します。

</details>

## まとめ

外から来るデータを受け取る 3 か所について、次の表を埋めてください。

| | 検査している関数 | 正しくないとき、どうするか |
| --- | --- | --- |
| フォームの入力 | ？ | ？ |
| 保存された明細 | ？ | ？ |
| 分類の一覧 | ？ | ？ |

<details>
<summary>答えの例</summary>

| | 検査している関数 | 正しくないとき、どうするか |
| --- | --- | --- |
| フォームの入力 | `parseEntryForm`（`validate.ts`） | `{ ok: false, errors }` を返し、`main.ts` がメッセージを画面に表示する。入力は残す |
| 保存された明細 | `parseStoredEntries`、`toEntry`（`storage.ts`） | 正しくない明細だけを捨てる。全体が読めなければ、空の配列にする |
| 分類の一覧 | `parseCategories`（`categories.ts`） | `categories` がないか配列でなければ、エラーを投げる。`loadCategories` が受け取り、画面に決まった文を表示する。配列の中の文字列でない要素は除く |

3 つとも、外から来た値を検査してから、正しい型の値にしています。検査が済んだ値（`Entry`、`string[]`）は、アプリの中のどこでも型のとおりに使えます。

</details>

---

## 改修：分類の選択欄に、おかしな選択肢が出る

この章の改修は、次の不具合の報告から始めます。

> 支出を追加しようとしたら、分類の選択欄に「100」や、空白の選択肢が出ています。「食費」も 2 つあります。

改修用フォルダでは、分類の一覧のデータ（`practice/exercises/P06-external/public/categories.json`）に、正しくない値が混ざっています。データの側は直せないものとして、読み込む側のコードを直してください。

**進め方**

#### 原因を探す

1. 画面を起動し、分類の選択欄を開く
   ```sh
   npm run dev P06
   ```
   - **こうなれば OK**：報告のとおり、「100」や空白の選択肢、2 つの「食費」が出ている
2. `categories.json` の、サーバーから返ってきた中身を見る
   - 開発者ツールの Network のタブを開いてから、ページを読み込み直します
   - 一覧の `categories.json` の行を選ぶと、右に出る「Response」のタブに、返ってきた中身が出ます（問題 5 の答えの中の図6-1 の ②・③）
   - **こうなれば OK**：中身に `100`、`null`、`""`、2 つ目の `"食費"` が見える
3. 返ってきたデータが、どの関数を通って選択欄に入るかをたどり、原因の場所を見つける
   - **こうなれば OK**：`100` や `""` を取り除く検査が、どの関数にないかを言える（答えは、解答例のリンクの下の折りたたみ「コラム: 型チェックに通るのに…」）

#### 読み込む側を直す

4. 画面を `Ctrl` + `C` で止め、`practice/exercises/P06-external/src/` の中の、原因のファイルを直す
   - `public/categories.json` は書き換えません
   - 残した分類は、元のデータの順番のままにします
   - `配列.includes(値)` は、配列にその値が入っていれば `true` を返します（第5章の `listMonths` で使われています）
   - 空の配列は、`const 名前: string[] = [];` と型を書いて用意します
   - 重複を除くには、`for...of` で 1 つずつ見て、空の配列にまだ入っていないものだけを足します
   ```sh
   npm test P06
   ```
   - **こうなれば OK**：「テスト: OK」
5. 画面を起動し直し、分類の選択欄を開く
   ```sh
   npm run dev P06
   ```
   - [ ] 選択肢が、「食費」「交通費」「日用品」「娯楽」「その他」の 5 つになる

#### 仕上げる

6. 画面を `Ctrl` + `C` で止め、`src/try.ts` を作っていたら消す
   ```sh
   git status
   ```
   - **こうなれば OK**：表示に `try.ts` が出ない
7. 型チェックとテストを実行する
   ```sh
   npm run check P06
   ```
   - **こうなれば OK**：「型チェック: OK」「テスト: OK」
8. 自分の変更を差分で読む
   ```sh
   git diff practice/exercises/P06-external
   ```
   - **こうなれば OK**：`categories.ts` だけが表示される
9. コミットする
   ```sh
   git add practice/exercises/P06-external
   git commit -m "実践編 第6章 改修: 分類のデータを検査する"
   ```
   - **こうなれば OK**：表示の 1 行目に、付けたメッセージが出る

**テストで確かめるもの**

| 呼び出し | 返す値 |
| --- | --- |
| `parseCategories({ categories: ["食費", "交通費"] })` | `["食費", "交通費"]` |
| `parseCategories({ categories: ["食費", 100, "交通費", null] })` | `["食費", "交通費"]`（文字列でないものを除く） |
| `parseCategories({ categories: [true, "食費", 0, { name: "娯楽" }, ["交通費"]] })` | `["食費"]`（数値や `null` のほかも、文字列でなければ除く） |
| `parseCategories({ categories: ["食費", "", "交通費"] })` | `["食費", "交通費"]`（空の文字列を除く） |
| `parseCategories({ categories: ["食費", "交通費", "食費", "娯楽"] })` | `["食費", "交通費", "娯楽"]`（2 回目の「食費」を除く） |

<details>
<summary>ヒント 1：どこを見ればよいか</summary>

- 選択肢を作るのは `render.ts` の `renderForm` で、`state.categories.items` から作ります。`items` は、`main.ts` の `loadCategories` が `fetchCategories` から受け取ったものです。`fetchCategories` の中で、返事の中身を検査している関数を読みます
- 見つけた関数は、完成版（`practice/app/src/categories.ts`）の同じ関数と見比べてください。ただし、完成版が除いているのは、文字列でないものだけです

</details>

<details>
<summary>ヒント 2：書き出し</summary>

`listMonths` と同じ形で書けます。

```ts
  const categories: string[] = [];
  for (const item of data.categories) {
    if (/* item が文字列で、空でなく、まだ categories に入っていない */) {
      categories.push(item);
    }
  }
  return categories;
```

条件は、`typeof item === "string"`、`item !== ""`、`!categories.includes(item)` の 3 つを `&&` でつなぎます。

</details>

<details>
<summary>テストや画面がうまくいかないとき</summary>

| 表示 | よくある原因 |
| --- | --- |
| テスト「文字列でないものを除く」で、`+ 100` と `+ null` | 文字列かどうかを検査していません（最初の状態もこれです）。`100` や `null` のように決まった値を除くのではなく、`typeof item === "string"` で調べます |
| テスト「空の文字列を除く」で、`+ ''` | 文字列かどうかだけを検査しています。空の文字列も除きます |
| テスト「同じ分類が 2 回出てきたら…」が失敗する | 重複を除いていません |
| 型チェックで `Variable 'categories' implicitly has type 'any[]' ...` | 空の配列に型を書いていません。`const categories: string[] = [];` にします |
| 型チェックで `'data.categories' is of type 'unknown'.` と表示され、分類が残るはずのテストが `+ []` で失敗する | `filter` の中で、元の配列（`data.categories`）に入っているかを調べています。元の配列には必ず入っているので、全部が除かれます。新しい配列を作り、まだ入っていないものだけを足します（`unknown` の型エラーも、この形にすれば消えます） |
| `(item: string) =>` と型注釈を書いたら、型チェックは通るが、テスト「文字列でないものを除く」が失敗する | 型注釈は、実行時には何もしません。`typeof item === "string"` で、実行時に調べます |
| テストは合格するが、画面の選択肢が変わらない | ページを読み込み直していません |

表示の読み方は、[つまずき集](../../troubleshooting.md) にあります。

</details>

解答例：[practice/solutions/P06-external/src/categories.ts](../solutions/P06-external/src/categories.ts)

<details>
<summary>コラム: 型チェックに通るのに、なぜ間違ったデータが通ったのか（手順 3 で理由を考えてから開いてください）</summary>

改修用フォルダの `parseCategories` は、`return data.categories;` と、配列をそのまま返していました。戻り値の型は `string[]` なのに型エラーになりません。`Array.isArray` で検査した後の `data.categories` の型は、`any[]`（中身が何でもよい配列）です。`any` は型チェックをすり抜けます。配列であることは検査しましたが、中身までは検査していませんでした。

</details>

---

## チェックリスト

- [ ] `JSON.parse` や `response.json()` の結果を、`unknown` で受け取る理由を説明できる
- [ ] サーバーが「見つからない」と返事をしたとき、`fetch` がエラーを投げないことと、`response.ok` を調べる必要があることを説明できる
- [ ] 読み込みを待っている間も、画面を操作できる理由を説明できる

## 詳しく学ぶ

- JavaScript Primer：[Ajax通信](https://jsprimer.net/use-case/ajaxapp/)（特に「[HTTP通信](https://jsprimer.net/use-case/ajaxapp/http/)」。`fetch` と `response.ok`）、[JSON](https://jsprimer.net/basic/json/)
- サバイバルTypeScript：[unknown型](https://typescriptbook.jp/reference/statements/unknown)、[any型](https://typescriptbook.jp/reference/values-types-variables/any)
