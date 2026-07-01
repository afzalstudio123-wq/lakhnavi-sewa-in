import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoWrapper from "@/components/shared/DemoWrapper";
import NotificationToast from "@/components/ui/NotificationToast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Lakhnavi Sewa | Premium On-Demand Services in Lucknow",
  description: "Book home repairs, beauty at home, cleaning, smart setups, daily labors, and contractors in Lucknow, Uttar Pradesh. Bilingual English & Hindi support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} flex flex-col min-h-screen bg-canvas text-ink antialiased`}>
        <AppProvider>
          <NotificationToast />
          <DemoWrapper>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </DemoWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
