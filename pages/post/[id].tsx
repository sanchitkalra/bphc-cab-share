import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
                          <h3>
                            {dt.getDate().toString().length == 1
                              ? `0${dt.getDate()}`
                              : dt.getDate()}
                            -
                            {(dt.getMonth() + 1).toString().length == 1
                              ? `0${dt.getMonth() + 1}`
                              : dt.getMonth() + 1}
                            -{dt.getFullYear()}
                          </h3>
                          <h3>
                            {dt.getHours().toString().length == 1
                              ? `0${dt.getHours()}`
                              : dt.getHours()}
                            :
                            {dt.getMinutes().toString().length == 1
                              ? `0${dt.getMinutes()}`
                              : dt.getMinutes()}
                          </h3>
                        </div>
                      </div>
                    </div>
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
                                  let r: any = responses
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
            <div className="grid mt-5 place-items-center">
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
            </div>
          </div>
        </main>
      )}
    </>
  )
}
