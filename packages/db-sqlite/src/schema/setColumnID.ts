import type { SQLiteColumnBuilder } from 'drizzle-orm/sqlite-core'

import { integer, numeric, text } from 'drizzle-orm/sqlite-core'
import { type Field, flattenTopLevelFields } from 'payload'
import { fieldAffectsData } from 'payload/shared'

import type { IDType } from '../types.js'

type Args = {
  autoIncrement: boolean
  columns: Record<string, SQLiteColumnBuilder>
  fields: Field[]
}
export const setColumnID = ({ autoIncrement, columns, fields }: Args): IDType => {
  const idField = flattenTopLevelFields(fields).find(
    (field) => fieldAffectsData(field) && field.name === 'id',
  )
  if (idField) {
    if (idField.type === 'number') {
      columns.id = numeric('id').primaryKey()
      return 'numeric'
    }

    if (idField.type === 'text') {
      columns.id = text('id').primaryKey()
      return 'text'
    }
  }

  columns.id = integer('id').primaryKey({ autoIncrement })
  return 'integer'
}
