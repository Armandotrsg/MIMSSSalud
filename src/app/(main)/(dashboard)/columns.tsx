import { type Columns } from "@/components/data-table/DataTable";

export const patientsColumn: Columns[] = [
  {
    key: "nombre",
    label: "Nombre",
    allowSorting: true,
  },
  {
    key: "apellidoPaterno",
    label: "Apellido paterno",
    allowSorting: true,
  },
  {
    key: "apellidoMaterno",
    label: "Apellido materno",
    allowSorting: true,
  },
  {
    key: "curp",
    label: "CURP",
    allowSorting: true,
  },
  {
    key: "nss",
    label: "NSS",
    allowSorting: true,
  },
  {
    key: "sexo",
    label: "Sexo",
  },
  {
    key: "actions",
    label: "Acciones",
  }
];
