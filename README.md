# TypeScript 入門

PHP でプログラミングの基礎を学んだ人が、自習で TypeScript のコードを**読める**ようになり、フロントエンド（画面の見た目と動き）のコードを扱えるようになるための教材です。

メインは本編です。PHP の基礎があやふやな人は、先に基礎編から始めます。本編の後は、オプションの実践編で、小さなアプリのコードを読みます。

講座で学ぶ技術どうしのつながりは、[学ぶ技術の関係](overview.md) で先に見渡せます。

## 前提

- PHP で変数・条件分岐・ループ・関数・配列を一度は学んだ（今どこまで使えるかは、下の「どこから始めるか」で確かめます）
- JavaScript の経験は問わない
- ターミナルでコマンドを実行できる
- HTML のタグ・属性・class/id が分かる（本編 第10章で使います）
- Git の基本操作（clone・commit・diff など）ができる

## どこから始めるか

本編は、PHP の基礎を自分で使える人に向けて書いてあります。次の 5 問（PHP のコードを読む問題）は、今の自分がどのあたりにいるかをつかむための目安です。試験ではないので、気軽に解いてください。

<details class="entry-check">
<summary>5 問を開く</summary>

紙かメモに答えを書いてから、「答えと目安」を開きます。調べたり、実行したりせずに答えます。

**問題 1**：次のコードを実行すると、下の警告が出ます。警告は何と言っていますか（日本語で）。何行目をどう直せばよいですか。

```php
<?php
$total = 0;
$total = $total + 500;
echo $totl;
```

```
Warning: Undefined variable $totl in /…/check.php on line 4
```

**問題 2**：何が表示されますか。

```php
<?php
function grade($score) {
    if ($score >= 80) {
        return "A";
    } elseif ($score >= 60) {
        return "B";
    }
    return "C";
}
echo grade(80) . grade(59) . grade(60);
```

**問題 3**：何が表示されますか。

```php
<?php
$prices = [120, 3000, 80];
$sum = 0;
foreach ($prices as $price) {
    $sum += $price;
    echo $sum . " ";
}
```

**問題 4**：何が表示されますか。

```php
<?php
$items = [
    ["name" => "ノート", "price" => 120],
    ["name" => "ペン", "price" => 80],
];
echo $items[1]["name"] . ": " . count($items);
```

**問題 5**：何が表示されますか。

```php
<?php
function addShipping($price) {
    $price = $price + 500;
    return $price;
}
$base = 1000;
$result = addShipping($base);
echo $base . " / " . $result;
```

<details>
<summary>答えと目安</summary>

| 問題 | 答え | 外れたときに読む基礎編の章 |
| --- | --- | --- |
| 1 | 「4 行目の `$totl` という変数はない」と言っている。`$total` のつづりを間違えているので、`echo $total;` に直す（警告の意味と、つづりの間違いの両方を言えたら正解） | [第3章 エラーを読む](basics/chapters/B03-errors.md) |
| 2 | `ACB`（80 は `A`、59 は `C`、60 は `B`。`return` を実行すると、そこで関数が終わる） | [第4章 条件分岐](basics/chapters/B04-conditions.md)、[第6章 関数](basics/chapters/B06-functions.md) |
| 3 | `120 3120 3200`（1 回ごとに足した後の合計を表示する） | [第5章 配列と繰り返し](basics/chapters/B05-arrays-loops.md) |
| 4 | `ペン: 2`（番号は 0 から数える。`count` は要素の数） | [第5章 配列と繰り返し](basics/chapters/B05-arrays-loops.md)、[第8章 オブジェクト](basics/chapters/B08-objects.md)（PHP の連想配列にあたるもの） |
| 5 | `1000 / 1500`（呼び出すと `$base` の値がコピーされて `$price` に入る。関数の中で変えたのはコピーなので、外の `$base` は変わらない） | [第6章 関数](basics/chapters/B06-functions.md)、[第7章 関数を組み合わせる](basics/chapters/B07-combining.md) |

迷わずに答えられた問題を数えて、入口の目安にします。

- **4 問以上**：[本編 第0章](main/chapters/M00-setup.md) からが目安です。外れた問題・迷った問題があれば、表の基礎編の章を先に読んでおくと安心です。
- **3 問以下**：[基礎編 第0章](basics/chapters/B00-setup.md) からが目安です。基礎編は、知っている章を飛ばして進めても構いません。

どちらから始めても、途中で入口を変えて構いません。本編で詰まったときに戻る基礎編の章は、[本編 第0章](main/chapters/M00-setup.md) の「詰まったとき」にあります。

</details>

</details>

## はじめ方

教材の用意（`git clone` と `npm install`）は、始める編の第0章で行います。基礎編からなら [基礎編 第0章](basics/chapters/B00-setup.md)、本編からなら [本編 第0章](main/chapters/M00-setup.md) です。同じフォルダで、最後まで進めます。

