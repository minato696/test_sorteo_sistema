import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElAzGanador - Sorteos Online",
  description: "Participa en sorteos de productos increíbles como iPhones, PlayStation y MacBooks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition-colors">
                ElAzGanador
              </Link>
              <div className="flex gap-6">
                <Link href="/" className="hover:text-gray-200 transition-colors font-medium">
                  Inicio
                </Link>
                <Link href="/sorteos" className="hover:text-gray-200 transition-colors font-medium">
                  Sorteos
                </Link>
                <Link href="/admin" className="hover:text-gray-200 transition-colors font-medium">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="mb-2">&copy; 2025 ElAzGanador. Todos los derechos reservados.</p>
              <p className="text-sm text-gray-400">
                Sistema de sorteos online - Gana productos increíbles
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}