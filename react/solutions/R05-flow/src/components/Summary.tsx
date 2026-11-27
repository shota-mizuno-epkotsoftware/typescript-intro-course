import { formatYen } from "../format.ts";
import { balanceOf, totalOf, totalsByCategory, totalsBySource } from "../summary.ts";
import type { Entry } from "../types.ts";

type SummaryProps = {
  entries: Entry[];
};

export function Summary({ entries }: SummaryProps) {
  const balance = balanceOf(entries);
  const sourceTotals = totalsBySource(entries);

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
      {sourceTotals.length > 0 && (
        <>
          <h3>入金元ごとの収入</h3>
          <ul className="plain-list">
            {sourceTotals.map(({ source, total }) => (
              <li key={source}>
                {source}: {formatYen(total)}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
