import Head from 'next/head'
import { Inter } from '@next/font/google'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const inter = Inter({ subsets: ['latin'] })

const people: { id: number; name: string }[] = [
  { id: 1, name: 'Airport' },
  { id: 2, name: 'Railway Station' },
  { id: 3, name: 'Campus' }
]

type ISearch = {
  from: string
  to: string
  on: string
  at: string
  threshold: number
}

export default function Home() {
  const supabaseClient = useSupabaseClient()
  const user = useUser()

  const [search, setSearch] = useState<ISearch>({
    from: '',
    to: '',
    on: (() => {
      const date = new Date()
      const month = date.getMonth() + 1
      const day = date.getDay() + 1
      return `${date.getFullYear()}-${
        month.toString().length == 1 ? `0${month}` : month
      }-${day.toString().length == 1 ? `0${day}` : day}`
    })(),
    at: (() => {
      const date = new Date()
      return `${
        date.getHours().toString().length == 1
          ? `0${date.getHours()}`
          : date.getHours()
      }:${
        date.getMinutes().toString().length == 1
          ? `0${date.getMinutes()}`
          : date.getMinutes()
      }`
    })(),
    threshold: 0
  })

  useEffect(() => {
    console.log(search)
  }, [search])

  const [selected, setSelected] = useState(people[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <>
      <Head>
        <title>BPHC Cab Sharing</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center mb-6">
        <h1 className="text-4xl md:text-6xl text-center mt-6 font-bold">
          Find a cab and fast
        </h1>

        <div className="flex flex-col md:flex-row justify-center mt-12">
          <div className="border-2 p-2 rounded m-2">
            <h2 className="text-xl text-left">FROM</h2>
            {/* <h2 className="w-72 font-semibold text-3xl text-left">AIRPORT</h2> */}
            {/* <input
              className="w-72 font-semibold text-3xl text-left focus:outline-0"
              type="text"
              placeholder="AIRPORT"
              value={search.from}
              onChange={(event) =>
                setSearch({ ...search, from: event.target.value })
              }
            /> */}
            <Combobox value={selected} onChange={setSelected}>
              <div className="relative mt-1 w-72">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left sm:text-sm focus:ring-0">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-xl font-semibold leading-5 text-gray-900 focus:ring-0"
                    displayValue={(person: { id: number; name: string }) =>
                      person.name
                    }
                    onChange={(event) => setQuery(event.target.value)}
                    style={{ outline: 'none' }}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
                >
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredPeople.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredPeople.map((person) => (
                        <Combobox.Option
                          key={person.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-900'
                            }`
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {person.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? 'text-white' : 'text-teal-600'
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <div className="border-2 p-2 rounded m-2">
            <h2 className="text-xl text-left">TO</h2>
            {/* <h2 className="w-72 font-semibold text-3xl text-left">CAMPUS</h2> */}
            {/* <input
              className="w-72 font-semibold text-3xl text-left focus:outline-0"
              type="text"
              placeholder="CAMPUS"
              value={search.to}
              onChange={(event) =>
                setSearch({ ...search, to: event.target.value })
              }
            /> */}
            <Combobox value={selected} onChange={setSelected}>
              <div className="relative mt-1 w-72">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left sm:text-sm focus:ring-0">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-xl font-semibold leading-5 text-gray-900 focus:ring-0"
                    displayValue={(person: { id: number; name: string }) =>
                      person.name
                    }
                    onChange={(event) => setQuery(event.target.value)}
                    style={{ outline: 'none' }}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
                >
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredPeople.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredPeople.map((person) => (
                        <Combobox.Option
                          key={person.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-900'
                            }`
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {person.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? 'text-white' : 'text-teal-600'
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center md:mt-6">
          <div className="border-2 p-2 rounded m-2">
            <h2 className="text-xl text-left">ON</h2>
            {/* <h2 className="w-72 font-semibold text-3xl text-left">
              15th Jan 2022
            </h2> */}
            <input
              className="w-72 font-semibold text-3xl text-left focus:outline-0"
              type="date"
              placeholder="15th Jan 2022"
              value={search.on}
              onChange={(event) =>
                setSearch({ ...search, on: event.target.value })
              }
            />
          </div>
          <div className="border-2 p-2 rounded m-2">
            <h2 className="text-xl text-left">AT</h2>
            {/* <h2 className="w-72 font-semibold text-3xl text-left">5:00PM</h2> */}
            <input
              className="w-72 font-semibold text-3xl text-left focus:outline-0"
              type="time"
              placeholder="5:00PM"
              value={search.at}
              onChange={(event) =>
                setSearch({ ...search, at: event.target.value })
              }
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center md:mt-6">
          <div className="border-2 p-2 rounded m-2">
            <h2 className="text-xl text-left">WAITING/LEAVING EARLY UPTO</h2>
            {/* <h2 className="w-72 font-semibold text-3xl text-left">
              60 MINUTES
            </h2> */}
            <div className="flex flex-row items-center">
              <input
                className="w-16 font-semibold text-3xl text-left focus:outline-0"
                type="number"
                placeholder="Eg. 60 MINUTES"
                value={search.threshold}
                onChange={(event) =>
                  setSearch({
                    ...search,
                    threshold: Number(event.target.value)
                  })
                }
              />
              <h2>MINUTES</h2>
            </div>
          </div>
        </div>
        <button className="mt-4 inline-block rounded-lg bg-gray-800 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-gray-800 hover:bg-gray-900 hover:ring-gray-900">
          SEARCH{' '}
          <span className="text-white" aria-hidden="true">
            &rarr;
          </span>
        </button>
      </main>
    </>
  )
}
