import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://twachaclinic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Twacha Skin Clinic | Dermatologist in Dwarka, New Delhi",
    template: "%s | Twacha Skin Clinic"
  },
  description: "Book dermatologist-led skin, hair, laser and aesthetic treatments at Twacha Skin Clinic in Dwarka, New Delhi.",
  applicationName: "Twacha Skin Clinic",
  authors: [{ name: "Twacha Skin Clinic" }],
  creator: "Twacha Skin Clinic",
  publisher: "Twacha Skin Clinic",
  category: "Healthcare",
  keywords: [
    "Twacha Skin Clinic",
    "dermatologist in Dwarka",
    "skin clinic in Delhi",
    "skin clinic in Dwarka",
    "dermatologist in Delhi",
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
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://whatsform.com" />
      </head>
      <body>
        {children}
        <Script id="whatsform-config" strategy="afterInteractive">
          {`window.whatsformId = 'LIPh0Y'; window.whatsformMessage = 'Message on WhatsApp';`}
        </Script>
        <Script
          id="wf-widget"
          src="https://whatsform.com/launcher.js"
          strategy="lazyOnload"
          data-id="LIPh0Y"
          data-message="Message on WhatsApp"
        />
        <Script id="whatsform-mobile-close-fix" strategy="afterInteractive">
          {`
            (function () {
              function closeWhatsform(event) {
                var target = event.target;
                if (!target || !target.closest || !target.closest("#wf-frame-close")) {
                  return;
                }

                if (window.whatsform && typeof window.whatsform.close === "function") {
                  event.preventDefault();
                  event.stopPropagation();
                  window.whatsform.close();
                }
              }

              ["pointerdown", "touchstart", "click"].forEach(function (eventName) {
                document.addEventListener(eventName, closeWhatsform, true);
              });
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
