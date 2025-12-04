import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chrono Arc - Family Timeline Game",
  description: "A web-based family game where you and your kids rebuild human history together",
  keywords: ["timeline", "history", "education", "family game", "inventions"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
