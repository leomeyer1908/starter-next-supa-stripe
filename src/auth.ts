// src/auth.ts (v4)
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM;

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: fromEmail,
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url }) {
        if (resendKey && fromEmail) {
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: fromEmail!,
            to: identifier,
            subject: "Your sign-in link",
            html: `<p>Click to sign in:</p><p><a href="${url}">${url}</a></p>`,
          });
        } else {
          console.log("[DEV ONLY] Magic link for", identifier, "→", url);
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) { if (user) (token as any).userId = (user as any).id; return token; },
    async session({ session, token }) { if (token && (token as any).userId) (session as any).userId = (token as any).userId; return session; },
  },
};

// Build a handler for the App Router route file to re-export
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

