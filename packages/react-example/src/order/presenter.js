export const presentOrder = ({loading, error, data, hasChanges}) => ({
  backButton: {
    label: 'Back',
    disabled: loading,
  },
  saveButton: {
    label: 'Save',
    disabled: !hasChanges,
  },
  data: isEmpty(data)
    ? error
      ? presentError(error)
      : loading
        ? presentLoader()
        : presentError({message: 'Order is empty', code: 'should never happen, fire your server devs'})
    : presentContent(data)
})

const presentLoader = () => ({
  state: 'loading',
  text: 'Loading...',
})

const presentError = (error) => ({
  state: 'error',
  title: 'Order loading failed with error',
  description: `${error.message} (${error.code})`,
})

const presentContent = ({createdDate, updatedDate, sum, user, ...rest}) => ({
  ...rest,
  state: 'content',
  user: user?.name,
  billingAddress: user?.billingAddress,
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

const isEmpty = (data) => !Object.keys(data).length
