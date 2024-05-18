import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type SortDescriptor } from "@nextui-org/table";
import useDebounce from "../../hooks/useDebounce";
import { type DateValue, type RangeValue } from "@nextui-org/react";

export type OtherValues =
  | string
  | number
  | boolean
  | null
  | Set<string>
  | RangeValue<DateValue>;

export type OtherFilter<T extends OtherValues> = {
  filterName: string;
  filterNode: React.ReactNode;
  filterState: T;
};

export type OtherFilterTypes =
  | OtherFilter<string>
  | OtherFilter<number>
  | OtherFilter<boolean>
  | OtherFilter<null>
  | OtherFilter<RangeValue<DateValue>>
  | OtherFilter<Set<string>>;

export function useDataTable(
  totalRecords: number,
  otherFilters: OtherFilterTypes[] | undefined,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params
  const currentPage = searchParams?.get("page") ?? "1"; // default is page: 1
  const page_size = searchParams?.get("pageSize") ?? "10"; // default 5 record per page
  const search = searchParams?.get("search") ?? "";
  const orderBy = searchParams?.get("orderBy") ?? "";
  const orderDirection = searchParams?.get("orderDirection") ?? "asc";

  const [searchValue, setSearchValue] = useState(search);
  const debouncedFilterValue = useDebounce(searchValue, 300);

  const [page, setPage] = useState(parseInt(currentPage)); // default is page: 1
  const [rowsPerPage, setRowsPerPage] = useState(parseInt(page_size));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: orderBy,
    direction: orderDirection === "asc" ? "ascending" : "descending",
  });
  // Calculating the number of pages
  const pages = useMemo(() => {
    return Math.ceil(totalRecords / rowsPerPage);
  }, [totalRecords, rowsPerPage]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = useCallback((value = "") => {
    setSearchValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setSearchValue("");
    setPage(1);
  }, []);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null | Set<string>>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else if (value instanceof Set) {
          newSearchParams.set(key, Array.from(value).join(","));
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      otherFilters?.forEach(({ filterState: filterValue, filterName }) => {
        if (filterValue === null) {
          newSearchParams.delete(filterName);
        } else if (filterValue instanceof Set) {
          newSearchParams.set(filterName, Array.from(filterValue).join(","));
        } else if (typeof filterValue === "object") {
          newSearchParams.set(
            `${filterName}Start`,
            `${filterValue.start?.toString() ?? ""}`,
          );
          newSearchParams.set(
            `${filterName}End`,
            `${filterValue.end?.toString() ?? ""}`,
          );
        } else {
          newSearchParams.set(filterName, String(filterValue));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams, otherFilters],
  );

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: page,
        pageSize: rowsPerPage,
        search: debouncedFilterValue ?? null,
        orderBy: sortDescriptor.column ?? null,
        orderDirection:
          sortDescriptor.direction === "ascending" ? "asc" : "desc",
      })}`,
    );
  }, [
    createQueryString,
    debouncedFilterValue,
    page,
    pathname,
    router,
    rowsPerPage,
    sortDescriptor.column,
    sortDescriptor.direction,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...(otherFilters?.map(({ filterState }) => filterState) ?? []), // Add other filters to the dependency array
  ]);

  return {
    page,
    pages,
    setPage,
    sortDescriptor,
    setSearchValue,
    searchValue,
    setSortDescriptor,
    onNextPage,
    onPreviousPage,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
  };
}
