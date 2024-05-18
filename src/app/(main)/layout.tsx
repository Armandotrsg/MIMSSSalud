export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto h-full py-14 md:px-14">{children}</div>
  );
}
