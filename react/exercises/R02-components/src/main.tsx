import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { loadEntries } from "./storage.ts";

const root = document.querySelector("#root");
if (root === null) {
  throw new Error("要素が見つかりません: #root");
}

createRoot(root).render(
  <StrictMode>
    <App initialEntries={loadEntries()} />
  </StrictMode>,
);
