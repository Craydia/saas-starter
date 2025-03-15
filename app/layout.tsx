import "@/styles/globals.css";
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/providers/session-provider'

import { fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { ThemeProvider } from "next-themes";

import { cn, constructMetadata } from "@/lib/utils";
import { Analytics } from "@/components/analytics";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable,
          inter.className
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <ModalProvider>{children}</ModalProvider>
              <Analytics />
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
