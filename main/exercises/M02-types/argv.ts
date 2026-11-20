// 2.6 の例: コマンドライン引数は文字列で届く
//   node main/exercises/M02-types/argv.ts 5

const arg = process.argv[2];
console.log(typeof arg);
console.log(arg + 1);
console.log(Number(arg) + 1);
