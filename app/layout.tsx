import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import ToastProvider from "@/providers/toastProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HacknFair",
  description: "HacknFair is an innovative platform designed to bridge the gap between science fairs and hackathons, providing a virtual space where creativity and competition thrive.",
  openGraph: {
    title: "HacknFair",
    description:
      "HacknFair is an innovative platform designed to bridge the gap between science fairs and hackathons, providing a virtual space where creativity and competition thrive.",
    url: `https://hacknfair.vercel.app/`,
    siteName: "HacknFair",
    images: [
      {
        url: "https://images.pexels.com/photos/305565/pexels-photo-305565.jpeg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ToastProvider />
        <ConvexClientProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="mt-28 flex-grow">{children}</div>
            <Footer />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
