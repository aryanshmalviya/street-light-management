import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import AppShell from "@/components/app-shell";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Street Light Management",
  description:
    "Centralized automation and monitoring for National Highway street lighting",
};

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/live-map", label: "Live Map" },
  { href: "/faults-alerts", label: "Faults" },
  { href: "/energy-emissions", label: "Energy" },
  { href: "/environmental-impact", label: "Impact" },
  { href: "/maintenance-sla", label: "Maintenance" },
  { href: "/comparative-evaluation", label: "Comparison" },
  { href: "/implementation-model", label: "Implementation" },
  { href: "/pilot-deployment", label: "Pilot" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} ${fraunces.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <AppShell navItems={navItems}>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
