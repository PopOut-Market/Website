/**
 * PostgREST caps a single response at `db-max-rows` (1000 on this project) and
 * says nothing about it — the response is a normal 200 with a short body. Any
 * admin query that tallies a whole table in memory therefore silently
 * undercounts the moment that table passes 1000 rows, and the undercount looks
 * like a stalled list rather than an error.
 *
 * `fetchAllRows` pages through every row instead. Give the query a stable
 * `.order("id")` so the ranges cannot overlap or skip rows between pages.
 */
const PAGE_SIZE = 1000;

export type QueryError = { message?: string; code?: string } | null;
export type RangeableQuery = {
  range: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: QueryError }>;
};

export async function fetchAllRows(
  makeQuery: () => RangeableQuery,
): Promise<{ data: unknown[]; error: QueryError }> {
  const all: unknown[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await makeQuery().range(from, from + PAGE_SIZE - 1);
    if (error) return { data: all, error };
    const rows = data ?? [];
    for (const r of rows) all.push(r);
    if (rows.length < PAGE_SIZE) break;
  }
  return { data: all, error: null };
}
