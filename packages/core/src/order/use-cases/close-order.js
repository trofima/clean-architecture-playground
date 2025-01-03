export const CloseOrder = ({presentation, navigator, notifier}) => async () => {
  const {changes} = presentation.get()
  if (
    !Object.keys(changes).length
    || await notifier.confirm('Changes will be lost. Are you sure you want to close this order?', {type: 'warning'})
  ) {
    await navigator.close()
  }
}
