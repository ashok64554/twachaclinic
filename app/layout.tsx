import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://twachaclinic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Twacha Skin Clinic | Dermatologist in Dwarka, New Delhi",
    template: "%s | Twacha Skin Clinic"
  },
  description: "Twacha Skin Clinic offers dermatologist-led skin, hair, laser and aesthetic care in Dwarka, New Delhi.",
  applicationName: "Twacha Skin Clinic",
  keywords: [
    "Twacha Skin Clinic",
    "dermatologist in Dwarka",
    "skin clinic in Delhi",
    "laser hair removal Delhi",
    "hair treatment clinic Delhi",
    "cosmetic dermatologist Delhi"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Twacha Skin Clinic",
    title: "Twacha Skin Clinic | Dermatologist in Dwarka, New Delhi",
    description: "Dermatologist-led skin, hair, laser and aesthetic care in Dwarka, New Delhi.",
    images: [
      {
        url: "/assets/img/twacha-logo.png",
        width: 1200,
        height: 630,
        alt: "Twacha Skin Clinic"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Twacha Skin Clinic | Dermatologist in Dwarka, New Delhi",
    description: "Dermatologist-led skin, hair, laser and aesthetic care in Dwarka, New Delhi.",
    images: ["/assets/img/twacha-logo.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/assets/img/fav-icon.png",
    shortcut: "/assets/img/fav-icon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
