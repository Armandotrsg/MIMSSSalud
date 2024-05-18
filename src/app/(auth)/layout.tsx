export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen items-center justify-center bg-blue-900 bg-[url('https://web2.ceti.mx//fotos-publicaciones/background-rojo.jpg')] bg-cover">
      <div className="absolute bottom-0 left-0 right-0 top-0 " />
      <div className="bg-white/5 relative z-10 w-full max-w-sm rounded-2xl p-8 shadow-xl backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
