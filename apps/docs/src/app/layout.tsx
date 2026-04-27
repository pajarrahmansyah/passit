import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PassIt Docs",
    template: "%s | PassIt Docs",
  },
  description: "Documentation for @pajarrahmansyah/passit, a config-driven proxy gateway for Next.js App Router.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
