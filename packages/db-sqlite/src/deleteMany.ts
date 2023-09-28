import type { DeleteMany } from 'payload/database'
import type { PayloadRequest } from 'payload/types'

import { inArray } from 'drizzle-orm'
import toSnakeCase from 'to-snake-case'

import type { SQLiteAdapter } from './types'

import { findMany } from './find/findMany'

export const deleteMany: DeleteMany = async function deleteMany (
  this: SQLiteAdapter,
  { collection, req = {} as PayloadRequest, where },
) {
  const db = this.sessions[req.transactionID]?.db || this.db
  const collectionConfig = this.payload.collections[collection].config
  const tableName = toSnakeCase(collection)

  const result = await findMany({
    adapter: this,
    fields: collectionConfig.fields,
    limit: 0,
    locale: req.locale,
    page: 1,
    pagination: false,
    req,
    tableName,
    where,
  })

  const ids = []

  result.docs.forEach((data) => {
    ids.push(data.id)
  })

  if (ids.length > 0) {
    await db.delete(this.tables[tableName]).where(inArray(this.tables[tableName].id, ids))
  }

  return result
}
