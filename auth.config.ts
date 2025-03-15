import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const createServerClient = cache(() =>
  createServerComponentClient({ cookies })
)

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      const supabase = createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        session.user = {
          ...session.user,
          ...user,
        }
      }
      
      return session
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.user = user
      }
      return token
    },
  }
}