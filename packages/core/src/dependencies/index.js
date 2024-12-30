export class DependencyError extends Error {
  constructor(message, {code, cause}) {
    super(message, {cause})
    this.code = code
  }
}

export class DataStoreError extends DependencyError {}

export class NavigatorError extends DependencyError {}
