import type { Metadata } from "next";
import { Poppins, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Space Grotesk is the direct Google Font counterpart to Breul Grotesk from the brand spec
const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nex Network — Student Developer & Builder Community",
  description:
    "A student-driven tech community built for learners, creators, innovators, and future tech professionals. Learn. Build. Collaborate. Compete. Connect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${spaceGrotesk.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
