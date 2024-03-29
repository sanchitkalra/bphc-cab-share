import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getDisplayDate, getDisplayTime } from '../../lib/datetime'
import LoadingIndicator from '../../components/LoadingIndicator'

export default function Posts() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const router = useRouter()
  const { id } = router.query

  const [post, setPost] = useState<Array<Object> | null>(null)
  const [responses, setResponses] = useState<Array<Object> | null>(null)

  const [approvalError, setApprovalError] = useState<string | null>(null)

  useEffect(() => {
    if (user != null && id) {
      const fn = async () => {
        const { data: postData, error: postError } = await supabaseClient
          .from('ride_requests')
          .select()
          .eq('user_email', user.email)
          .eq('id', id)

        console.log(postData, postError)
        setPost(postData)

        const { data: responsesData, error: responsesError } =
          await supabaseClient
            .from('ride_responses')
            .select()
            .eq('postID', id)
            .order('id', { ascending: true })

        console.log(responsesData, responsesError)
        setResponses(responsesData)
      }

      fn()
    }
  }, [user, supabaseClient, id])

  return (
    <>
      <Head>
        <title>Post Details</title>
      </Head>
      {user != null ? (
        <main className="flex flex-col items-center mb-6">
          <h1 className="text-4xl md:text-6xl text-center mt-6 font-bold">
            Post Details
          </h1>
          {post != null ? (
            post.length === 0 ? (
              <div className="grid h-screen place-items-center">
                <div className="flex flex-col items-center">
                  <h2 className="font-semibold mb-10">Invalid Post ID</h2>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                {post.map((result: any) => {
                  const dt = moment(result.time).toDate()
                  // console.log(
                  //   dt.getDate(),
                  //   dt.getMonth() + 1,
                  //   dt.getFullYear(),
                  //   dt.getTimezoneOffset(),
                  //   dt.getHours(),
                  //   dt.getMinutes()
                  // )

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
      {user != null ? (
        <main className="flex flex-col items-center mb-6">
          <h1 className="text-3xl md:text-6xl text-center mt-6 font-bold">
            Responses
          </h1>
          {responses != null ? (
            responses.length === 0 ? (
              <div className="grid h-max place-items-center">
                <div className="flex flex-col items-center">
                  <h2 className="font-semibold mt-2">No responses yet</h2>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                {responses.map((result: any) => {
                  return (
                    <div
                      className="w-80 sm:w-96 mt-4 rounded shadow p-2 border-2"
                      key={result.id}
                    >
                      <div className="flex flex-row justify-between mb-2">
                        <div className="w-3/5 flex flex-col">
                          <h3 className="font-semibold text-xl">
                            {result.req_user_name}
                          </h3>
                          <h3>
                            {result.seats} seat{result.seats > 1 && 's'}{' '}
                            requested
                          </h3>
                        </div>
                        <div className="flex flex-col items-end font-semibold w-2/5">
                          <h3>{result.time}</h3>
                        </div>
                      </div>

                      <div className="flex flex-row justify-end w-full">
                        <button
                          className={`w-full text-sm mt-2 inline-block rounded px-3 py-1 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900 bg-gray-800`}
                          onClick={(event) => {
                            event.preventDefault()
                            ;(async () => {
                              if (post) {
                                const p: any = post[0]
                                if (p.seats <= 0) {
                                  setApprovalError('No seats available')
                                  return
                                }
                                const { error: writeError } =
                                  await supabaseClient
                                    .from('ride_requests')
                                    .update({ seats: p.seats - result.seats })
                                    .eq('id', p.id)

                                const { error: statusError } =
                                  await supabaseClient
                                    .from('ride_responses')
                                    .update({ approved: true })
                                    .eq('id', result.id)

                                console.log(writeError, statusError)

                                if (writeError || statusError) {
                                  setApprovalError(
                                    'Approval failed, try again in a while'
                                  )
                                  return
                                }

                                if (!writeError && !statusError) {
                                  console.log('here')
                                  let r: any = [...responses]
                                  console.log(r)
                                  let index = responses.findIndex(
                                    (val: any) => val.id == result.id
                                  )
                                  console.log(index)
                                  r[index].approved = true
                                  console.log(r)
                                  setResponses(r)
                                }
                              }
                            })()
                          }}
                          disabled={result.approved}
                        >
                          {result.approved ? (
                            'APPROVED'
                          ) : (
                            <p>
                              APPROVE{' '}
                              <span className="text-white" aria-hidden="true">
                                &rarr;
                              </span>
                            </p>
                          )}
                        </button>
                      </div>
                      <div className="flex flex-row justify-center mt-1">
                        <p className="self-center">{approvalError}</p>
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
