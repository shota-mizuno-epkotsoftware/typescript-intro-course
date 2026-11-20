# 第1章 基本文法の対応表

- **この章で学ぶこと**
  - PHP と TypeScript の書き方の対応
  - 違いがある書き方と、それを詳しく扱う章（表の「注意」の列）

---

この章はざっと読み、分からない書き方が出てきたときに見返してください。

## 同じ処理を並べて見る

制御構文や関数の形は、PHP とよく似ています。変数、連想配列、文字列の書き方は違います。

次の 2 つは、どちらも買い物の合計を計算して表示するプログラムです。

```php
<?php
function subtotal(int $price, int $quantity): int {
    return $price * $quantity;
}

$items = [
    ["name" => "ノート", "price" => 120, "quantity" => 3],
    ["name" => "ペン", "price" => 80, "quantity" => 0],
];
$total = 0;
foreach ($items as $item) {
    if ($item["quantity"] === 0) {
        continue;
    }
    $total += subtotal($item["price"], $item["quantity"]);
}
echo "合計: {$total}円\n";
```

```ts
function subtotal(price: number, quantity: number): number {
  return price * quantity;
}

const items = [
  { name: "ノート", price: 120, quantity: 3 },
  { name: "ペン", price: 80, quantity: 0 },
];
let total = 0;
for (const item of items) {
  if (item.quantity === 0) {
    continue;
  }
  total += subtotal(item.price, item.quantity);
}
console.log(`合計: ${total}円`); // → 合計: 360円
```

| 違い | 見る表 |
| --- | --- |
| 型は `price: number` のように名前の後ろに書く | 1.5 |
| 連想配列は `{ name: "ノート" }` のオブジェクトで書き、`item.price` で取り出す | 1.7 |
| `foreach` は `for (const item of items)` | 1.4 |
| 変数は `let` / `const` で宣言する | 1.1 |
| 値の埋め込みはバッククォートの `${}` | 1.2 |

## 1.1 変数と出力

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 値を表示する | `echo $x;` / `var_dump($x);` | `console.log(x);` | |
| コメント | `// 1行` / `/* 複数行 */` | `// 1行` / `/* 複数行 */` | 同じ |
| 変数を作る | `$count = 0;` | `let count = 0;` | `$` は付けない。初めて使うときに `let` か `const` で宣言する |
| 再代入しない変数 | `const TAX_RATE = 0.1;` | `const taxRate = 0.1;` | **基本は `const` を使い**、再代入が必要なときだけ `let`。`const` が何を禁止するかは第4章 |
| 値がない | `null` | `null` / `undefined` | 値がないことを表す値が2種類ある（第2章・第6章） |

## 1.2 文字列と数値

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 文字列をつなぐ | `"合計: " . $total` | `"合計: " + total` | `+` は数値の足し算と同じ記号。数値と文字列を組み合わせたときの動きは第2章 |
| 文字列に値を埋め込む | `"Hello, {$name}"` | `` `Hello, ${name}` `` | バッククォートで囲む（テンプレートリテラル。第2章）。`"` と `'` は埋め込みをしない |
| 文字列の長さ | `mb_strlen($s)` | `s.length` | 全角も半角も 1 文字は 1（`strlen` のようなバイト数ではない） |
| 大文字にする | `strtoupper($s)` | `s.toUpperCase()` | 文字列の操作は `値.メソッド()` の形で書く（メソッドは、値に付いている関数） |
| 含まれるか | `str_contains($s, "a")` | `s.includes("a")` | |
| 分割・連結 | `explode(",", $s)` / `implode(",", $a)` | `s.split(",")` / `a.join(",")` | |
| 数値に変換する | `(int)$s` / `intval($s)` | `Number(s)` | 変換できないと `NaN` になる（第2章）。`(int)` と違い、小数は切り捨てない |
| 型を調べる | `gettype($x)` | `typeof x` | 結果の文字列が違う（第2章） |

## 1.3 比較と条件分岐

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 等しい・等しくない | `===` / `!==` | `===` / `!==` | 同じ。**`==` は使わない**（型を変換するルールが PHP と違うため）。配列やオブジェクトどうしの比較は第4章 4.4 |
| かつ・または・否定 | `&&` / `\|\|` / `!` | `&&` / `\|\|` / `!` | 書き方は同じ。`\|\|` の動きの違いは第6章 6.2 |
| 条件分岐 | `if (...) { } elseif (...) { } else { }` | `if (...) { } else if (...) { } else { }` | `elseif` は `else if` と離して書く |
| 三項演算子 | `$a ? $b : $c` | `a ? b : c` | 書き方は同じ。`"0"` などを条件にしたときの違いは第6章 6.2 |
| null なら別の値 | `$a ?? "なし"` | `a ?? "なし"` | 同じ（第6章） |
| 値で分岐 | `switch ($x) { case 1: ... break; }` | `switch (x) { case 1: ... break; }` | 書き方は同じ。PHP の `switch` は `==` で比べるが、TypeScript は `===` で比べる（型も一致が必要） |

## 1.4 ループ

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 回数を決めて繰り返す | `for ($i = 0; $i < 3; $i++) { }` | `for (let i = 0; i < 3; i++) { }` | |
| 配列の要素を順に | `foreach ($items as $item) { }` | `for (const item of items) { }` | `of` を使う。`for...in` は別物（キーを回る）なので配列には使わない |
| 番号と要素を順に | `foreach ($items as $i => $item) { }` | `items.forEach((item, i) => { });` | 要素が先、番号が後。`=>` の書き方は第3章 |
| 条件の間繰り返す | `while ($n > 0) { }` | `while (n > 0) { }` | 同じ |
| 抜ける・次へ | `break;` / `continue;` | `break;` / `continue;` | 同じ |

