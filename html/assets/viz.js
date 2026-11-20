// 図に付ける、動かせる部品
// build.ts が図の中に埋め込んだ <script class="viz-data"> を読む。静止画の図はそのまま残し、ボタンを押したときだけ開く。
// - 1行ずつ見る（ステッパー）：「コードの今の行」と「状態の欄」を、前へ・次へで切り替えて見せる
// - type: "expenses-demo"：第10章の「状態を変えて、画面を作り直す」を、小さな家計簿で動かして見せる
(() => {
  for (const script of document.querySelectorAll("figure script.viz-data")) {
    let data;
    try {
      data = JSON.parse(script.textContent);
    } catch {
      continue;
    }
    const figure = script.closest("figure");
    if (data.type === "expenses-demo") setupExpensesDemo(figure, data);
    else setup(figure, data);
  }

  // 開閉ボタンと、その下に開く枠を作る
  function addToggle(figure, label, onOpen) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "viz-toggle";
    toggle.textContent = label;
    toggle.setAttribute("aria-expanded", "false");
    const panel = document.createElement("div");
    panel.className = "viz";
    panel.hidden = true;
    panel.tabIndex = -1;
    figure.append(toggle, panel);
    toggle.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded", String(!panel.hidden));
      toggle.textContent = panel.hidden ? label : "閉じる";
      if (!panel.hidden) onOpen();
    });
    return panel;
  }

  // ---------- 第10章：状態を変えて、画面を作り直す ----------
  // 演習 10-1 の解答例と同じルールで、入力の確かめ・状態の更新・render を行い、
  // 「状態」「画面」「直前に起きたこと」を並べて見せる。
  function setupExpensesDemo(figure, data) {
    const panel = addToggle(figure, data.label || "動かして見る", () => panel.querySelector("input")?.focus());
    panel.innerHTML = `
      <form class="viz-demo-form">
        <label>名前 <input name="name" autocomplete="off" value="昼食"></label>
        <label>金額 <input name="amount" inputmode="numeric" autocomplete="off" value="800"></label>
        <button type="submit">追加</button>
        <button type="button" data-reset>最初に戻す</button>
      </form>
      <div class="viz-side">
        <section class="viz-panel">
          <h4 class="viz-panel-title">状態（expenses）</h4>
          <ul data-state></ul>
        </section>
        <section class="viz-panel">
          <h4 class="viz-panel-title">画面（render が作ったもの）</h4>
          <ul data-screen></ul>
          <p class="viz-demo-total" data-total></p>
          <p class="viz-demo-error" data-error></p>
        </section>
      </div>
      <section class="viz-panel">
        <h4 class="viz-panel-title">直前に起きたこと</h4>
        <ol class="viz-demo-log" data-log></ol>
      </section>`;

    const form = panel.querySelector("form");
    const stateList = panel.querySelector("[data-state]");
    const screenList = panel.querySelector("[data-screen]");
    const totalText = panel.querySelector("[data-total]");
    const errorText = panel.querySelector("[data-error]");
    const log = panel.querySelector("[data-log]");
    let expenses = [];

    const formatYen = (amount) => `${amount.toLocaleString("ja-JP")}円`;
    const show = (value) => JSON.stringify(value);

    function parseExpense(name, amountText) {
      const trimmed = name.trim();
      if (trimmed === "") return "名前を入力してください";
      const amount = Number(amountText);
      if (!Number.isInteger(amount) || amount < 1) return "金額は 1 以上の整数で入力してください";
      return { name: trimmed, amount };
    }

    function li(text, className) {
      const item = document.createElement("li");
      item.textContent = text;
      if (className) item.className = className;
      return item;
    }

    // 状態の欄（新しく足した項目に印を付ける）
    function showState(newIndex) {
      stateList.replaceChildren(
        ...(expenses.length === 0
          ? [li("[]（空の配列）", "is-empty")]
          : expenses.map((e, i) => li(`{ name: "${e.name}", amount: ${e.amount} }`, i === newIndex ? "is-new" : ""))),
      );
    }

    // 演習の render と同じく、状態から画面を全部作り直す
    function render() {
      screenList.replaceChildren(...expenses.map((e) => li(`${e.name}: ${formatYen(e.amount)}`)));
      if (expenses.length === 0) screenList.replaceChildren(li("（まだありません）", "is-empty"));
      totalText.textContent = `合計 ${formatYen(expenses.reduce((sum, e) => sum + e.amount, 0))}`;
    }

    function setLog(lines) {
      log.replaceChildren(...lines.map(([text, done]) => li(text, done ? "" : "is-skipped")));
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = form.elements.namedItem("name").value;
      const amountText = form.elements.namedItem("amount").value;
      const result = parseExpense(name, amountText);
      const call = `parseExpense(${show(name)}, ${show(amountText)})`;
      if (typeof result === "string") {
        setLog([
          [`入力を確かめる：${call} → 「${result}」`, true],
          ["メッセージを画面に出して終わる", true],
          ["2. 状態は変えない（入力が正しくないため）", false],
          ["3. render() も呼ばない。一覧と合計はそのまま", false],
        ]);
        errorText.textContent = result;
        showState(-1);
        return;
      }
      const before = expenses.length;
      expenses = [...expenses, result];
      setLog([
        [`入力を確かめる：${call} → 正しい入力`, true],
        [`2. 状態を新しくする：expenses = [...expenses, 新しい支出]（${before} 件 → ${expenses.length} 件）`, true],
        [`3. render()：一覧を ${expenses.length} 行すべて作り直し、合計も表示し直す`, true],
      ]);
      errorText.textContent = "";
      showState(expenses.length - 1);
      render();
    });

    panel.querySelector("[data-reset]").addEventListener("click", () => {
      expenses = [];
      errorText.textContent = "";
      setLog([["最初の状態に戻しました。名前と金額を入れて「追加」を押してください。", true]]);
      showState(-1);
      render();
    });

    setLog([["名前と金額を入れて「追加」を押してください。名前を空にしたり、金額に文字を入れたりもしてみてください。", true]]);
    showState(-1);
    render();
  }

  function setup(figure, data) {
    const panel = addToggle(figure, data.label || "1行ずつ見る", () => {
      reserveHeights();
      panel.focus({ preventScroll: true });
    });
    panel.innerHTML = `
      <div class="viz-controls">
        <button type="button" data-go="first">最初へ</button>
        <button type="button" data-go="prev">前へ</button>
        <span class="viz-count"></span>
        <button type="button" data-go="next">次へ</button>
        <span class="viz-phase"></span>
      </div>
      <p class="viz-note" aria-live="polite"></p>
      <div class="viz-body">
        <div class="viz-code">${data.codeHtml}</div>
        <div class="viz-side">
          ${data.panels
            .map(
              (p) => `<section class="viz-panel" data-panel="${p.id}">
                <h4 class="viz-panel-title">${p.label}</h4>
                <ul></ul>
              </section>`,
            )
            .join("")}
        </div>
      </div>`;

    const lines = [...panel.querySelectorAll(".viz-code .line")];
    const phase = panel.querySelector(".viz-phase");
    const note = panel.querySelector(".viz-note");
    const side = panel.querySelector(".viz-side");
    const count = panel.querySelector(".viz-count");
    const prevButton = panel.querySelector('[data-go="prev"]');
    const nextButton = panel.querySelector('[data-go="next"]');
    let index = 0;

    function render() {
      const step = data.steps[index];
      const before = data.steps[index - 1];

      // コードの今の行（lines は [行] か [最初の行, 最後の行]。1 から数える）
      const [start, end = start] = step.lines;
      lines.forEach((line, i) => line.classList.toggle("is-current", i + 1 >= start && i + 1 <= end));
      keepInView(lines[start - 1]);

      phase.textContent = step.phase || "";
      note.textContent = step.note || "";
      count.textContent = `${index + 1} / ${data.steps.length}`;
      prevButton.disabled = index === 0;
      nextButton.disabled = index === data.steps.length - 1;

      // 状態の欄。前の段階になかった項目に印を付ける
      for (const p of data.panels) {
        const list = panel.querySelector(`[data-panel="${p.id}"] ul`);
        const items = step[p.id] || [];
        const previous = before ? before[p.id] || [] : [];
        list.replaceChildren(
          ...(items.length === 0 ? [emptyItem()] : items.map((text) => item(text, before && !previous.includes(text)))),
        );
      }
    }

    // コードの枠の中だけをスクロールして、今の行を見える位置に保つ（ページ全体は動かさない）
    function keepInView(line) {
      const box = panel.querySelector(".viz-code pre");
      if (!line || !box || box.scrollHeight <= box.clientHeight) return;
      const top = line.offsetTop;
      if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - line.offsetHeight) {
        box.scrollTop = Math.max(0, top - box.clientHeight / 3);
      }
    }

    function item(text, isNew) {
      const li = document.createElement("li");
      li.textContent = text;
      if (isNew) li.className = "is-new";
      return li;
    }

    function emptyItem() {
      const li = document.createElement("li");
      li.className = "is-empty";
      li.textContent = "（なし）";
      return li;
    }

    // 段階によって説明や欄の長さが変わっても、レイアウトが動かないように、
    // 全段階を一度描いて一番高いものに合わせる
    function reserveHeights() {
      const current = index;
      note.style.minHeight = "";
      side.style.minHeight = "";
      let noteMax = 0;
      let sideMax = 0;
      for (index = 0; index < data.steps.length; index++) {
        render();
        noteMax = Math.max(noteMax, Math.ceil(note.getBoundingClientRect().height));
        sideMax = Math.max(sideMax, Math.ceil(side.getBoundingClientRect().height));
      }
      index = current;
      note.style.minHeight = `${noteMax}px`;
      side.style.minHeight = `${sideMax}px`;
      render();
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      if (panel.hidden) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(reserveHeights, 150);
    });

    function go(where) {
      if (where === "first") index = 0;
      if (where === "prev") index = Math.max(0, index - 1);
      if (where === "next") index = Math.min(data.steps.length - 1, index + 1);
      render();
    }

    panel.querySelector(".viz-controls").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-go]");
      if (button) go(button.dataset.go);
    });

    panel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") go("next");
      if (event.key === "ArrowLeft") go("prev");
    });

  }
})();
