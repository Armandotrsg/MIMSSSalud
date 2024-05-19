"use client";

import { LoadingDataTable } from "@/components/data-table/LoadingDataTable";
import { patientsColumn as columns } from "./columns";

export default function LoadingUsersPage() {
  return (
    <LoadingDataTable
      columns={columns}
      label="Participantes"
      createButton={null}
      createManyButton={null}
      otherFilters={[]}
    />
  );
}
