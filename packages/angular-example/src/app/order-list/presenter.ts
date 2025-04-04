export const presentOrderList = (presentation: any) => ({
  ...presentation,
  list: presentation.list.map(({createdDate, sum, ...rest}: any) => ({
    ...rest,
    createdDate: formatDate(createdDate),
    sum: formatSum(sum),
  })),
})

const formatDate = (isoDate: string) => {
  if (!isoDate) return ''
  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')
  return `${date}, ${hours}:${minutes}`
}

const formatSum = (sum: number) => Number(sum).toFixed(2).toString()
