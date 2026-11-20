// 実践編のアプリの地図（site/build.ts の renderAppMaps が置いた .app-map に描く）
// - data-stage：1 ファイルの並び、2 役割、3 つながり。地図は必要な場所にその都度置く（段階の切り替えはしない）
// - data-chapter：その章で読むファイルを青くする（つながりの地図）
(() => {
  const dataEl = document.getElementById("app-map-data");
  if (!dataEl) return;
  const data = JSON.parse(dataEl.textContent);
  const byId = Object.fromEntries(data.files.map((f) => [f.id, f]));
  const G = { pad: 12, colW: 226, nodeW: 184, nodeH: 66, rowH: 102 };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const box = (f) => ({ x: G.pad + f.x * G.colW, y: G.pad + 24 + f.y * G.rowH, w: G.nodeW, h: G.nodeH });
  const icon = (f) =>
    f.kind === "ext"
      ? ""
      : `<span class="app-map-ico ${f.kind}">${f.kind === "ts" ? "TS" : f.kind === "html" ? "&lt;/&gt;" : f.kind === "css" ? "#" : "{ }"}</span>`;
  const neighbors = (id) =>
    new Set([
      id,
      ...data.edges.filter((e) => e.from === id).map((e) => e.to),
      ...data.edges.filter((e) => e.to === id).map((e) => e.from),
      ...(id === "types.ts" ? data.usesTypes : data.usesTypes.includes(id) ? ["types.ts"] : []),
    ]);

  function createMap(root) {
    const chapter = root.dataset.chapter || "";
    // 章の地図は、その章で読む最初のファイルを選んだ状態で始める
    const first = chapter ? data.files.find((f) => f.kind === "ts" && f.ch.includes(Number(chapter))) : null;
    const m = { root, stage: Number(root.dataset.stage) || 1, chapter, selected: first ? first.id : "main.ts", hover: null };
    root.innerHTML = `<div class="app-map-body"><div class="app-map-canvas"></div><div class="app-map-side"></div></div><div class="app-map-legend"></div>`;
    draw(m);
  }

  function draw(m) {
    m.root.querySelector(".app-map-canvas").innerHTML = m.stage === 1 ? treeHtml(m) : boardHtml(m);
    drawSide(m);
    drawLegend(m);
    if (m.stage === 3) drawEdges(m);
    m.root.querySelectorAll("[data-id]").forEach((el) => {
      el.addEventListener("click", () => {
        m.selected = el.dataset.id;
        draw(m);
      });
      if (m.stage === 3) {
        el.addEventListener("mouseenter", () => {
          m.hover = el.dataset.id;
          refresh(m);
        });
        el.addEventListener("mouseleave", () => {
          m.hover = null;
          refresh(m);
        });
      }
    });
  }

  function treeHtml(m) {
    const row = (depth, html, id) =>
      `<div class="app-map-row${id === m.selected ? " sel" : ""}"${id ? ` data-id="${id}"` : ""}>${'<span class="app-map-ind"></span>'.repeat(depth)}${html}</div>`;
    const file = (depth, id, desc = "") => {
      const f = byId[id];
      return row(depth, `${icon(f)}<span>${esc(f.path.split("/").pop())}</span>${desc ? `<span class="app-map-desc">${desc}</span>` : ""}`, id);
    };
    const folder = (depth, name) => row(depth, `<span class="app-map-ico dir">▾</span><span>${name}</span>`);
    const src = data.files.filter((f) => f.path.startsWith("src/")).map((f) => f.id);
    const order = ["main.ts", "types.ts", "state.ts", "validate.ts", "summary.ts", "format.ts", "storage.ts", "categories.ts", "elements.ts", "render.ts"].filter((id) => src.includes(id));
    return `<div class="app-map-tree">
      ${folder(0, "practice/app/")}
      ${file(1, "index.html", "画面の骨組み")}${file(1, "style.css", "見た目")}
      ${folder(1, "public/")}${file(2, "categories.json")}
      ${folder(1, "src/")}${order.map((id) => file(2, id)).join("")}
    </div>`;
  }

  function boardHtml(m) {
    const maxY = Math.max(...data.files.map((f) => f.y));
    const W = G.pad * 2 + 2 * G.colW + G.nodeW;
    const H = G.pad * 2 + 24 + maxY * G.rowH + G.nodeH + 8;
    const bands = data.bands
      .map((b) => {
        const x = G.pad - 8 + b.x[0] * G.colW;
        const y = G.pad + b.y[0] * G.rowH;
        const w = (b.x[1] - b.x[0]) * G.colW + G.nodeW + 16;
        const h = (b.y[1] - b.y[0]) * G.rowH + G.nodeH + 32;
        return `<div class="app-map-band" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><span>${esc(b.label)}</span></div>`;
      })
      .join("");
    return `<div class="app-map-board" style="width:${W}px;height:${H}px">${bands}${data.files.map((f) => nodeHtml(m, f)).join("")}<svg class="app-map-edges" aria-hidden="true"></svg></div>`;
  }

  const inChapter = (m, id) => byId[id].ch.includes(Number(m.chapter));
  function nodeClasses(m, f) {
    const read = m.chapter && inChapter(m, f.id);
    const near = m.hover && m.stage === 3 ? neighbors(m.hover) : null;
    return [
      "app-map-node",
      f.kind === "ext" ? "ext" : "",
      read ? "read" : "",
      f.id === m.selected ? "sel" : "",
      (m.chapter && !read) || (near && !near.has(f.id)) ? "faded" : "",
      m.stage === 3 && m.hover === "types.ts" && data.usesTypes.includes(f.id) ? "typed" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
  function nodeHtml(m, f) {
    const b = box(f);
    const read = m.chapter && inChapter(m, f.id);
    return `<div class="${nodeClasses(m, f)}" data-id="${f.id}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px">
      ${read ? `<span class="app-map-ch">第${m.chapter}章</span>` : ""}
      <div class="app-map-name">${icon(f)}${esc(f.id)}</div>
      <div class="app-map-role">${esc(f.role)}</div></div>`;
  }
  function refresh(m) {
    m.root.querySelectorAll(".app-map-node").forEach((n) => {
      n.className = nodeClasses(m, byId[n.dataset.id]);
    });
    drawEdges(m);
  }

  // 横に並ぶものは右の辺から左の辺へなめらかな曲線、縦に並ぶものは辺から辺へまっすぐ
  function drawEdges(m) {
    const svg = m.root.querySelector(".app-map-edges");
    if (!svg) return;
    const B = Object.fromEntries(data.files.map((f) => [f.id, box(f)]));
    const ports = (list, key) => {
      const other = key === "from" ? "to" : "from";
      const groups = {};
      list.forEach((e) => (groups[e[key]] ??= []).push(e));
      const off = new Map();
      for (const g of Object.values(groups)) {
        g.sort((a, b) => B[a[other]].y - B[b[other]].y);
        g.forEach((e, i) => off.set(e, (i - (g.length - 1) / 2) * Math.min(9, 40 / g.length)));
      }
      return off;
    };
    const horiz = data.edges.filter((e) => byId[e.from].x !== byId[e.to].x);
    const outOff = ports(horiz, "from");
    const inOff = ports(horiz, "to");
    const out = [];
    for (const e of data.edges) {
      const a = B[e.from];
      const b = B[e.to];
      let d;
      let lx;
      let ly;
      let anchor = "middle";
      if (byId[e.from].x === byId[e.to].x) {
        const down = b.y > a.y;
        const x = a.x + a.w / 2;
        const y1 = down ? a.y + a.h : a.y;
        const y2 = down ? b.y - 3 : b.y + b.h + 3;
        d = `M${x},${y1} L${x},${y2}`;
        lx = x + 8;
        ly = (y1 + y2) / 2 + 4;
        anchor = "start";
      } else {
        const x1 = a.x + a.w;
        const y1 = a.y + a.h / 2 + outOff.get(e);
        const x2 = b.x - 3;
        const y2 = b.y + b.h / 2 + inOff.get(e);
        const dx = (x2 - x1) * 0.5;
        d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
        lx = (x1 + x2) / 2;
        ly = Math.min(y1, y2) - 6;
      }
      const hot = m.hover && (e.from === m.hover || e.to === m.hover);
      const faded = (m.hover && !hot) || (m.chapter && !(inChapter(m, e.from) && inChapter(m, e.to)));
      const cls = [e.kind === "type" ? "type" : e.kind === "data" ? "data" : "", hot ? "hot" : "", faded ? "faded" : ""].join(" ").trim();
      const tip = e.kind === "data" ? "data" : hot ? "hot" : "n";
      out.push(`<path class="${cls}" d="${d}" marker-end="url(#app-map-tip-${tip})"/>`);
      if (e.label && !faded) out.push(`<text x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(e.label)}</text>`);
    }
    const marker = (name, cls) =>
      `<marker id="app-map-tip-${name}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path class="${cls}" d="M0,0 L10,5 L0,10 z"/></marker>`;
    svg.innerHTML = `<defs>${marker("n", "tip")}${marker("hot", "tip-hot")}${marker("data", "tip-data")}</defs>${out.join("")}`;
  }

  function drawSide(m) {
    const f = byId[m.selected];
    const side = m.root.querySelector(".app-map-side");
    if (m.stage === 1) {
      side.innerHTML = `<h4>${esc(f.path)}</h4><p class="app-map-muted">名前と置き場所だけを見ます。ファイルを押すと、行数が出ます。</p>${f.lines ? `<dl><dt>行数</dt><dd>${f.lines} 行</dd></dl>` : ""}`;
      return;
    }
    const chips = (arr) => (arr.length ? arr.map((t) => `<span>${esc(t)}</span>`).join("") : `<span class="none">なし</span>`);
    const mark = (e) => (e.kind === "type" ? "（型だけ）" : e.kind === "data" ? `（${e.label}）` : "");
    const imports = data.edges.filter((e) => e.from === f.id).map((e) => e.to + mark(e));
    if (data.usesTypes.includes(f.id)) imports.push("types.ts（型だけ）");
    const usedBy = data.edges.filter((e) => e.to === f.id).map((e) => e.from + mark(e));
    if (f.id === "types.ts") usedBy.push(...data.usesTypes.map((t) => `${t}（型だけ）`));
    side.innerHTML = `<h4>${esc(f.path)}</h4><p>${esc(f.role)}</p><dl>
      ${f.fns ? `<dt>主な関数・型</dt><dd><code>${f.fns.map(esc).join("、")}</code></dd>` : ""}
      ${f.lines ? `<dt>行数</dt><dd>${f.lines} 行</dd>` : ""}
      ${m.stage === 3 ? `<dt>読み込むもの</dt><dd class="chips">${chips(imports)}</dd><dt>読み込まれる所</dt><dd class="chips">${chips(usedBy)}</dd>` : ""}
      <dt>詳しく読む章</dt><dd class="chips">${f.ch.length ? f.ch.map((c) => `<span>第${c}章</span>`).join("") : `<span class="none">（読まない）</span>`}</dd></dl>`;
  }

  function drawLegend(m) {
    const L = m.root.querySelector(".app-map-legend");
    // ファイルの並びには説明が要らない（省いたファイルのことは本文に書いてある）
    L.hidden = m.stage === 1;
    if (m.stage === 1) return;
    const line = (cls) => `<svg width="34" height="10" aria-hidden="true"><path class="${cls}" d="M2,5 L30,5"/></svg>`;
    L.innerHTML =
      m.stage === 2
        ? `<span>背景の区切りは、役割のまとまりです。</span>`
        : `<span>${line("")}import（実行時に読み込む）</span><span>${line("type")}import type（型だけ。実行時には消える）</span><span>${line("data")}ファイルの外とのやり取り</span>
           <span>types.ts は、ほぼ全部のファイルが import type で使います。矢印は描かず、types.ts に触れると、使うファイルが破線の枠になります。</span>`;
  }

  document.querySelectorAll(".app-map").forEach(createMap);
})();
