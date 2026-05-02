import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import StyleInjector from "@/components/StyleInjector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import prisma from "@/lib/prisma";

export async function generateMetadata() {
  const settingsArray = await prisma.setting.findMany();
  const s = settingsArray.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
  
  return {
    title: {
      template: `%s | ${s.site_name || "Lic. Cecilia Lucero"}`,
      default: s.site_name || "Lic. Cecilia Lucero",
    },
    description: s.site_description || "Sitio profesional de psicología clínica y acompañamiento terapéutico.",
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StyleInjector />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
