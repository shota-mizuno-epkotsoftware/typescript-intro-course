import { formatYen } from "../format.ts";
import { balanceOf, totalOf, totalsByCategory } from "../summary.ts";
import type { Entry } from "../types.ts";

type SummaryProps = {
  entries: Entry[];
};

export function Summary({ entries }: SummaryProps) {
  const balance = balanceOf(entries);

  return (
    <>
      <dl className="totals">
        <dt>収入</dt>
        <dd>{formatYen(totalOf(entries, "income"))}</dd>
        <dt>支出</dt>
        <dd>{formatYen(totalOf(entries, "expense"))}</dd>
        <dt>収支</dt>
        <dd className={balance < 0 ? "negative" : "positive"}>{formatYen(balance)}</dd>
      </dl>
      <h3>分類ごとの支出</h3>
      <ul className="plain-list">
        {totalsByCategory(entries).map(({ category, total }) => (
          <li key={category}>
            {category}: {formatYen(total)}
          </li>
        ))}
      </ul>
    </>
  );
}
