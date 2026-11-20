// 第6章 問題 1: || と ??
// ①〜③ でそれぞれ何が表示されるか予測してください。

type Settings = {
  volume?: number;
  nickname?: string;
};

function summarize(settings: Settings): string {
  const volume = settings.volume ?? 50;
  const nickname = settings.nickname || "ゲスト";
  return `${nickname}: 音量 ${volume}`;
}

console.log(summarize({})); // ①
console.log(summarize({ volume: 0, nickname: "" })); // ②
console.log(summarize({ nickname: "0" })); // ③
