import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { Providers } from "./providers";
import { Toaster } from "@/components/toast/toaster";

export const metadata = {
  title: "Mi IMSS Salud",
  description: "Mi IMSS Salud",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
