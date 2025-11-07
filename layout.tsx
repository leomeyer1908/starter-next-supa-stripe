import "./globals.css";
import { PostHogProvider } from "@/components/PostHogProvider";

export const metadata = {
  title: "starter-next-supa-stripe",
  description: "Next + Prisma + Supabase + Auth + Stripe + PostHog boilerplate",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}

