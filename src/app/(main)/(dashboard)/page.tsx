import { DataTableSearchParams } from "@/components/data-table/DataTable";

export default async function Home({ searchParams }: DataTableSearchParams) {
  const { page, pageSize, search, orderBy, orderDirection } = searchParams;

  //Calculate limit
  const limit = typeof pageSize === "string" ? parseInt(pageSize) : 10;
  const pageInt = typeof page === "string" ? parseInt(page) : 1;

  // Validate orderBy
  const validOrderBy = ["nombre", "curp", "nss", "sexo"];
  const ordenarPor = validOrderBy.includes(orderBy) ? orderBy : "nombre";


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      HOLA ESTEBAN
    </main>
  );
}
