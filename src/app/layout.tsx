import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "ProTracker Pro - Your Fitness Journey, Tracked",
  description: "A modern, feature-rich workout tracking app. Track exercises, set personal records, and achieve your fitness goals with beautiful analytics.",
  keywords: ["fitness", "workout", "tracker", "exercise", "gym", "health", "training"],
  authors: [{ name: "ProTracker Pro" }],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "ProTracker Pro",
    description: "Your fitness journey, tracked",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProTracker Pro",
    description: "Your fitness journey, tracked",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
