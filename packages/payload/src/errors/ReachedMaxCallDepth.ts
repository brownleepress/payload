import { APIError } from './APIError.js'

export class ReachedMaxCallDepth extends APIError {
  constructor() {
    super('no!')
  }
}
