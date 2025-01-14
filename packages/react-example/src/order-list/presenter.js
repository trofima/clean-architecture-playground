export const presentOrderList = (presentation) => {
  const firstLoading = !presentation.list.length && presentation.loading
  return ({
    ...presentation,
    firstLoading,
    list: firstLoading
      ? Array(3).fill(undefined).map(makePlaceholderOrder)
      : presentation.list.map(({createdDate, sum, ...rest}) => ({
        ...rest,
        createdDate: formatDate(createdDate),
        sum: formatSum(sum),
      })),
  })
}

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')
  return `${date}, ${hours}:${minutes}`
}

const formatSum = (sum) => Number(sum).toFixed(2).toString()

const makePlaceholderOrder = (_, index) => ({
  id: `placeholder${index + 1}`,
  createdDate: '...',
  user: '...',
  sum: '...',
  paymentStatus: '...',
  fulfillmentStatus: '...',
})
