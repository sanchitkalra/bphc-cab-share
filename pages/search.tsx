import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AddPost from '../components/AddPost'
import SearchResult from '../components/SearchResult'
import LoadingIndicator from '../components/LoadingIndicator'
import { getURL } from '../lib/url'
import { getSearchParams, validateSearch } from '../lib/database'

export default function Posts() {
  const user = useUser()
  const router = useRouter()
  const supabaseClient = useSupabaseClient()

  const [processing, setProcessing] = useState<boolean>(false)

  const [searchResults, setSearchResults] = useState<Array<Object> | null>(null)

  const [postMode, setPostMode] = useState(false)

  const search = router.query

  useEffect(() => {
    // console.log(new Date().getTime())
    if (user != null && router) {
      const searchSafe = router.query

      const fn = async (
        lowerLimit: number,
        upperLimit: number,
        thresholdTime: number
      ) => {
        if (searchSafe.from === 'Campus') {
          const { data, error } = await supabaseClient
            .from('ride_requests')
            .select()
            .eq('from', searchSafe.from)
            .eq('to', searchSafe.to)
            .gt('seats', 0)
            .neq('user_email', user.email)
            .order('id')
            .gte('time', lowerLimit)
            .lte('thresholded_time', thresholdTime)

          setSearchResults(data)
        } else {
          const { data, error } = await supabaseClient
            .from('ride_requests')
            .select()
            .eq('from', searchSafe.from)
            .eq('to', searchSafe.to)
            .gt('seats', 0)
            .neq('user_email', user.email)
            .order('id')
            .lte('time', upperLimit)
            .gte('thresholded_time', thresholdTime)

          setSearchResults(data)
        }
      }

      if (validateSearch(searchSafe)) {
        const { lowerLimit, upperLimit, searchDateTime } =
          getSearchParams(searchSafe)

        fn(lowerLimit, upperLimit, searchDateTime)
      }
    }
  }, [user, router, supabaseClient])

  async function login() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getURL()
      }
    })
  }

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      {user != null ? (
        <main className="flex flex-col items-center mb-6">
          <h1 className="text-4xl md:text-6xl text-center mt-6 font-bold">
            Search Results
          </h1>
          <h2 className="font-semibold w-80 text-center">
            {search.from} to {search.to} on {search.date} at {search.time}{' '}
            {search.from === 'Campus' ? 'leaving early by' : 'waiting upto'}{' '}
            {search.threshold} minutes{' '}
            <Link className="text-blue-900 underline" href={'/'}>
              edit
            </Link>
          </h2>
          {searchResults != null ? (
            searchResults.length === 0 ? (
              <div className="grid h-screen place-items-center">
                <div className="flex flex-col items-center">
                  <h2 className="font-semibold mb-10">No results</h2>
                  {postMode ? (
                    <AddPost
                      search={search}
                      user={user}
                      supabaseClient={supabaseClient}
                      processing={processing}
                      setProcessing={setProcessing}
                    />
                  ) : (
                    <button
                      className="text-sm mt-2 inline-block rounded bg-gray-800 px-3 py-1 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900"
                      onClick={(event) => {
                        event.preventDefault()
                        setPostMode(true)
                      }}
                      disabled={processing}
                    >
                      POST A REQUEST{' '}
                      <span className="text-white" aria-hidden="true">
                        &rarr;
                      </span>
                    </button>
                  )}
                  <h2 className="font-semibold mt-2">OR</h2>
                  <Link href={'/'}>
                    <button className="text-sm mt-2 inline-block rounded bg-gray-800 px-3 py-1 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900">
                      START A NEW SEARCH{' '}
                      <span className="text-white" aria-hidden="true">
                        &rarr;
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                {postMode ? (
                  <AddPost
                    search={search}
                    user={user}
                    supabaseClient={supabaseClient}
                    processing={processing}
                    setProcessing={setProcessing}
                  />
                ) : (
                  <div className="flex flex-row justify-center">
                    <button
                      className="text-sm mt-2 inline-block rounded bg-gray-800 px-3 py-1 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900"
                      onClick={(event) => {
                        event.preventDefault()
                        setPostMode(true)
                      }}
                    >
                      POST A REQUEST{' '}
                      <span className="text-white" aria-hidden="true">
                        &rarr;
                      </span>
                    </button>
                  </div>
                )}
                {searchResults.map((result: any) => {
                  const dt = moment(result.time).toDate()
                  return (
                    <SearchResult
                      dt={dt}
                      from={search.from as string}
                      processing={processing}
                      result={result}
                      setProcessing={setProcessing}
                      supabaseClient={supabaseClient}
                      threshold={search.threshold as string}
                      user={user}
                      key={result.id}
                    />
                  )
                })}
              </div>
            )
          ) : (
            <LoadingIndicator />
          )}
        </main>
      ) : (
        <main className="flex flex-col items-center justify-center mb-6">
          <div className="grid h-screen place-items-center">
            <div>
              <h1 className="text-2xl">Login to see search results</h1>
              <button
                className="w-full text-sm mt-2 inline-block rounded bg-gray-800 px-3 py-1 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900"
                onClick={login}
              >
                LOGIN{' '}
                <span className="text-white" aria-hidden="true">
                  &rarr;
                </span>
              </button>
            </div>
          </div>
        </main>
      )}
    </>
  )
}
