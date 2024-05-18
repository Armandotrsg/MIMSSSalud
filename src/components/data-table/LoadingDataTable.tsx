import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useDataTable } from "./useDataTable";
import { type DataRecord, type DataTableProps } from "./DataTable";
import React from "react";
import { DataTableHeader } from "./DataTableHeader";
import { DataTablePagination } from "./DataTablePagination";
import { Skeleton } from "@nextui-org/skeleton";

type LoadingDataTableProps<T extends DataRecord> = Pick<
  DataTableProps<T>,
  "columns" | "label" | "createButton" | "createManyButton" | "otherFilters"
>;

/**
 * LoadingDataTable is a generic component that displays a loading state for the DataTable.
 * It provides a skeleton view of the DataTable while the data is being fetched.
 *
 * @note
 * The LoadingDataTable component is needed to show the loading state of the DataTable component.
 * This component should be located in the `loading.tsx` and "use client" must be set in the same directory as the page where the DataTable component is used.
 *
 * @param {Object} props - The properties that define the LoadingDataTable component.
 * @param {Array} props.columns - The columns to be displayed in the table.
 * @param {string} props.label - The label for the table.
 * @param {ReactNode} props.createButton - The button to create a new record.
 * @param {ReactNode} props.createManyButton - The button to create many new records.
 * @param {Array} props.otherFilters - Other filters to be applied to the table data.
 *
 * @component
 * 
 * To use first follow the docs of DataTable component.
 * 
 * In the directory where the DataTable is used, create a file called `loading.tsx` and import the LoadingDataTable component and pass the necessary props.
 * @note It should be a client component
 * 
 * ```tsx
 "use client";

import { LoadingDataTable } from "~/components/data-table/LoadingDataTable";
import { userColumns as columns } from "./columns";

export default function LoadingUsersPage() {
  return (
    <LoadingDataTable
      columns={columns}
      label="Usuarios"
      createButton={null}
      createManyButton={null}
      otherFilters={[]}
    />
  );
}
```
 *
 * @returns {ReactNode} The LoadingDataTable component.
 * 
 * @since 2024-04-10
 * @author Armando Terrazas
 */
export function LoadingDataTable<
  T extends DataRecord> ({
  columns,
  label,
  createButton,
  createManyButton,
  otherFilters,
}: LoadingDataTableProps<T>) {
  const {
    page,
    pages,
    sortDescriptor,
    searchValue,
    setSortDescriptor,
    onNextPage,
    onPreviousPage,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    setPage,
  } = useDataTable(0, otherFilters);

  const topContent = React.useMemo(
    () => (
      <DataTableHeader
        searchValue={searchValue}
        onClear={onClear}
        onSearchChange={onSearchChange}
        totalRecords={0}
        label={label}
        onRowsPerPageChange={onRowsPerPageChange}
        createManyButton={createManyButton}
        createButton={createButton}
        filterNodes={otherFilters?.map((filter) => filter.filterNode)}
      />
    ),
    [
      searchValue,
      onClear,
      onSearchChange,
      label,
      onRowsPerPageChange,
      createManyButton,
      createButton,
      otherFilters,
    ],
  );

  const bottomContent = React.useMemo(() => {
    return (
      <DataTablePagination
        pages={pages}
        page={page}
        setPage={setPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    );
  }, [pages, page, setPage, onPreviousPage, onNextPage]);

  return (
    <Table
      aria-label={`Tabla de ${label}`}
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[calc(100vh-250px)]",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            align={column.label === "Acciones" ? "end" : "center"}
            allowsSorting={column.allowSorting}
            key={column.key}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent=" " items={[]}>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                <Skeleton className="h-4 w-4/5 rounded-lg" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
