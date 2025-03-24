export const CloseOrder = ({presentation, navigator, notifier}) => async () => {
  const {hasChanges} = presentation.get()
  if (hasChanges) {
    const confirmed = await notifier.confirm(
      'Changes will be lost. Are you sure you want to close this order?',
      {type: 'warning'},
    )
    if (!confirmed) return
  }
  await navigator.close()
}
