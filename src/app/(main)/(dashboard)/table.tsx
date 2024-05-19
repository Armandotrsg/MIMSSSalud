"use client";

import { type InferQueryLikeData } from "@trpc/react-query/shared";
import { type api } from "@/trpc/react";
import { type DataProps, DataTable } from "@/components/data-table/DataTable";
import React from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { PlusIcon } from "@/assets/icons/plus_icon";

type Patient = InferQueryLikeData<typeof api.paciente.getAll>["data"][0];
export function PatientsTable({
  columns,
  data,
  totalRecords,
}: DataProps<Patient>) {
  const renderCell = React.useCallback((row: Patient, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return row.nombre;
      case "apellidoPaterno":
        return row.apellidoPaterno;
      case "apellidoMaterno":
        return row.apellidoMaterno;
      case "curp":
        return row.curp;
      case "nss":
        return row.nss;
      case "sexo":
        return row.sexo;
      default:
        return "";
    }
  }, []);

  return (
    <DataTable
      columns={columns}
      data={data}
      totalRecords={totalRecords}
      renderCell={renderCell}
      label="usuarios"
      createButton={
        <Button
          color="primary"
          as={Link}
          className="w-full sm:w-auto"
          href="/crear"
          endContent={<PlusIcon />}
        >
          Crear nuevo paciente
        </Button>
      }
    />
  );
}
