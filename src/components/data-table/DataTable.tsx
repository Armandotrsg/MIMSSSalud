"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import React from "react";
import {
  useDataTable,
  type OtherFilterTypes,
} from "./useDataTable";
import { DataTableHeader } from "./DataTableHeader";
import { DataTablePagination } from "./DataTablePagination";

/**
 * @brief Type definition for the search params when using the DataTable component
 *
 * @typedef DataTableSearchParams
 * @type {object}
 * @property {object} searchParams search params
 * @property {string} searchParams.page page number
 * @property {"5" | "10" | "15"} searchParams.pageSize number of records per page
 * @property {string | undefined} searchParams.search search value
 * @property {string} searchParams.orderBy column to order by
 * @property {"asc" | "desc"} searchParams.orderDirection order direction
 */
export type DataTableSearchParams = {
  searchParams: {
    page: string;
    pageSize: "5" | "10" | "15";
    search: string | undefined;
    orderBy: string;
    orderDirection: "asc" | "desc";
  };
};

export type DataRecord = Record<string, unknown> & {
  id: string;
};

/**
 * @brief Type definition for the columns when using the DataTable component
 *
 * @typedef Columns
 * @type {object}
 * @property {string} key key of the data record
 * @property {string} label label of the column
 * @property {boolean} [allowSorting] allow sorting the column
 */
export type Columns = {
  key: React.Key;
  label: string;
  allowSorting?: boolean;
};

export type DataProps<T extends DataRecord> = {
  columns: Columns[];
  data: T[];
  totalRecords: number;
};

export type DataTableProps<T extends DataRecord> = DataProps<T> & {
  renderCell: (record: T, key: Columns["key"]) => React.ReactNode;
  label: string;
  createButton?: React.ReactNode;
  createManyButton?: React.ReactNode;
  otherFilters?: OtherFilterTypes[];
};