## 1.5 関数

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 関数を作る | `function add(int $a, int $b): int { return $a + $b; }` | `function add(a: number, b: number): number { return a + b; }` | 型は名前の後ろに `:` で書く（第2章） |
| 引数の初期値 | `function greet($name = "ゲスト") { }` | `function greet(name = "ゲスト") { }` | 同じ |
| 名前のない関数 | `fn($x) => $x * 2` | `(x) => x * 2` | アロー関数（第3章） |

## 1.6 配列

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 配列を作る | `$a = [1, 2, 3];` | `const a = [1, 2, 3];` | |
| 要素を取り出す | `$a[0]` | `a[0]` | 範囲外は `undefined`（エラーにならない） |
| 要素の数 | `count($a)` | `a.length` | |
| 末尾に追加 | `$a[] = 4;` / `array_push($a, 4);` | `a.push(4);` | `const` が止めるのは再代入だけで、中身の変更は止めない。配列を代入したときの動きとあわせて第4章 |
| 含まれるか | `in_array(2, $a, true)` | `a.includes(2)` | |
| 変換・絞り込み | `array_map(...)` / `array_filter(...)` | `a.map(...)` / `a.filter(...)` | 第7章 |

## 1.7 連想配列とオブジェクト

PHP の連想配列は、TypeScript では主に**オブジェクト**で表します。オブジェクトの `name` や `age` のような、名前の付いた値を**プロパティ**と呼びます。

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 作る | `$user = ["name" => "Alice", "age" => 20];` | `const user = { name: "Alice", age: 20 };` | キーは普通 `"` なしで書く。`user-id` のように `-` を含むキーは、引用符で囲む（`{ "user-id": 1 }`）。オブジェクトの型の書き方は第4章（詳しくは第5章） |
| 値を取り出す | `$user["name"]` | `user.name` / `user["name"]` | 普段は `.` を使う |
| 値を変える | `$user["age"] = 21;` | `user.age = 21;` | オブジェクトを代入したときの動きは第4章 |
| キーがあるか | `array_key_exists("name", $user)` | `"name" in user` | `"toString"` のように元からある名前でも `true` になる。第6章 |
| キーと値を順に | `foreach ($user as $k => $v) { }` | `for (const [k, v] of Object.entries(user)) { }` | `Object.entries` はキーと値の組の配列を返す。`[k, v]` の書き方は第4章 4.2 |
| キーが自由な辞書 | `$count["食費"] = 1000;` | `Map`（第8章）か `Record`（第5章） | |

## 1.8 例外

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 例外を投げる | `throw new Exception("失敗");` | `throw new Error("失敗");` | クラス名が `Error` |
| 受け取る | `try { } catch (Exception $e) { }` | `try { } catch (e) { }` | 受け取る型は書かない。`e` は何が来るか分からない型（第9章） |
| メッセージ | `$e->getMessage()` | `e.message` | 第9章で絞り込んでから使う |

## 1.9 クラス

クラスは読めれば十分です。自分で書く場面はほとんどなく、`new Map()` や `new Error("失敗")` のように用意されたクラスを使うときに出てきます。

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| クラスを作る | `class User { private string $name; ... }` | `class User { private name: string; ... }` | プロパティは `$` なしで、型を後ろに書く |
| コンストラクタ | `public function __construct(string $name) { $this->name = $name; }` | `constructor(name: string) { this.name = name; }` | |
| メソッド | `public function greet(): string { return "Hi " . $this->name; }` | `greet(): string { return "Hi " + this.name; }` | `function` は付けない。`$this->` は `this.` |
| 使う | `$u = new User("Alice"); $u->greet();` | `const u = new User("Alice"); u.greet();` | `->` は `.` |
| 継承する | `class Admin extends User { ... }` | `class Admin extends User { ... }` | 同じ書き方。`Admin` は `User` のプロパティとメソッドをすべて持つ |
| そのクラスのオブジェクトかを確かめる | `$u instanceof User` | `u instanceof User` | 同じ書き方。`Admin` のオブジェクトも `true` になる |

## 1.10 ファイルを分ける

| やりたいこと | PHP | TypeScript | 注意 |
| --- | --- | --- | --- |
| 他のファイルで使えるようにする | （何もしなくてよい） | `export function add(...) { }` | `export` を付けたものだけ外から使える（第8章） |
| 他のファイルのものを使う | `require "math.php";` / `use App\Math;` | `import { add } from "./math.ts";` | 第8章 |

---

## 詳しく学ぶ

表の各行をもっと詳しく知りたいときは、次のページを読んでください。

- JavaScript Primer：[変数と宣言](https://jsprimer.net/basic/variables/)、[文字列](https://jsprimer.net/basic/string/)、[演算子](https://jsprimer.net/basic/operator/)、[条件分岐](https://jsprimer.net/basic/condition/)、[ループと反復処理](https://jsprimer.net/basic/loop/)、[関数と宣言](https://jsprimer.net/basic/function-declaration/)、[配列](https://jsprimer.net/basic/array/)、[オブジェクト](https://jsprimer.net/basic/object/)、[Map/Set](https://jsprimer.net/basic/map-and-set/)、[例外処理](https://jsprimer.net/basic/error-try-catch/)、[クラス](https://jsprimer.net/basic/class/)、[ECMAScriptモジュール](https://jsprimer.net/basic/module/)
- サバイバルTypeScript：[for-of文](https://typescriptbook.jp/reference/statements/for-of)、[アロー関数](https://typescriptbook.jp/reference/functions/arrow-functions)、[オブジェクト](https://typescriptbook.jp/reference/values-types-variables/object)、[例外処理](https://typescriptbook.jp/reference/statements/exception)、[クラス](https://typescriptbook.jp/reference/object-oriented/class)
