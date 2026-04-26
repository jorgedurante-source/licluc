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

export const metadata = {
  title: "Lic. Cecilia Lucero | Psicología Clínica",
  description: "Sitio profesional de la Lic. Cecilia Lucero. Especialista en psicología clínica y acompañamiento terapéutico.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StyleInjector />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
