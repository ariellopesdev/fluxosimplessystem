import { useMemo, useState } from "react";

export const useFilteredSearch = (
  items = [],
  searchFields = [],
  initialFilters = {},
  filterHandlers = {},
) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  const getNestedValue = (item, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], item);
  };

  const filteredItems = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !searchText ||
        searchFields.some((field) => {
          const value =
            typeof field === "function" ? field(item) : getNestedValue(item, field);

          return String(value || "").toLowerCase().includes(searchText);
        });

      const matchesFilters = Object.entries(filters).every(([filterName, filterValue]) => {
        if (!filterValue) return true;

        const handler = filterHandlers[filterName];

        if (typeof handler === "function") {
          return handler(item, filterValue);
        }

        const value = getNestedValue(item, filterName);

        return String(value || "") === String(filterValue);
      });

      return matchesSearch && matchesFilters;
    });
  }, [items, search, searchFields, filters, filterHandlers]);

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setSearch("");
    setFilters(initialFilters);
  };

  return {
    search,
    setSearch,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    filteredItems,
    hasFilters:
      search.trim().length > 0 ||
      Object.values(filters).some((value) => Boolean(value)),
  };
};