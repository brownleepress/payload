import { AsyncLocalStorage } from 'async_hooks'

import type { Payload } from '../types/index.js'

import { ReachedMaxCallDepth } from '../errors/index.js'

const callDepthAsl = new AsyncLocalStorage<{ currentDepth: number }>()

export const enforceCallDepth = <
  T extends (payload: Payload, options: unknown) => Promise<unknown>,
>(
  operation: T,
): T => {
  const withEnforcedCallDepth = async (payload: Payload, options: unknown) => {
    const store = callDepthAsl.getStore()

    return callDepthAsl.run({ currentDepth: store?.currentDepth ?? 0 }, async () => {
      const store = callDepthAsl.getStore()
      store.currentDepth++
      if (store.currentDepth > payload.config.maxCallDepth) {
        throw new ReachedMaxCallDepth(payload.config.maxCallDepth)
      }

      return operation(payload, options)
    })
  }

  return withEnforcedCallDepth as T
}
