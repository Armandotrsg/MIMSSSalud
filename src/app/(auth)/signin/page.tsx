"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { MailIcon } from "@/assets/icons/mail_icon";
import { LockIcon } from "@/assets/icons/lock_icon";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import PasswordInput from "@/components/PasswordInput";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un email válido: nombre@correo.com",
  }),
  password: z.string().min(1, {
    message: "Por favor ingresa tu contraseña",
  }),
});

const classNamesInput = {
  label: "text-black/50 dark:text-white/90",
  input: [
    "bg-transparent",
    "text-black/90 dark:text-white/90",
    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
  ],
  innerWrapper: "bg-transparent",
  inputWrapper: [
    "shadow-xl",
    "bg-default-200/50",
    "dark:bg-default/60",
    "backdrop-blur-xl",
    "backdrop-saturate-200",
    "hover:bg-default-200/70",
    "dark:hover:bg-default/70",
    "group-data-[focused=true]:bg-default-200/50",
    "dark:group-data-[focused=true]:bg-default/60",
    "!cursor-text",
  ],
};

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (result?.error) {
      form.setError("email", {
        type: "manual",
        message: result.error,
      });
    } else {
      router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <Input
            isClearable
            onClear={() => form.setValue("email", "")}
            label="Email"
            type="email"
            fullWidth
            isRequired
            placeholder="nombre@tec.mx"
            startContent={<MailIcon />}
            classNames={classNamesInput}
            {...field}
          />
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field }) => (
          <PasswordInput
            fullWidth
            isRequired
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            startContent={<LockIcon />}
            classNames={classNamesInput}
            {...field}
          />
        )}
      />

      {form.formState.errors.email && (
        <div className="text-sm text-red-500">
          {form.formState.errors.email.message}
        </div>
      )}

      <Button type="submit" color="primary" fullWidth isLoading={isLoading}>
        Iniciar sesi&oacute;n
      </Button>
    </form>
  );
}
