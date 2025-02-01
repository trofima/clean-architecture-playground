export const presentOrder = (presentation: any) => {
  const {createdDate, updatedDate, sum, user, ...rest} = presentation.data
  return ({
    ...presentation,
    data: {
      ...rest,
      user: user.name,
      billingAddress: user.billingAddress,
      createdDate: formatDate(createdDate),
      updatedDate: formatDate(updatedDate),
      sum: formatSum(sum),
    },
  })
}

const formatDate = (isoDate: string) => {
  if (!isoDate) return ''
  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')
  return `${date}, ${hours}:${minutes}`
}

const formatSum = (sum: number) => Number(sum).toFixed(2).toString()
