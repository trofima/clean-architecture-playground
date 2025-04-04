export const presentOrderList = (presentation) => ({
  ...presentation,
  list: presentation.loading && !presentation.list?.length
    ? Array(3).fill(emptyOrderPresentation)
    : presentation.list.map(({createdDate, sum, ...rest}) => ({
      ...rest,
      createdDate: formatDate(createdDate),
      sum: formatSum(sum),
    })),
})

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')
  return `${date}, ${hours}:${minutes}`
}

const formatSum = (sum) => Number(sum).toFixed(2).toString()

const emptyOrderPresentation = {createdDate: '...', user: '...', sum: '...', paymentStatus: '...', fulfillmentStatus: '...'}
