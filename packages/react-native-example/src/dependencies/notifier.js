import {Alert} from 'react-native'
export class Notifier {
  constructor({appScreen}) {
    this.#appScreen = appScreen
  }

  showNotification({message}) {
    this.#appScreen.showToast({message, position: 'bottom'})
  }

  confirm(message, {type}) {
    return new Promise((resolve) => {
      Alert.alert(message, '', [
        {text: 'No', onPress: () => resolve(false), style: 'cancel'},
        {text: 'Yes', style: type === 'danger' ? 'destructive' : 'default', onPress: () => resolve(true)},
      ]);
    })
  }

  #appScreen
}