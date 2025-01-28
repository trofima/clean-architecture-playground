import {DataStore, dummyData} from '@clean-architecture-playground/core/dummy-dependencies'

export class InMemoryDataStore extends DataStore {
  getFromStorage(key) {
    return this.#data[key]
  }

  setToStorage(key, entities) {
    this.#data[key] = entities
  }

  #data = {...dummyData}
}
