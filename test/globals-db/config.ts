import { buildConfigWithDefaults } from '../buildConfigWithDefaults'
import { devUser } from '../credentials'

export const doc = {
  id: -1,
  customData: true,
}
export const docs = [doc]

export const globalSlug = 'global-db'

let noGlobal = false
export const updateNoGlobal = (val: boolean) => {
  noGlobal = val
  return noGlobal
}

export let isInit = false
export const updateIsInit = (val: boolean) => {
  isInit = val
  return isInit
}

export let isConnect = false
export const updateIsConnect = (val: boolean) => {
  isConnect = val
  return isConnect
}
export default buildConfigWithDefaults({
  globals: [
    {
      slug: globalSlug,
      db: {
        init: async () => {
          updateIsInit(true)
          return Promise.resolve()
        },
        connect: async () => {
          updateIsConnect(true)
          return Promise.resolve()
        },
        // @ts-expect-error
        createGlobal: ({ slug, data, req }) => {
          return { ...doc, created: true }
        },
        // @ts-expect-error
        updateGlobal: ({ slug, data, req }) => {
          return { ...doc, updated: true }
        },
        // @ts-expect-error
        findGlobal: () => {
          if (noGlobal) return false
          return doc
        },
        // @ts-expect-error
        findGlobalVersions: () => {
          return { docs }
        },
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
  ],

  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
  },
})