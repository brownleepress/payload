import type { CollectionConfig } from 'payload'

let x = 0
export const InfinityLoop: CollectionConfig = {
  slug: 'infinity-loop',
  fields: [],
  hooks: {
    afterRead: [
      async ({ req, doc }) => {
        x++
        req.payload.logger.info(x)
        // fetch self
        await req.payload.findByID({ req, id: doc.id, collection: 'infinity-loop' })
      },
    ],
  },
}
