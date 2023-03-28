import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AddPost from '../components/AddPost'
import SearchResult from '../components/SearchResult'

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
        lowerDate: number,
        upperDate: number,
        thresholdTime: number
      ) => {
        if (searchSafe.from === 'Campus') {
          const { data, error } = await supabaseClient
            .from('ride_requests')
            .select()
            .eq('from', searchSafe.from)
            .eq('to', searchSafe.to)
            .gt('seats', 0)
            // .neq('user_email', user.email)
            .order('id')
            .gte('time', lowerDate)
            .lte('thresholded_time', thresholdTime)

          setSearchResults(data)
        } else {
          const { data, error } = await supabaseClient
            .from('ride_requests')
            .select()
            .eq('from', searchSafe.from)
            .eq('to', searchSafe.to)
            .gt('seats', 0)
            // .neq('user_email', user.email)
            .order('id')
            .lte('time', upperDate)
            .gte('thresholded_time', thresholdTime)

          setSearchResults(data)
        }
      }

      if (
        searchSafe.from &&
        searchSafe.to &&
        searchSafe.threshold &&
        searchSafe.date &&
        searchSafe.time
      ) {
        const thresholdDate = new Date(
          `${searchSafe.date}T${searchSafe.time}:00`
        )
        console.log(thresholdDate.getTime())

        let lowerDate, upperDate

        if (searchSafe.from === 'Campus') {
          lowerDate =
            thresholdDate.getTime() - Number(searchSafe.threshold) * 60 * 1000
          upperDate = thresholdDate.getTime()
        } else {
          lowerDate = thresholdDate.getTime()
          upperDate =
            thresholdDate.getTime() + Number(searchSafe.threshold) * 60 * 1000
        }

        console.log(lowerDate)
        console.log(upperDate)

        fn(lowerDate, upperDate, thresholdDate.getTime())
      }
    }
  }, [user, router, supabaseClient])

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
    return url
  }

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
            <div className="grid h-screen place-items-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-400 animate-spin dark:text-gray-400 fill-gray-800"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
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
