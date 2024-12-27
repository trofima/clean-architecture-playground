export const presentOrderList = (presentation) => ({
  ...presentation,
  list: presentation.list.map(({createdDate, ...rest}) => {
    const [date, time] = createdDate.split('T')
    const [hours, minutes] = time.split(':')
    return {...rest, createdDate: `${date}, ${hours}:${minutes}`}
  }),
})