本文は、HTML 版で読むのがおすすめです。予測を書き込む欄やチェックリストを使えます。教材のフォルダの `html/index.html` をブラウザで開きます（Finder やエクスプローラーでダブルクリック）。

## 講座の構成

| 編 | 位置づけ | 内容 |
| --- | --- | --- |
| 基礎編 | オプション（本編の前） | PHP で一度学んだ基礎を、JavaScript で手を動かして確かめ直す |
| 本編 | メイン | TypeScript の文法と型の考え方。最後にブラウザの画面を動かす |
| 実践編 | オプション（本編の後） | 小さな Web アプリのコードを読み解き、簡単な改修をする |
| React 編（準備中） | オプション（実践編の後） | 実践編のアプリを React で書き直したものを読み、改修する |

講座で説明しないツールは [ツール一覧](tools.md)、困ったときは [つまずき集](troubleshooting.md) にあります。

## 目次

準備中の章は、章の名前だけを載せています。内容は変わることがあります。

### 基礎編

「[どこから始めるか](#どこから始めるか)」で基礎編からと決めた人は、ここから始めます。

| # | 章 |
| --- | --- |
| 0 | [準備](basics/chapters/B00-setup.md) |
| 1 | [値と計算](basics/chapters/B01-values.md) |
| 2 | [変数](basics/chapters/B02-variables.md) |
| 3 | [エラーを読む](basics/chapters/B03-errors.md) |
| 4 | [条件分岐](basics/chapters/B04-conditions.md) |
| 5 | [配列と繰り返し](basics/chapters/B05-arrays-loops.md) |
| 6 | [関数](basics/chapters/B06-functions.md) |
| 7 | [関数を組み合わせる](basics/chapters/B07-combining.md) |
| 8 | [オブジェクト](basics/chapters/B08-objects.md) |
| 9 | [配列のメソッド](basics/chapters/B09-array-methods.md) |
| 10 | [画面を動かす](basics/chapters/B10-dom.md) |
| 11 | [修了課題](basics/chapters/B11-final.md) |

### 本編

| # | 章 |
| --- | --- |
| 0 | [環境構築](main/chapters/M00-setup.md) |
| 1 | [基本文法の対応表](main/chapters/M01-syntax-table.md) |
| 2 | [型の基本](main/chapters/M02-types.md) |
| 3 | [関数とコールバック](main/chapters/M03-functions.md) |
| 4 | [オブジェクトと配列](main/chapters/M04-objects.md) |
| 5 | [データの型を書く](main/chapters/M05-data-types.md) |
| 6 | [null と型の絞り込み](main/chapters/M06-narrowing.md) |
| 7 | [配列メソッド](main/chapters/M07-array-methods.md) |
| 8 | [モジュールと型を読む](main/chapters/M08-modules.md) |
| 9 | [非同期](main/chapters/M09-async.md) |
| 10 | [ブラウザと DOM、イベント](main/chapters/M10-dom.md) |
| 11 | [実践編への準備](main/chapters/M11-next-steps.md) |

### 実践編

本編を終えてから進めるオプションの編です。家計簿の Web アプリのコードを章ごとに読み、改修します。進め方は [実践編 第1章](practice/chapters/P01-overview.md) にあります。

| # | 章 |
| --- | --- |
| 1 | [全体像と、画面が表示されるまで](practice/chapters/P01-overview.md) |
| 2 | [データの型](practice/chapters/P02-types.md) |
| 3 | [フォームの入力と検証](practice/chapters/P03-form.md) |
| 4 | [イベントから再描画まで](practice/chapters/P04-events.md) |
| 5 | [集計とテスト](practice/chapters/P05-summary.md) |
| 6 | [外から来るデータ](practice/chapters/P06-external.md) |
| 7 | [変更を読む・総合](practice/chapters/P07-changes.md) |

### React 編

実践編の家計簿アプリを React で書き直したものを読み、改修します（準備中。オプション）。

| # | 章 | 状態 |
| --- | --- | --- |
| 1 | DOM 版と React 版を並べる | 準備中 |
| 2 | JSX を読む | 準備中 |
| 3 | コンポーネントと props | 準備中 |
| 4 | 状態と再描画 | 準備中 |
| 5 | イベントとフォーム | 準備中 |
| 6 | 部品の間のデータの流れ | 準備中 |
| 7 | 集計と表示 | 準備中 |
| 8 | 副作用 | 準備中 |
| 9 | 変更を読む | 準備中 |
| 10 | 総合：初見の React 画面 | 準備中 |

## 参考資料

各章の最後の「詳しく学ぶ」から、[JavaScript Primer](https://jsprimer.net/) と [サバイバルTypeScript](https://typescriptbook.jp/) を案内しています。資料のどこをこの講座で扱っているかは、[参考資料との対応](references.md) にまとめてあります。
