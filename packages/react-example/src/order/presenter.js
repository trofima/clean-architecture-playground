export const PresentOrder = (formatters) => ({loading, error, data, hasChanges}) => ({
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
    : presentContent(data, formatters)
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

const presentContent = ({createdDate, updatedDate, sum, user, ...rest}, {formatTime, formatNumber}) => ({
  ...rest,
  state: 'content',
  user: user?.name,
  billingAddress: user?.billingAddress,
  createdDate: createdDate ? formatTime(createdDate) : '',
  updatedDate: updatedDate ? formatTime(updatedDate) : '',
  sum: formatNumber(sum),
})

const isEmpty = (data) => !Object.keys(data).length
