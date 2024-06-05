import Google from "next-auth/providers/google"
import { env } from "@/env.mjs"

import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

import { getUserByEmail } from "@/lib/user";
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
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        if (credentials == null) return null;
        // login

        try {
          const user = await getUserByEmail(String(credentials?.email))

          if (user) {
            const isMatch = await bcrypt.compare(
              String(credentials?.password),
              String(user?.password),
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
    }),
    // Email({
    //   sendVerificationRequest: (async (credentials: any) => {
    //     const user = await getUserByEmail(credentials.identifier);
    //     if (!user || !user.name) return null;

    //     const userVerified = user?.emailVerified ? true : false;
    //     const authSubject = userVerified ? `Sign-in link for ${siteConfig.name}` : "Activate your account";

    //     try {
    //       const { data, error } = await resend.emails.send({
    //         from: 'SaaS Starter App <onboarding@resend.dev>',
    //         to: process.env.NODE_ENV === "development" ? 'delivered@resend.dev' : credentials.identifier,
    //         subject: authSubject,
    //         react: MagicLinkEmail({
    //           firstName: user?.name as string,
    //           actionUrl: credentials.url,
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
    //     return null;
    //   }) as any,
   // }),
  ],
} satisfies NextAuthConfig