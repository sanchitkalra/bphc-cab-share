export const getDisplayDate = (dt: Date): string => {
  const day =
    dt.getDate().toString().length == 1 ? `0${dt.getDate()}` : dt.getDate()
  const month =
    (dt.getMonth() + 1).toString().length == 1
      ? `0${dt.getMonth() + 1}`
      : dt.getMonth() + 1
  const year = dt.getFullYear()

  return `${day}-${month}-${year}`
}

export const getDisplayTime = (dt: Date): string => {
  const hours =
    dt.getHours().toString().length == 1 ? `0${dt.getHours()}` : dt.getHours()
  const mins =
    dt.getMinutes().toString().length == 1
      ? `0${dt.getMinutes()}`
      : dt.getMinutes()

  return `${hours}:${mins}`
}
