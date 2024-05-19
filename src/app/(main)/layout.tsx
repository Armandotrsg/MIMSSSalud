export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-14">{children}</div>
  );
}
