// 教材ページの補助機能
// - 予測の書き込み欄（ブラウザに保存）
// - チェックリストの保存
// - コードのコピーボタン
// - 小さい画面での目次の開閉
(() => {
  const pageKey = document.body.dataset.pageKey || "page";

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(`tsl:${pageKey}:${key}`);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`tsl:${pageKey}:${key}`, value);
      } catch {
        // 保存できない環境では何もしない
      }
    },
  };

  // ---------- 予測の書き込み欄 ----------
  // 「問題 N」の見出しの後にある最初の <details> の前に置く
  const predictHeadings = [...document.querySelectorAll("article h2, article h3")].filter((h) =>
    /^問題\s*\d/.test(h.textContent.trim()),
  );

  for (const heading of predictHeadings) {
    const level = Number(heading.tagName[1]);
    let details = null;
    for (let el = heading.nextElementSibling; el; el = el.nextElementSibling) {
      if (/^H[1-6]$/.test(el.tagName) && Number(el.tagName[1]) <= level) break;
      if (el.tagName === "DETAILS") {
        details = el;
        break;
      }
    }
    if (!details) continue;

    const key = `predict:${heading.id}`;
    const box = document.createElement("div");
    box.className = "predict";
    const id = `predict-${heading.id}`;
    box.innerHTML = `
      <label for="${id}">あなたの予測</label>
      <textarea id="${id}" placeholder="答えを開く前に、表示される内容やエラーが出る行を書いてみましょう"></textarea>
      <p class="predict-status" aria-live="polite"></p>`;
    details.before(box);

    const textarea = box.querySelector("textarea");
    const status = box.querySelector(".predict-status");
    textarea.value = storage.get(key) || "";
    const showSaved = () => {
      status.className = "predict-status";
      status.textContent = textarea.value.trim() ? "ブラウザに保存しました" : "";
    };
    showSaved();
    textarea.addEventListener("input", () => {
      storage.set(key, textarea.value);
      showSaved();
    });
    details.addEventListener("toggle", () => {
      if (details.open && !textarea.value.trim()) {
        status.className = "predict-status warn";
        status.textContent = "予測を書いてから答えを読むと、予想とのずれに気づきやすくなります。";
      }
    });
  }

  // ---------- チェックリスト ----------
  document.querySelectorAll("li.task input[type=checkbox]").forEach((box, i) => {
    const key = `check:${i}`;
    const saved = storage.get(key);
    if (saved !== null) box.checked = saved === "1";
    box.addEventListener("change", () => storage.set(key, box.checked ? "1" : "0"));
  });

  // ---------- ページ内の目次 ----------
  // 広い画面では右に常に表示し、それ以外では最初は閉じておく
  const toc = document.querySelector("details.toc");
  if (toc && !window.matchMedia("(min-width: 1400px)").matches) toc.open = false;

  // ---------- コードのコピー ----------
  document.querySelectorAll("pre.shiki").forEach((pre) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "コピー";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector("code").innerText);
        button.textContent = "コピーしました";
      } catch {
        button.textContent = "コピーできません";
      }
      setTimeout(() => (button.textContent = "コピー"), 1500);
    });
    pre.append(button);
  });

  // ---------- 表示モードの切り替え ----------
  // 最初は OS の設定に従う。太陽（ライト）か月（ダーク）を押すと、選んだほうを全ページ共通で保存する
  const themeButtons = [...document.querySelectorAll("[data-theme-choice]")];
  if (themeButtons.length > 0) {
    const osDark = window.matchMedia("(prefers-color-scheme: dark)");
    // 今の表示モード（選んでいなければ OS の設定）
    const current = () => document.documentElement.dataset.theme || (osDark.matches ? "dark" : "light");
    const show = () => {
      for (const button of themeButtons) {
        button.setAttribute("aria-pressed", String(button.dataset.themeChoice === current()));
      }
    };
    for (const button of themeButtons) {
      button.addEventListener("click", () => {
        const choice = button.dataset.themeChoice;
        document.documentElement.dataset.theme = choice;
        try {
          localStorage.setItem("tsl:theme", choice);
        } catch {
          // 保存できない環境では、このページだけ切り替わる
        }
        show();
      });
    }
    // まだ選んでいない間に OS の設定が変わったら、印を合わせる
    osDark.addEventListener("change", show);
    show();
  }

  // ---------- 目次の開閉（小さい画面） ----------
  const menuButton = document.querySelector(".menu-button");
  const sidebar = document.querySelector(".sidebar");
  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    sidebar.addEventListener("click", (event) => {
      if (event.target.closest("a")) sidebar.classList.remove("open");
    });
  }
})();
