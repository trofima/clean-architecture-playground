export class DependencyError extends Error {
  constructor(message, {code, cause}) {
    super(message, {cause})
    this.code = code
  }
}