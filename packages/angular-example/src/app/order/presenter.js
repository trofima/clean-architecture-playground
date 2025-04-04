export const presentOrder = (presentation) => {
  const dataIsEmpty = Object.keys(presentation.data).length === 0
  const {createdDate, updatedDate, sum, user, ...rest} = presentation.data
  return ({
    ...presentation,
    dataIsEmpty,
    data: dataIsEmpty
      ? {}
      : {
        ...rest,
        user: user.name,
        billingAddress: user.billingAddress,
        createdDate: formatDate(createdDate),
        updatedDate: formatDate(updatedDate),
        sum: formatSum(sum),
      },
  })
}

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')
  return `${date}, ${hours}:${minutes}`
}

const formatSum = (sum) => Number(sum).toFixed(2).toString()
