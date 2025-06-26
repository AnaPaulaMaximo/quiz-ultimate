import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Certifique-se de que este caminho está correto

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz de Filmes e Séries",
  description: "Crie quizzes personalizados sobre seus filmes e séries favoritos!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* Aplicando classes de fundo e texto no body para todo o aplicativo */}
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}