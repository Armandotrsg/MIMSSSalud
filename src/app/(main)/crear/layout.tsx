import { ChevronDownIcon } from "@/assets/icons/chevron_down_icon";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function CrearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header className="flex items-center gap-3">
        <Button
          as={Link}
          isIconOnly
          color="default"
          size="sm"
          variant="bordered"
          aria-label="Regresar"
          href="/"
        >
          <ChevronDownIcon
            fill="currentColor"
            className="h-5 w-5 rotate-90 text-default-500"
          />
        </Button>
        <h1 className="my-6 text-3xl font-bold text-default-900">
          Crear paciente
        </h1>
      </header>
      {children}
    </main>
  );
}
