import { useState } from 'react'
import { SupabaseClient, User } from '@supabase/auth-helpers-react'

export default function AddPost({
  search,
  user,
  supabaseClient
}: {
  search: any
  user: User | null
  supabaseClient: SupabaseClient<any, 'public', any>
}) {
  const [seats, setSeats] = useState(0)
  const [postResult, setPostResult] = useState({
    message: '',
    status: 'none'
  })

  const addPost = () => {
    ;(async () => {
      setPostResult({
        message: 'Requesting the universe for a cab',
        status: 'progress'
      })

      if (seats <= 0) {
        setPostResult({
          message: 'At least 1 seat must be offered',
          status: 'failed'
        })
        return
      }

      const { error } = await supabaseClient.from('ride_requests').insert({
        user_name: user?.user_metadata.full_name,
        user_email: user?.email,
        from: search.from,
        to: search.to,
        time: new Date(`${search.date}T${search.time}:00`),
        tolerance: search.threshold,
        seats
      })

      if (error) {
        setPostResult({
          message: 'Post Failed',
          status: 'failed'
        })
        return
      }

      setPostResult({
        message: 'Posted Successfully',
        status: 'ok'
      })
      return
    })()
  }

  return (
    <div className="flex flex-col items-center p-4 border rounded w-80 sm:w-96">
      <h2 className="self-start font-semibold">Seats?</h2>
      <input
        className="w-full border rounded p-2"
        placeholder="Seats to offer?"
        type="number"
        min={0}
        value={seats}
        onChange={(event) => setSeats(Number(event.target.value))}
      />
      <button
        className="text-xs mt-2 inline-block rounded bg-gray-800 px-3 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900"
        onClick={(event) => {
          event.preventDefault()
          addPost()
        }}
      >
        POST{' '}
        <span className="text-white" aria-hidden="true">
          &rarr;
        </span>
      </button>
      {postResult.status != 'none' && (
        <p className="mt-2">{postResult.message}</p>
      )}
    </div>
  )
}
