export const presentOrder = ({data, loading, error}) => {
  const dataIsEmpty = !Object.keys(data).length

  return {
    state: !dataIsEmpty
      ? 'content'
      : error
        ? 'error'
        : 'loading',
    controls: {
      backDisabled: loading,
      saveDisabled: dataIsEmpty || loading,
    },
    data: !dataIsEmpty ? formatData(data) : undefined,
  }
}

const formatData = ({user, createdDate, updatedDate, sum, ...rest}) => ({
  ...rest,
  user: user.name,
  billingAddress: user.billingAddress,
  createdDate: formatDate(createdDate),
  updatedDate: formatDate(updatedDate),
  sum: formatSum(sum),
})

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')
  return `${date}, ${hours}:${minutes}`
}

const formatSum = (sum) => Number(sum).toFixed(2).toString()
