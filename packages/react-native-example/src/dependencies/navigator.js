import {useMemo} from 'react';
import {useNavigation, usePreventRemove} from '@react-navigation/native';

const parseQueryEntry = (rawEntry) => {
  const [key, value] = rawEntry.split('=')
  return {[decodeURIComponent(key)]: decodeURIComponent(value ?? '')}
}

const ReactNativeNavigator = (navigation, preventedClosing) => {
  return {
    ...navigation,
    open: (name, _params) => {
      const [route, rawQueryParams] = name.split('?')
      const rawQueryEntries = rawQueryParams.split('&')
      const queryParams = rawQueryEntries.reduce((acc, rawEntry) => ({
        ...acc,
        ...parseQueryEntry(rawEntry),
      }), {})

      return navigation.navigate(route, queryParams)
    },
    close: () => preventedClosing.close(),
    onClose: (handler) => preventedClosing.handle = handler
  }
}

const useInvertedNavigation = () => {
  const navigation = useNavigation()
  const preventedClosing = useMemo(() => ({
    close: navigation.goBack,
    handle: undefined,
  }), [navigation])

  usePreventRemove(true, ({data}) => {
    const proceedClosing = () => navigation.dispatch(data.action)
    if (data.action.type === 'POP') {
      // in scenario: make changes ->press back->confirmation cancel->press save: 
      // it will override close from navigation.goBack (GO_BACK event) to navigation.dispatch(data.action) (POP event).
      // it will still work, but dispatching POP event instead of GO_BACK.
      // not important for this example, but a bit inconsistent.
      // i have no idea how to invert this crap better. rnn and hooks are evil.
      preventedClosing.close = proceedClosing
      preventedClosing.handle?.() ?? proceedClosing()
    } else proceedClosing()
  })

  const navigator = useMemo(() => ReactNativeNavigator(navigation, preventedClosing), [navigation])
  return navigator
}

export const withNavigator = (Component) => (props) => (
  <Component {...props} navigator={useInvertedNavigation()} />
)
