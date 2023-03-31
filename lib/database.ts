import { ParsedUrlQuery } from 'querystring'

export const validateSearch = (search: ParsedUrlQuery) => {
  return (
    search.from && search.to && search.threshold && search.date && search.time
  )
}

export const getSearchParams = (
  search: ParsedUrlQuery
): { lowerLimit: number; upperLimit: number; searchDateTime: number } => {
  const searchDateTime = new Date(`${search.date}T${search.time}:00`)
  const sDT = searchDateTime.getTime()

  let lowerLimit, upperLimit

  if (search.from === 'Campus') {
    lowerLimit = searchDateTime.getTime() - Number(search.threshold) * 60 * 1000
    upperLimit = searchDateTime.getTime()
  } else {
    lowerLimit = searchDateTime.getTime()
    upperLimit = searchDateTime.getTime() + Number(search.threshold) * 60 * 1000
  }

  return { lowerLimit, upperLimit, searchDateTime: sDT }
}
