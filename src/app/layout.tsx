import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
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
  title: {
    default: "ENRUTA — Descubre tu norte",
    template: "%s · ENRUTA",
  },
  description:
    "Plataforma de orientación vocacional para estudiantes de 1° a 4° medio en Chile. Autoconocimiento, exploración y proyecto de vida.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/enruta-logo.jpg",
  },
  applicationName: "ENRUTA",
  authors: [{ name: "ENRUTA" }],
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
  // Never disable zoom (a11y)
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
