import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import AntdRegistry from "./AntdRegistry";
import "antd/dist/reset.css";
import "./globals.css";
import AuthOverlay from "@/components/AuthOverlay";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wellflexia.com',
  ),
  title: {
    default: 'Wellflexia | Hospital Management',
    template: '%s | Wellflexia',
  },
  description: 'Wellflexia brings patient records, visits, billing, and hospital operations together in one connected platform.',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Wellflexia',
    title: 'Wellflexia | Hospital Management',
    description: 'Patient records, visits, theatre, billing, and hospital operations — connected in one platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wellflexia | Hospital Management',
    description: 'Patient records, visits, theatre, billing, and hospital operations — connected in one platform.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <AntdRegistry>
          <AuthOverlay />
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
