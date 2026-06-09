import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aryan Verma — Software Development Engineer",
  description:
    "Portfolio of Aryan Verma, Software Development Engineer based in Chandigarh, India. Specialized in high-performance 3D configurators, Next.js, and serverless cloud architectures.",
  metadataBase: new URL("https://portfolio-new.vercel.app"), // Placeholder until final domain
  openGraph: {
    title: "Aryan Verma — Software Development Engineer",
    description:
      "Specialized in high-performance 3D configurators, Next.js, and serverless cloud architectures. Over 2 years of experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inline blocking script to set data-theme before first paint
  const themeScript = `
    (function() {
      var s = localStorage.getItem('theme');
      document.documentElement.setAttribute('data-theme', s ? s : (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
    })();
  `;

  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
