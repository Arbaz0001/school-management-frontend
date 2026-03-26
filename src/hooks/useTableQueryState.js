import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useTableQueryState(options = {}) {
  const {
    searchKey = "q",
    pageKey = "page",
    debounceMs = 400,
    defaultPage = 1,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get(searchKey) || "";
  const initialPageRaw = Number(searchParams.get(pageKey) || defaultPage);
  const initialPage = Number.isFinite(initialPageRaw) && initialPageRaw > 0
    ? initialPageRaw
    : defaultPage;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (search) next.set(searchKey, search);
    if (page > 1) next.set(pageKey, String(page));
    setSearchParams(next, { replace: true });
  }, [search, page, searchKey, pageKey, setSearchParams]);

  return {
    search,
    setSearch,
    debouncedSearch,
    page,
    setPage,
  };
}
