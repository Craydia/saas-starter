import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import authConfig from "@/auth.config"
import { getUserById } from "@/lib/user"

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    // error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = await getUserById((token.user as any)?.id) as any;
      }
      return session;
    },
    async signIn({ user }) {
      const u = await prisma.user.findFirst({ where: { email: user.email } });

      const email = user.email;
      const name = user.name;

      if (!u) {
        const newUser = await prisma.user.create({
          data: {
            email,
            name,
            emailVerified: new Date(),
            image: user.image
          }
        });

        await prisma.account.create({
          data: {
            userId: newUser.id,
            provider: "google",
            providerAccountId: user?.email ?? '',
            type: user.email?.includes("gmail") ? "gmail" : "email-custom"
          }
        })
      }
      return true
    }
  },
  ...authConfig,
  // debug: process.env.NODE_ENV !== "production"
})