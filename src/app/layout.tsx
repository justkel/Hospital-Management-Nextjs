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
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Wellflexia | Hospital Management System',
    template: '%s | Wellflexia',
  },
  description: 'Wellflexia is a hospital management system that connects patient records, clinical visits, wards, theatre scheduling, billing, and hospital operations in one secure platform.',
  keywords: [
    'Wellflexia',
    'hospital management system',
    'hospital software',
    'patient management system',
    'clinic management software',
    'healthcare operations',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '64x64' }],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Wellflexia',
    title: 'Wellflexia | Hospital Management System',
    description: 'A hospital management system connecting patient records, clinical visits, wards, theatre scheduling, and billing.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Wellflexia hospital management system shown on the patient management screen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wellflexia | Hospital Management System',
    description: 'A hospital management system connecting patient records, clinical visits, wards, theatre scheduling, and billing.',
    images: ['/opengraph-image'],
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
