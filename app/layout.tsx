import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";

import AuthProvider from "@/components/providers/auth-provider";
import PwaInstallProvider from "@/components/providers/pwa-install-provider";
import ServiceWorkerProvider from "@/components/providers/service-worker-provider";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thalia",
  description: "Gestión de clínicas estéticas",
};

export const viewport: Viewport = {
  themeColor: "#3cac8e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <Theme accentColor="teal" grayColor="gray" radius="large">
          <ServiceWorkerProvider>
            <PwaInstallProvider>
              <AuthProvider>
                {children}
                <ToastContainer position="bottom-right" autoClose={4000} />
              </AuthProvider>
            </PwaInstallProvider>
          </ServiceWorkerProvider>
        </Theme>
      </body>
    </html>
  );
}
