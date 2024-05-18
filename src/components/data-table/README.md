# DataTable Component

DataTable is a generic component that displays data records in a table format.
It provides features like sorting, pagination, and a search input using SSR and search params.

The LoadingDataTable component is needed to show the loading state of this component.
This component should be located in the `loading.tsx` and "use client" must be set in the same directory as the page where the DataTable component is used.

## Index

- [DataTable](#datatable)
  - [Params](#params)
  - [How to use it? (Without otherFilters)](#how-to-use-it-without-otherfilters)
- [Add other filters](#add-other-filters)
    - [How to use it with other filters?](#how-to-use-it-with-other-filters)
- [LoadingDataTable](#loadingdatatable)
  - [How to use the LoadingDataTable?](#how-to-use-the-loadingdatatable)

## Params

- @param {Object} props - The properties that define the DataTable component.
- @param {Array} props.columns - The columns to be displayed in the table.
- @param {Array} props.data - The data to be displayed in the table.
- @param {number} props.totalRecords - The total number of records.
- @param {function} props.renderCell - Function to render a cell in the table.
- @param {string} props.label - The label for the table.
- @param {ReactNode} props.createButton - The button to create a new record.
- @param {ReactNode} props.createManyButton - The button to create many new records.
- @param {Array} props.otherFilters - Other filters to be applied to the table data.

## How to use it? (Without otherFilters)

First define in a file called `columns.tsx` the columns that will be displayed in the table.
The key will be used as one of the parameters in the renderCell function to render the appropiate cell in the right column.
The label will be the title of the column.
The allowSorting property will allow the column to be sorted.

```tsx
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
```

In the Server component (in the `page.tsx`) you must handle all the logic fetching the data and extracting the values from the search params.
Import the columns and api from the server.

```tsx
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
```

To use this component you need to pass a function to render the cell of the table. Server components do not allow passing functions to client components, so before using this component create a client component in a file called `table.jsx`.

The component's generic must be the type of the data that will be displayed in the table.

The renderCell function will receive the data record and the key of the column to render the appropiate cell. Use a switch so depending on the key you can render the appropiate cell.

> The key of the column must be the same as the key in the columns file.

```tsx
"use client";
import { DataTable, type DataProps } from "~/components/data-table/DataTable";
import { type InferQueryLikeData } from "@trpc/react-query/shared";
import React from "react";
//Other imports from the UI library

type User = InferQueryLikeData<typeof api.user.getAll>["data"][0]; //Used to infer the type of the data
export function UsersTable({ columns, data, totalRecords }: DataProps<User>) {
  //Pass the type of the data to the DataProps generic
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
                  className="text-default-400 text-lg active:opacity-50"
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
                  className="text-default-400 text-lg active:opacity-50"
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
                  className="text-danger text-lg active:opacity-50"
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
```

Finally, in the server component (`page.tsx`), import the client component and use it.

```tsx
import { UsersTable } from "./table";
//Other imports

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
}
```

## Add other filters

Other filters can be added to the table by passing an array of objects with the following type:

```tsx
type OtherValues =
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
```

The filterName is the name of the filter that will be used in the search params.
The filterNode is the component that will be rendered in the table.
The filterState is the state of the filter which can be a string, number, boolean, null, Set<string> or RangeValue<DateValue>.

In the server component, you must handle the logic of the filter and pass it to the DataTable component. This other filters will be passed as search params as well as the other search params with the filterName as the variable's name.

In the case of a set of strings, the filterName will be the name of the filter and the value will be a string with the values separated by commas.

In the case of a range of dates, the filterName will be the name of the filter + "Start" or "End" and the value will be a string with the date in the format "YYYY-MM-DD". For example when the filterName is "createdAt" there will be 2 search params named "createdAtStart" and "createdAtEnd".

### How to use it with other filters?

Assuming you have followed the previous steps, you can add other filters to the table that will be shown in the table header, when clicking the filters modal.

To allow the stateless filters to remain when refreshing the page or navigating to another page, you must pass the filters as search params in the server component and pass them as props to the client component.

In the `table.tsx` file:

```tsx
type Participant = InferQueryLikeData<typeof api.participant.getAll>["data"][0];
type ParticipantProps = DataProps<Participant> & {
  //Add the type of the data
  dates: {
    start: string;
    end: string;
  };
  becas: {
    all: InferQueryLikeData<typeof api.beca.getAll>;
    selected?: Set<string>;
  };
};
export function ParticipantsTable({
  columns,
  data,
  totalRecords,
  dates,
  becas,
}: ParticipantProps) {
  //Other code
}
```

And this should be added as the initial state of the other components. The previous code setting the state already handles this.

```tsx
//Other code
const [date, setDate] = useState<RangeValue<DateValue>>({
  start: dates.start
    ? parseDate(dates.start)
    : today("America/Mexico_City").subtract({ weeks: 1 }),
  end: dates.end
    ? parseDate(dates.end)
    : today("America/Mexico_City").add({ weeks: 1 }),
});

const [selectedBecas, setSelectedBecas] = useState(
  becas.selected ?? new Set<string>([...becas.all.map((beca) => beca.id)]),
);
```

Then you need to build the objects that will be passed to the DataTable component.

```tsx
const BecasFilter = useCallback(
  () => (
    <CheckboxGroup
      label="Becas"
      color="secondary"
      value={Array.from(selectedBecas)}
      onValueChange={(value) => {
        if (value.length === 0) {
          return;
        }
        setSelectedBecas(new Set(value));
      }}
      orientation="horizontal"
    >
      {becas.all.map((beca) => (
        <Checkbox key={beca.id} value={beca.id}>
          {beca.nombre}
        </Checkbox>
      ))}
    </CheckboxGroup>
  ),
  [becas, selectedBecas],
);

const DateFilter = useCallback(
  () => (
    <div className="flex w-full md:w-fit">
      <I18nProvider locale="es-GB">
        <DateRangePicker
          value={date}
          onChange={setDate}
          label="Fecha de postulación"
          description="dd/mm/yyyy"
          labelPlacement="outside"
        />
      </I18nProvider>
    </div>
  ),
  [date, setDate],
);

const dateFilter: OtherFilter<RangeValue<DateValue>> = {
  filterName: "postulacionDate",
  filterNode: <DateFilter />,
  filterState: date,
};

const becasFilter: OtherFilter<Set<string>> = {
  filterName: "becasFilter",
  filterNode: <BecasFilter />,
  filterState: selectedBecas,
};

//Other code

return (
  <DataTable
    columns={columns}
    data={data}
    totalRecords={totalRecords}
    renderCell={renderCell}
    label="participantes"
    otherFilters={[dateFilter, becasFilter]}
  />
);
```

In the server component, you must handle the logic of the filters and pass them to the client component exported in the `table.tsx` file.

In the `page.tsx` server component:

```tsx
type SearchParams = {
  //Expand the search params to include the new filters
  searchParams: DataTableSearchParams["searchParams"] & {
    postulacionDateStart: string; // Since one of the filters is a range of dates, you must include the start and end dates
    postulacionDateEnd: string;
    becasFilter: string;
  };
};

export default async function UsersPage({ searchParams }: SearchParams) {
  const {
    page,
    pageSize,
    search,
    orderBy,
    orderDirection,
    postulacionDateStart,
    postulacionDateEnd,
    becasFilter,
  } = searchParams;

  // This other filters must be passed to the query to filter the data

  // Now pass this filters to the client component
  return (
    <ParticipantsTable
      columns={columns}
      data={participants.data}
      totalRecords={participants.meta.total}
      dates={{ start: postulacionDateStart, end: postulacionDateEnd }}
      becas={{
        all: becas,
        selected: becasFilter ? new Set(becasFilter.split(",")) : undefined,
      }}
    />
  );
}
```

## LoadingDataTable

The LoadingDataTable component is used to show the loading state of the DataTable component.
It provides a skeleton view of the DataTable while the data is being fetched.

The LoadingDataTable component is needed to show the loading state of the DataTable component.
This component should be located in the `loading.tsx` and "use client" must be set in the same directory as the page where the DataTable component is used.

- @param {Object} props - The properties that define the LoadingDataTable component.
- @param {Array} props.columns - The columns to be displayed in the table.
- @param {string} props.label - The label for the table.
- @param {ReactNode} props.createButton - The button to create a new record.
- @param {ReactNode} props.createManyButton - The button to create many new records.
- @param {Array} props.otherFilters - Other filters to be applied to the table data.

### How to use the LoadingDataTable?

To use first follow the docs of DataTable component.

In the directory where the DataTable is used, create a file called `loading.tsx` and import the LoadingDataTable component and pass the necessary props.
@note It should be a client component

```tsx
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
