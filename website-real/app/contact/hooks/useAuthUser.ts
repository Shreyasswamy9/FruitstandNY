"use client"

import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../../supabase-client'

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const { data: sessionData } = await supabase.auth.getSession()
      if (!isMounted) return
      setUser(userData.user)
      setSession(sessionData.session)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setUser(sess?.user ?? null)
      setSession(sess ?? null)
    })

    return () => {
      isMounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  return { user, session }
}
