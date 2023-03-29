import React, { useState } from 'react'

export default function SearchResult({
  processing,
  setProcessing,
  supabaseClient,
  user,
  result,
  dt,
  from,
  threshold
}: {
  processing: boolean
  setProcessing: any
  supabaseClient: any
  user: any
  result: any
  dt: any
  from: string
  threshold: string
}) {
  const [seatsRequested, setSeatsRequested] = useState<number>(1)
  const [seatSelectionMode, setSeatSelectionMode] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function sendResponse(postID: number, time: string, tolerance: number) {
    setProcessing(true)
    const { error } = await supabaseClient.from('ride_responses').insert({
      req_user_name: user?.user_metadata.full_name,
      req_user_email: user?.email,
      post_user_name: result.user_name,
      post_user_email: result.user_email,
      time: new Date(time).getTime(),
      tolerance,
      seats: seatsRequested,
      postID
    })

    setProcessing(false)
    setMessage('Request sent successfully!')

    console.log(error)
  }
  return (
    <div
      className="w-80 sm:w-96 mt-4 rounded shadow p-2 border-2"
      key={result.id}
    >
      <div className="flex flex-row justify-between mb-2">
        <div className="w-3/5 flex flex-col">
          <h3 className="font-semibold text-xl">
            {result.from} <span aria-hidden="true">&rarr;</span> {result.to}
          </h3>
          <h3>{result.user_name}</h3>
          <h3>
            {result.seats} seat{result.seats > 1 && 's'} available
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
          <h3 className="text-end">
            {result.tolerance > 0
              ? from === 'Campus'
                ? `ready to leave early by ${result.tolerance}m`
                : `waiting upto ${result.tolerance}m`
              : 'no waiting'}
          </h3>
        </div>
      </div>

      <div className="flex flex-row justify-end w-full">
        {seatSelectionMode ? (
          <div className="flex flex-col w-full">
            <div className="w-full justify-between flex flex-row items-center">
              <div className="flex flex-row">
                <p>Seats required:</p>
                <input
                  className="w-8 ml-3 font-semibold text-left focus:outline-0"
                  type="number"
                  placeholder="Eg. 60 MINUTES"
                  min={1}
                  max={result.seats}
                  value={seatsRequested}
                  onChange={(event) => {
                    setSeatsRequested(Number(event.target.value))
                    setError(null)
                    setMessage(null)
                  }}
                />
              </div>
              <button
                className="w-1/2 text-sm inline-block rounded bg-gray-800 px-0 py-0 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900"
                disabled={processing}
                onClick={(event) => {
                  event.preventDefault()

                  const hours =
                    dt.getHours().toString().length == 1
                      ? `0${dt.getHours()}`
                      : dt.getHours()

                  const minutes =
                    dt.getMinutes().toString().length == 1
                      ? `0${dt.getMinutes()}`
                      : dt.getMinutes()

                  if (seatsRequested > result.seats) {
                    setError(`Select upto ${result.seats} seats`)
                  } else if (seatsRequested <= 0) {
                    setError('Select a valid seat count')
                  } else {
                    setMessage('Requesting')
                    sendResponse(
                      result.id,
                      `${hours}:${minutes}`,
                      Number(threshold)
                    )
                  }
                }}
              >
                SEND REQUEST{' '}
                <span className="text-white" aria-hidden="true">
                  &rarr;
                </span>
              </button>
            </div>
            {error && <div className="mt-1 text-red-600 text-sm">{error}</div>}
            {message && <div className="mt-1 text-sm">{message}</div>}
          </div>
        ) : (
          <button
            className="w-full text-sm mt-2 inline-block rounded bg-gray-800 px-3 py-1 leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900"
            disabled={processing}
            onClick={(event) => {
              event.preventDefault()
              setSeatSelectionMode(true)
            }}
          >
            REQUEST{' '}
            <span className="text-white" aria-hidden="true">
              &rarr;
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
