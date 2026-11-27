import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import type { CategoriesState, Entry, EntryKind } from "../types.ts";
import { parseEntryForm } from "../validate.ts";

type EntryFormProps = {
  kind: EntryKind;
  categories: CategoriesState;
  errors: string[];
  onKindChange: (kind: EntryKind) => void;
  onAdd: (entry: Entry) => void;
  onErrors: (errors: string[]) => void;
};

function categoryStatusText(categories: CategoriesState): string {
  if (categories.status === "loading") {
    return "分類を読み込んでいます…";
  }
  if (categories.status === "error") {
    return categories.message;
  }
  return "";
}

export function EntryForm({ kind, categories, errors, onKindChange, onAdd, onErrors }: EntryFormProps) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [memo, setMemo] = useState("");
  const [fixed, setFixed] = useState(false);

  const categoryItems = categories.status === "ready" ? categories.items : [];
  // 分類の選択欄の value に渡す値
  const selectedCategory = category === "" ? (categoryItems[0] ?? "") : category;

  function handleKindChange(event: ChangeEvent<HTMLSelectElement>): void {
    const value = event.target.value;
    if (value === "income" || value === "expense") {
      onKindChange(value);
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();

    const result = parseEntryForm(
      { kind, date, amount, category: selectedCategory, source, memo, fixed },
      crypto.randomUUID(),
    );
    if (!result.ok) {
      onErrors(result.errors);
      return;
    }

    setDate("");
    setAmount("");
    setCategory("");
    setSource("");
    setMemo("");
    setFixed(false);
    onAdd(result.entry);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          種別
          <select value={kind} onChange={handleKindChange}>
            <option value="expense">支出</option>
            <option value="income">収入</option>
          </select>
        </label>
        <label>
          日付
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          金額
          <input
            inputMode="numeric"
            autoComplete="off"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        {kind === "expense" ? (
          <label>
            分類
            <select value={selectedCategory} onChange={(event) => setCategory(event.target.value)}>
              {categoryItems.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            入金元
            <input autoComplete="off" value={source} onChange={(event) => setSource(event.target.value)} />
          </label>
        )}
        {kind === "expense" && (
          <label>
            固定費
            <input type="checkbox" checked={fixed} onChange={(event) => setFixed(event.target.checked)} />
          </label>
        )}
        <label>
          メモ
          <input autoComplete="off" value={memo} onChange={(event) => setMemo(event.target.value)} />
        </label>
        <button>追加</button>
      </form>
      <p className={categories.status === "error" ? "status error" : "status"}>
        {categoryStatusText(categories)}
      </p>
      <ul className="errors">
        {errors.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </>
  );
}