/**
 * DataTable is a generic component that displays data records in a table format.
 * It provides features like sorting, pagination, and a search input using SSR and search params.
 * 
 * @note
 * The LoadingDataTable component is needed to show the loading state of this component.
 * This component should be located in the `loading.tsx` and "use client" must be set in the same directory as the page where the DataTable component is used.
 * 
 * @param {Object} props - The properties that define the DataTable component.
 * @param {Array} props.columns - The columns to be displayed in the table.
 * @param {Array} props.data - The data to be displayed in the table.
 * @param {number} props.totalRecords - The total number of records.
 * @param {function} props.renderCell - Function to render a cell in the table.
 * @param {string} props.label - The label for the table.
 * @param {ReactNode} props.createButton - The button to create a new record.
 * @param {ReactNode} props.createManyButton - The button to create many new records.
 * @param {Array} props.otherFilters - Other filters to be applied to the table data.
 *
 * @component
 * 
 * First define in a file called `columns.tsx` the columns that will be displayed in the table.
 * The key will be used as one of the parameters in the renderCell function to render the appropiate cell in the right column.
 * The label will be the title of the column.
 * The allowSorting property will allow the column to be sorted.
 * ```tsx
import { type Columns } from "~/components/data-table/DataTable";

export const userColumns: Columns[] = [
  {
    key: "name",
    label: "Nombre",
    allowSorting: true,
  },
  {
    key: "email",
    label: "Email",
    allowSorting: true,
  },
  {
    key: "actions",
    label: "Acciones",
    allowSorting: false,
  },
];

 * ```
 * 
 * In the Server component you must handle all the logic fetching the data and extracting the values from the search params.
 * Import the columns and api from the server.
 * ```tsx
import { api } from "~/trpc/server";
import {
  type DataTableSearchParams,
} from "~/components/data-table/DataTable";
import { userColumns as columns } from "./columns";

export default async function UsersPage({
  searchParams,
}: DataTableSearchParams) {
  const { page, pageSize, search, orderBy, orderDirection } = searchParams;

  //Calculate limit
  const limit = typeof pageSize === "string" ? parseInt(pageSize) : 10;
  const pageInt = typeof page === "string" ? parseInt(page) : 1;

  // Validate orderBy
  const validOrderBy = ["name", "email"];
  const ordenarPor = validOrderBy.includes(orderBy) ? orderBy : "name";

  const users = await api.user.getAll.query({
    page: pageInt,
    limit: limit,
    searchName: search,
    orderBy: ordenarPor as "name" | "email" | undefined,
    orderDirection: orderDirection,
  });

  //Do not add the DataTable component here yet.
  return (
    ...
  );
}
 * ```
 * To use this component you need to pass a function to render the cell of the table. Server components do not allow passing functions 
 * to client components, so before using this component create a client component in a file called `table.jsx`.
 * The component's generic must be the type of the data that will be displayed in the table.
 * 
 * The renderCell function will receive the data record and the key of the column to render the appropiate cell. Use a switch so depending on the key
 * you can render the appropiate cell.
 * 
 * ```tsx
"use client";
import { DataTable, type DataProps } from "~/components/data-table/DataTable";
import { type InferQueryLikeData } from "@trpc/react-query/shared";
import React from "react";
//Other imports from the UI library

type User = InferQueryLikeData<typeof api.user.getAll>["data"][0]; //Used to infer the type of the data
export function UsersTable({ columns, data, totalRecords }: DataProps<User>) { //Pass the type of the data to the DataProps generic
  //Hooks and other logic

  const renderCell = React.useCallback(
    (user: User, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.image ?? undefined }}
              name={user.name}
            >
              {user.email}
            </User>
          );
        case "email":
          return user.email;
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Ver detalles">
                <button
                  type="button"
                  className="text-lg text-default-400 active:opacity-50"
                  aria-label="Ver detalles"
                  onClick={() => {
                    setUserToHandle(user);
                    setReadOnly(true);
                    modalAdd.onOpen();
                  }}
                >
                  <EyeIcon />
                </button>
              </Tooltip>
              <Tooltip content="Editar usuario">
                <button
                  type="button"
                  className="text-lg text-default-400 active:opacity-50"
                  aria-label="Editar usuario"
                  onClick={() => {
                    setUserToHandle(user);
                    setReadOnly(false);
                    modalAdd.onOpen();
                  }}
                >
                  <EditIcon />
                </button>
              </Tooltip>
              <Tooltip color="danger" content="Eliminar usuario">
                <button
                  type="button"
                  className="text-lg text-danger active:opacity-50"
                  aria-label="Eliminar usuario"
                  onClick={() => {
                    setUserToHandle(user);
                    setDeleteWarningMessage(`Eliminar a ${user.name}`);
                    modalConfirm.onOpen();
                  }}
                >
                  <DeleteIcon />
                </button>
              </Tooltip>
            </div>
          );
        default:
          const value = user[columnKey as keyof User];
          return typeof value === "object" && value instanceof Date
            ? value.toLocaleString()
            : value;
      }
    },
    [modalAdd, modalConfirm],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        totalRecords={totalRecords}
        renderCell={renderCell}
        label="usuarios"
        createButton={
          <Button
            color="primary"
            className="w-full sm:w-auto"
            endContent={<PlusIcon />}
          >
            Crear nuevo usuario
          </Button>
        }
      />
      // Add other components like modals
    </>
  );
}
 * ```
 * Finally, in the server component (`page.tsx`), import the client component and use it. 
 * 
 * ```tsx
import { UsersTable } from "./table";
//Other imports
 * 
 export default async function UsersPage({
  searchParams,
}: DataTableSearchParams) {
  // Other code
  return (
    <UsersTable
      columns={columns}
      data={users.data}
      totalRecords={users.meta.total}
    />
  );
  )
}
```
 * To add the loading state refer to the LoadingDataTable component.
 *
 * @returns {ReactNode} The DataTable component.
 * 
 * @since 2024-04-10
 * @author Armando Terrazas
 */
export function DataTable<T extends DataRecord>({
  columns,
  data,
  totalRecords,
  renderCell,
  label,
  createButton,
  createManyButton,
  otherFilters,
}: DataTableProps<T>) {
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
  } = useDataTable(totalRecords, otherFilters);

  /**
   * Top content of the table, it contains the search input and the button to create a new user
   *
   * @since 2023-11-19
   * @author Armando Terrazas
   */
  const topContent = React.useMemo(
    () => (
      <DataTableHeader
        searchValue={searchValue}
        onClear={onClear}
        onSearchChange={onSearchChange}
        totalRecords={totalRecords}
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
      totalRecords,
      label,
      onRowsPerPageChange,
      createManyButton,
      createButton,
      otherFilters,
    ],
  );

  /**
   * Bottom content of the table, it contains the pagination and the toast
   *
   * @since 2023-11-19
   * @author Armando Terrazas
   */
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
            align={column.key === "actions" ? "end" : "center"}
            allowsSorting={column.allowSorting}
            key={column.key}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={`No se encontraron ${label}`} items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
