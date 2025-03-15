'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface SessionContextType {
  session: Session | null
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return {
    session: context.session,
    isLoading: context.isLoading,
    status: context.session ? 'authenticated' : 'unauthenticated',
  }
} 