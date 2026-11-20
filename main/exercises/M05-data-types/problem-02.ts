// 第5章 問題 2: 座席の予約
// (1) エディタで見たとき、型エラー（赤い波線）が出る行はあるか予測してください。
// (2) node で実行すると、①〜③ で何が表示されるか予測してください。

type Seat = {
  readonly code: string;
  guest?: string;
};

function reserve(seat: Seat, guest: string): void {
  seat.guest = guest;
}

const seat: Seat = { code: "A1" };
const moved: Seat = { ...seat, code: "B2" };
reserve(seat, "田中");

console.log(seat.code); // ①
console.log(seat.guest); // ②
console.log(moved.guest); // ③
