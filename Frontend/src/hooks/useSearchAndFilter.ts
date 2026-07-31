import { useState, useMemo, useCallback, useEffect } from "react";

interface SearchAndFilterOptions<T> {
  initialData: T[];
  filterFn: (item: T, searchTerm: string, filterValue: string) => boolean;
  initialSortField?: keyof T | "id";
  initialSortOrder?: "asc" | "desc";
}

export function useSearchAndFilter<T extends { id: string | number }>({
  initialData,
  filterFn,
  initialSortField = "id",
  initialSortOrder = "asc"
}: SearchAndFilterOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [sortField, setSortField] = useState<keyof T | "id">(initialSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);

  // Synchronize data state if external initial data changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(initialData);
  }, [initialData]);

  // Update data state if external initial data changes
  const updateData = useCallback((newData: T[]) => {
    setData(newData);
  }, []);

const handleSort = (key: keyof T | "status" | "action") => {
  if (key === "action" || key === "status") return;

  setSortOrder((prevOrder) => {
    if (sortField === key) {
      return prevOrder === "asc" ? "desc" : "asc";
    }
    return "asc";
  });

  setSortField(key);
};
  const filteredData = useMemo(() => {
    return data.filter((item) => filterFn(item, searchTerm, filterValue));
  }, [data, searchTerm, filterValue, filterFn]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === "string") {
        const strA = valA.toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortOrder === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      } else {
        return sortOrder === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });
  }, [filteredData, sortField, sortOrder]);

  return {
    data,
    updateData,
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    sortField,
    sortOrder,
    handleSort,
    sortedData
  };
}
