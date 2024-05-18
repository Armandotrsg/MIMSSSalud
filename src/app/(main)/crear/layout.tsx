export default function CrearLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <h1 className="my-6 text-2xl font-bold text-default-900">
        Crear paciente
      </h1>
      {children}
    </main>
  );
}