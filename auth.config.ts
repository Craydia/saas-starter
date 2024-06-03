import Google from "next-auth/providers/google"
import { env } from "@/env.mjs"

import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

// import { siteConfig } from "@/config/site"
// import { getUserByEmail } from "@/lib/user";
// import MagicLinkEmail from "@/emails/magic-link-email"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: {email: string, password: string}) {
        
        // Add logic here to look up the user from the credentials supplied
        if (credentials == null) return null;
        // login

        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            }
          });

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user?.password ?? '',
            );
            if (isMatch) {
              return user as any;
            } else {
              throw new Error("Email or password is incorrect");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    })
    // Email({
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     const user = await getUserByEmail(identifier);
    //     if (!user || !user.name) return null;

    //     const userVerified = user?.emailVerified ? true : false;
    //     const authSubject = userVerified ? `Sign-in link for ${siteConfig.name}` : "Activate your account";

    //     try {
    //       const { data, error } = await resend.emails.send({
    //         from: 'SaaS Starter App <onboarding@resend.dev>',
    //         to: process.env.NODE_ENV === "development" ? 'delivered@resend.dev' : identifier,
    //         subject: authSubject,
    //         react: MagicLinkEmail({
    //           firstName: user?.name as string,
    //           actionUrl: url,
    //           mailType: userVerified ? "login" : "register",
    //           siteName: siteConfig.name
    //         }),
    //         // Set this to prevent Gmail from threading emails.
    //         // More info: https://resend.com/changelog/custom-email-headers
    //         headers: {
    //           'X-Entity-Ref-ID': new Date().getTime() + "",
    //         },
    //       });

    //       if (error || !data) {
    //         throw new Error(error?.message)
    //       }

    //       // console.log(data)
    //     } catch (error) {
    //       throw new Error("Failed to send verification email.")
    //     }
    //   },
    // }),
  ],
} satisfies NextAuthConfig