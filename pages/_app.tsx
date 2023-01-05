import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import {
  SessionContextProvider,
  Session,
  useUser
} from '@supabase/auth-helpers-react'
import { useState } from 'react'
import Navbar from '../components/navbar'

export default function App({
  Component,
  pageProps
}: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <>
        <Navbar current="home" />
        <Component {...pageProps} />
      </>
    </SessionContextProvider>
  )
}
