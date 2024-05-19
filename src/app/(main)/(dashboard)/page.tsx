import { type DataTableSearchParams } from "@/components/data-table/DataTable";
import { api } from "@/trpc/server";
import { PatientsTable } from "./table";
import { patientsColumn as columns } from "./columns";

export default async function Home({ searchParams }: DataTableSearchParams) {
  const { page, pageSize, search, orderBy, orderDirection } = searchParams;

  //Calculate limit
  const limit = typeof pageSize === "string" ? parseInt(pageSize) : 10;
  const pageInt = typeof page === "string" ? parseInt(page) : 1;

  // Validate orderBy
  const validOrderBy = [
    "nombre",
    "apellidoPaterno",
    "apellidoMaterno",
    "curp",
    "nss",
  ];
  const ordenarPor = validOrderBy.includes(orderBy) ? orderBy : "nombre";

  const pacientes = await api.paciente.getAll({
    limit,
    page: pageInt,
    searchName: search,
    orderBy: ordenarPor as
      | "nombre"
      | "apellidoPaterno"
      | "apellidoMaterno"
      | "curp"
      | "nss"
      | undefined,
    orderDirection,
  });

  return (
    <main>
      <PatientsTable
        columns={columns}
        data={pacientes.data}
        totalRecords={pacientes.meta.total}
      />
    </main>
  );
}
