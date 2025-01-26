export const CloseOrder = ({presentation, navigator, notifier}) => async () => {
  const {hasChanges} = presentation.get()
  if (
    !hasChanges
    || await notifier.confirm(
      'Changes will be lost. Are you sure you want to close this order?',
      {type: 'warning'},
    )
  )
    await navigator.close()

}
