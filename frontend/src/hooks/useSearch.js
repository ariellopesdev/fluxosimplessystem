import { useMemo, useState } from "react";

export const useSearch = (items = [], searchFields = []) => {
  const [search, setSearch] = useState("");

  const getNestedValue = (item, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], item);
  };

  const filteredItems = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return items;
    }

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value =
          typeof field === "function" ? field(item) : getNestedValue(item, field);

        return String(value || "").toLowerCase().includes(searchText);
      });
    });
  }, [items, search, searchFields]);

  const clearSearch = () => {
    setSearch("");
  };

  return {
    search,
    setSearch,
    filteredItems,
    clearSearch,
    hasSearch: search.trim().length > 0,
  };
};