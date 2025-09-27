import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type CandidateItem = {
  rollNo: string;
  points: number;
  name?: string | null;
  branch?: string | null;
  imageUrl?: string | null;
  application?: any;
};

const PAGE_SIZES = [6, 12, 24];

export default function Leaderboards() {
  const [items, setItems] = useState<CandidateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      const path = "/api/scores/all-with-details";
      const base = (import.meta as any).env?.VITE_BACKEND_URL ?? "";

      async function tryFetch(url: string) {
        const r = await fetch(url);
        const contentType = r.headers.get("content-type") || "";
        if (!r.ok) {
          const txt = await r.text().catch(() => "");
          throw new Error(
            `Request to ${url} failed: ${r.status} ${r.statusText}\n${txt.slice(
              0,
              1000
            )}`
          );
        }
        if (contentType.includes("text/html")) {
          const txt = await r.text().catch(() => "");
          throw new Error(
            `Server returned HTML at ${url}. Is the backend URL configured? Response snippet:\n${txt.slice(
              0,
              1000
            )}`
          );
        }
        return r.json();
      }

      try {
        let json;
        try {
          json = await tryFetch(path);
        } catch (err1) {
          if (base && base.trim()) {
            try {
              json = await tryFetch(base.replace(/\/$/, "") + path);
            } catch (err2) {
              throw err2;
            }
          } else {
            throw err1;
          }
        }

        if (!cancelled) {
          setItems(Array.isArray(json) ? json : []);
          setPage(1);
        }
      } catch (err: any) {
        console.error(err);
        if (!cancelled) setError(err.message || "Failed to load leaderboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Leaderboards</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Page size</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="flex flex-col gap-4">
            {pageItems.map((c: CandidateItem, index) => (
              <div
                key={c.rollNo}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4"
              >
                <div className="text-lg font-bold text-gray-500 w-8 text-center">
                  #{start + index + 1}
                </div>

                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.imageUrl}
                    alt={c.name || c.rollNo}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}

                <div className="flex-1">
                  <div className="font-semibold text-lg">{c.name || "—"}</div>
                  <div className="text-sm text-gray-500">{c.branch || "—"}</div>
                  <div className="text-sm text-gray-600">
                    Roll: {c.rollNo}
                  </div>
                </div>

                <div className="font-bold text-blue-600 text-lg">
                  {c.points ?? 0} pts
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                className="mr-2"
                disabled={page === 1}
              >
                Prev
              </Button>
              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages} — Total {total}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
