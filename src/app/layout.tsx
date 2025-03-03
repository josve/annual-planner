import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/header";
import React from "react";
import Providers from "@/components/Providers";
import LayoutContent from "@/components/LayoutContent";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth";

export const metadata: Metadata = {
  title: "Årshjul",
};

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {

  const session: any = await getServerSession(authOptions);

  if (!session) {
    return (
        <html lang="sv">
        <body>
        <Providers session={null}>
          {children}
        </Providers>
        </body>
        </html>
    );
  }

  return (
      <html lang="sv">
      <body>
      <Providers session={session}>
        <Header/>
        <LayoutContent>
          {children}
        </LayoutContent>
      </Providers>
      </body>
      </html>
  );
}
