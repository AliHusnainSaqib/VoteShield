import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteShield",
  description: "AI-Powered Digital Voting & Fair Electoral District System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning={true} className="min-h-full flex flex-col bg-background text-foreground">
        <header 
          className="w-full px-6 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md bg-[#0D4D38]"
        >

          <Link href="/" className="text-2xl font-bold tracking-tighter text-white z-10 hover:text-[#5A7D7C] transition-colors duration-300">
            VoteShield
          </Link>
          <nav className="flex gap-6 font-medium text-white z-10 items-center">
            <Link href="/transparency" className="hover:text-[#5A7D7C] transition-colors duration-300">Transparency Hub</Link>
            <Link href="/vote" className="hover:text-[#5A7D7C] transition-colors duration-300">Vote Portal</Link>
            <Link href="/admin/dashboard" className="hover:text-[#5A7D7C] transition-colors duration-300">Admin</Link>
            <Link href="/contact" className="hover:text-[#5A7D7C] transition-colors duration-300">Contact Us</Link>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
