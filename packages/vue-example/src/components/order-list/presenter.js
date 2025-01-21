export const presentOrderList = (presentation) => {
  return ({
    ...presentation,
    list: presentation.loading && !presentation.list.length ? renderSkeletonOrders() : presentation.list.map(({createdDate, sum, ...rest}) => ({
      ...rest,
      createdDate: formatDate(createdDate),
      sum: formatSum(sum),
    })),
  })
}

const renderSkeletonOrders = () => Array(3).fill(undefined).map((_, index) => ({
  id: `placeholder${index}`,
  createdDate: '...',
  user: '...',
  sum: '...',
  paymentStatus: '...',
  fulfillmentStatus: '...',
}))

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')
  return `${date}, ${hours}:${minutes}`
}

const formatSum = (sum) => Number(sum).toFixed(2).toString()
