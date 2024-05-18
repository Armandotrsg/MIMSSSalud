export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <h1 className="my-6 text-2xl font-bold text-default-900">
        Administrar pacientes
      </h1>
      {children}
    </main>
  );
}
