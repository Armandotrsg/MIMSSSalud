"use client";

import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { DateInput } from "@nextui-org/date-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { today, type DateValue } from "@internationalized/date";

const formSchema = z.object({
  nombre: z.string().min(1, {
    message: "Por favor ingresa tu nombre",
  }),
  apellidoPaterno: z.string().min(1, {
    message: "Por favor ingresa tu apellido paterno",
  }),
  apellidoMaterno: z.string().min(1, {
    message: "Por favor ingresa tu apellido materno",
  }),
  fechaNacimiento: z.custom<DateValue>(() => true, {
    message: "Por favor ingresa tu fecha de nacimiento",
  }),
  curp: z.string().min(1, {
    message: "Por favor ingresa tu CURP",
  }),
  nss: z.string().min(1, {
    message: "Por favor ingresa tu NSS",
  }),
  sexo: z.enum(["Masculino", "Femenino"]),
  padecimientosHereditarios: z.string().min(1, {
    message: "Por favor ingresa tus padecimientos hereditarios",
  }),
});

type NormalInputs = {
  label: string;
  name: "nombre" | "apellidoPaterno" | "apellidoMaterno" | "curp" | "nss";
}

const normalInputs: NormalInputs[] = [
  {
    label: "Nombre",
    name: "nombre",
  },
  {
    label: "Apellido paterno",
    name: "apellidoPaterno",
  },
  {
    label: "Apellido materno",
    name: "apellidoMaterno",
  },
  {
    label: "CURP",
    name: "curp",
  },
  {
    label: "NSS",
    name: "nss",
  },
]

const sex = [
  "Masculino",
  "Femenino",
] as const;

export default function CrearPatientPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: today("America/Mexico_City"),
      curp: "",
      nss: "",
      sexo: "Masculino",
      padecimientosHereditarios: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {normalInputs.map((input, index) => (
          <Controller
            key={input.label + index}
            name={input.name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                label={input.label}
                errorMessage={fieldState.error?.message}
                isClearable
                isRequired
                onClear={() => form.setValue("nombre", "")}
                color={
                  form.formState.errors[input.name]
                    ? "danger"
                    : form.formState.submitCount > 0
                      ? "success"
                      : "default"
                }
                {...field}
              />
            )}
          />
        ))}
        <Controller
          name="sexo"
          control={form.control}
          render={({ field }) => (
            <Select
              label="Sexo"
              errorMessage={form.formState.errors.sexo?.message}
              isRequired
              color={
                form.formState.errors.sexo
                  ? "danger"
                  : form.formState.submitCount > 0
                    ? "success"
                    : "default"
              }
              {...field}
            >
              {sex.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <Controller
          name="fechaNacimiento"
          control={form.control}
          render={({ field, fieldState }) => (
            <DateInput
              label="Fecha de nacimiento"
              errorMessage={fieldState.error?.message}
              isRequired
              color={
                form.formState.errors.fechaNacimiento
                  ? "danger"
                  : form.formState.submitCount > 0
                    ? "success"
                    : "default"
              }
              {...field}
            />
          )}
        />
      </div>
      <Controller
          name="padecimientosHereditarios"
          control={form.control}
          render={({ field, fieldState }) => (
            <Textarea
              label="Padecimientos hereditarios"
              errorMessage={fieldState.error?.message}
              isRequired
              color={
                form.formState.errors.padecimientosHereditarios
                  ? "danger"
                  : form.formState.submitCount > 0
                    ? "success"
                    : "default"
              }
              {...field}
            />
          )}
        />
      <div className="mb-4 md:text-right">
        <Button
          type="submit"
          color="primary"
          className="w-full md:w-36"
          isLoading={form.formState.isSubmitting}
        >
          Crear paciente
        </Button>
      </div>
    </form>
  );
}
