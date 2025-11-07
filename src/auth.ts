// src/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY!);

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // 24h
      async sendVerificationRequest({ identifier, url }) {
        // Custom email via Resend
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: identifier,
          subject: "Your sign-in link",
          html: `
            <div style="font-family: sans-serif">
              <p>Click to sign in:</p>
              <p><a href="${url}">${url}</a></p>
              <p>This link expires in 24 hours.</p>
            </div>
          `,
        });
      },
    }),
  ],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  // You can customize callbacks if you want user fields in the JWT:
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) (session as any).userId = token.userId;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

