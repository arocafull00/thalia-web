import { Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";

import AuthProvider from "@/components/providers/auth-provider";
import PwaInstallProvider from "@/components/providers/pwa-install-provider";
import ServiceWorkerProvider from "@/components/providers/service-worker-provider";
import { Toaster } from "@/components/ui/sonner";

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
  icons: {
    icon: "/icon.png",
    // Tiene que ser un PNG opaco: iOS no admite transparencia en el
    // apple-touch-icon y la compone sobre negro, así que un icono con esquinas
    // redondeadas transparentes se instala con las esquinas negras (#83).
    apple: [{ url: "/icon-192x192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2F7D74",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Analytics />
      <SpeedInsights />
      <body
        className="min-h-full flex flex-col bg-canvas text-ink"
        suppressHydrationWarning
      >
        <Theme accentColor="teal" grayColor="gray" radius="large">
          <ServiceWorkerProvider>
            <PwaInstallProvider>
              <AuthProvider>
                {children}
                <Toaster position="bottom-right" richColors closeButton />
                <ToastContainer position="bottom-right" theme="colored" />
              </AuthProvider>
            </PwaInstallProvider>
          </ServiceWorkerProvider>
        </Theme>
      </body>
    </html>
  );
}
