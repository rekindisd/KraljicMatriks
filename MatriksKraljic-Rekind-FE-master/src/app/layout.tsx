import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Modul Matriks Kraljic",
  description: "Kraljic Matrix App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
