import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/layout/Layout";
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
  title: "DSA Visualizer - Learn Data Structures and Algorithms",
  description: "Interactive platform to learn and visualize Data Structures and Algorithms with step-by-step explanations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
