import Image from "next/image";
import Salud from "@/assets/img/Salud.webp";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full max-w-sm rounded-lg p-8">
      <Image
        src={Salud}
        alt="Tec de Monterrey"
        className="mx-auto mb-8"
        width={300}
        height={150}
      />
      <h1 className="my-3 text-center text-xl font-bold text-white dark:text-neutral-200">
        Iniciar sesi&oacute;n
      </h1>
      {children}
    </main>
  );
}