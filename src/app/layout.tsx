import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import PostHogProvider from "@/components/PostHogProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "starter-next-supa-stripe",
  description: "Next + Prisma + Supabase + Auth + Stripe + PostHog boilerplate",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  const email = session?.user?.email ?? null;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider userId={userId} email={email}>
          <Header />
          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </PostHogProvider>
      </body>
    </html>
  );
}

