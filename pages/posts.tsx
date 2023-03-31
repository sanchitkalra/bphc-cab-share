import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getDisplayDate, getDisplayTime } from '../lib/datetime'
import LoadingIndicator from '../components/LoadingIndicator'

export default function Posts() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const [posts, setPosts] = useState<Array<Object> | null>(null)

  useEffect(() => {
    // console.log(search)
    if (user != null) {
      const fn = async () => {
        const { data, error } = await supabaseClient
          .from('ride_requests')
          .select()
          .eq('user_email', user.email)
          .order('id', { ascending: false })

        // console.log(data, error)
        setPosts(data)
      }

      fn()
    }
  }, [user, supabaseClient])

  return (
    <>
      <Head>
        <title>Your Posts</title>
      </Head>
      {user != null ? (
        <main className="flex flex-col items-center mb-6">
          <h1 className="text-4xl md:text-6xl text-center mt-6 font-bold">
            Your Posts
          </h1>
          {posts != null ? (
            posts.length === 0 ? (
              <div className="grid h-screen place-items-center">
                <div className="flex flex-col items-center">
                  <h2 className="font-semibold mb-10">No results</h2>
                  <Link href={'/'}>
                    <button className="text-sm mt-2 inline-block rounded bg-gray-800 px-3 py-1 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900">
                      POST A REQUEST{' '}
                      <span className="text-white" aria-hidden="true">
                        &rarr;
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                {posts.map((result: any) => {
                  const dt = moment(result.time).toDate()

                  return (
                    <div
                      className="w-80 sm:w-96 mt-4 rounded shadow p-2 border-2"
                      key={result.id}
                    >
                      <div className="flex flex-row justify-between mb-2">
                        <div className="w-3/5 flex flex-col">
                          <h3 className="font-semibold text-xl">
                            {result.from} <span aria-hidden="true">&rarr;</span>{' '}
                            {result.to}
                          </h3>
                          <h3>{result.user_name}</h3>
                          <h3>
                            {result.seats} seat{result.seats > 1 && 's'}{' '}
                            available
                          </h3>
                        </div>
                        <div className="flex flex-col items-end font-semibold w-2/5">
                          <h3>{getDisplayDate(dt)}</h3>
                          <h3>{getDisplayTime(dt)}</h3>
                        </div>
                      </div>

                      <div className="flex flex-row justify-end w-full">
                        <Link href={`/post/${result.id}`} className="w-full">
                          <button className="w-full text-sm mt-2 inline-block rounded bg-gray-800 px-3 py-1 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900">
                            SEE REQUESTS{' '}
                            <span className="text-white" aria-hidden="true">
                              &rarr;
                            </span>
                          </button>
                        </Link>
                      </div>
                    </div>
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
            </div>
          </div>
        </main>
      )}
    </>
  )
}
