import type { I18nClient } from '@payloadcms/translations'
import type {
  ArrayField as ArrayFieldT,
  ClientConfig,
  ClientField,
  ClientSlotProps,
  FieldPermissions,
  FieldRow,
  FieldSlots,
  FieldTypes,
  FormField,
  FormState,
  ImportMap,
  Payload,
  RenderFieldFn,
  RenderFieldsFn,
  Row,
  SanitizedConfig,
  ServerSlotProps,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  ArrayField,
  BlocksField,
  CheckboxField,
  CodeField,
  CollapsibleField,
  ConfirmPasswordField,
  DateTimeField,
  EmailField,
  FieldDescription,
  FieldLabel,
  GroupField,
  HiddenField,
  JoinField,
  JSONField,
  NumberField,
  PasswordField,
  PointField,
  RadioGroupField,
  RelationshipField,
  RichTextField,
  RowField,
  RowLabel,
  SelectField,
  TabsField,
  TextareaField,
  TextField,
  UIField,
  UploadField,
} from '@payloadcms/ui'

import { RenderServerComponent } from '../elements/RenderServerComponent/index.js'

export type FieldTypesComponents = {
  [K in 'confirmPassword' | 'hidden' | 'password' | FieldTypes]: React.FC
}

const fieldComponents: FieldTypesComponents = {
  array: ArrayField,
  blocks: BlocksField,
  checkbox: CheckboxField,
  code: CodeField,
  collapsible: CollapsibleField,
  confirmPassword: ConfirmPasswordField,
  date: DateTimeField,
  email: EmailField,
  group: GroupField,
  hidden: HiddenField,
  join: JoinField,
  json: JSONField,
  number: NumberField,
  password: PasswordField,
  point: PointField,
  radio: RadioGroupField,
  relationship: RelationshipField,
  richText: RichTextField,
  row: RowField,
  select: SelectField,
  tabs: TabsField,
  text: TextField,
  textarea: TextareaField,
  ui: UIField,
  upload: UploadField,
}

import { fieldAffectsData } from 'payload/shared'
import React from 'react'

export const renderFields: RenderFieldsFn = (args) => {
  const {
    className,
    clientConfig,
    clientFields,
    config,
    fields,
    forceRender,
    formState,
    i18n,
    importMap,
    indexPath,
    margins,
    path: parentPath,
    payload,
    permissions,
    schemaPath,
  } = args

  if (!fields || (Array.isArray(fields) && fields.length === 0)) {
    return null
  }

  if (fields) {
    return fields?.map((field, fieldIndex) => {
      const clientField = clientFields[fieldIndex]

      const forceRenderChildren =
        (typeof forceRender === 'number' && fieldIndex <= forceRender) || true

      const name = 'name' in field ? field.name : undefined

      const fieldPermissions = permissions?.[name]

      if (
        fieldPermissions?.read?.permission === false ||
        (field.admin && 'disabled' in field.admin && field.admin.disabled)
      ) {
        return null
      }

      const isHidden = 'hidden' in field && field?.hidden

      const disabledFromAdmin = field?.admin && 'disabled' in field.admin && field.admin.disabled

      if (fieldAffectsData(field) && (isHidden || disabledFromAdmin)) {
        return null
      }

      const fieldIndexPath =
        indexPath !== undefined ? `${indexPath}.${fieldIndex}` : `${fieldIndex}`

      const path = [parentPath, name].filter(Boolean).join('.')

      const fieldSchemaPath = [schemaPath, name].filter(Boolean).join('.')

      return renderField({
        className,
        clientConfig,
        clientField,
        config,
        field,
        fieldPermissions,
        forceRender: forceRenderChildren,
        formState,
        i18n,
        importMap,
        indexPath: fieldIndexPath,
        margins,
        path,
        payload,
        permissions,
        renderFields,
        schemaPath: fieldSchemaPath,
      })
    })
  }

  return null
}

export const renderFieldRows = ({
  className,
  clientConfig,
  clientField,
  clientProps,
  config,
  field,
  forceRender,
  formState,
  i18n,
  importMap,
  indexPath,
  margins,
  path,
  payload,
  permissions,
  rows,
  schemaPath,
  serverProps,
}: {
  readonly className?: string
  readonly clientConfig: ClientConfig
  readonly clientField: ClientField
  readonly clientProps?: ClientSlotProps
  readonly config: SanitizedConfig
  readonly field: ArrayFieldT
  readonly fieldState: FormField
  readonly forceRender?: boolean
  readonly formState: FormState
  readonly i18n: I18nClient
  readonly importMap: ImportMap
  readonly indexPath: string
  readonly margins?: 'small' | false
  readonly path: string
  readonly payload: Payload
  readonly permissions?: {
    [fieldName: string]: FieldPermissions
  }
  readonly rows: Row[]
  readonly schemaPath: string
  readonly serverProps?: ServerSlotProps
}): FieldRow[] =>
  rows?.map((row, rowIndex) => ({
    Fields: renderFields({
      className,
      clientConfig,
      clientFields: 'fields' in clientField ? clientField.fields : undefined,
      config,
      fields: field.fields,
      forceRender,
      formState,
      i18n,
      importMap,
      indexPath: `${indexPath}.${rowIndex}`,
      margins,
      path: `${path}.${rowIndex}`,
      payload,
      permissions,
      schemaPath,
    }),
    RowLabel: (
      <RenderServerComponent
        clientProps={{
          ...clientProps,
          rowLabel: `${getTranslation(field.labels.singular, i18n)} ${String(rowIndex + 1).padStart(
            2,
            '0',
          )}`,
          rowNumber: rowIndex + 1,
        }}
        Component={field.admin?.components?.RowLabel}
        Fallback={RowLabel}
        importMap={importMap}
        serverProps={serverProps}
      />
    ),
  }))

export const renderField: RenderFieldFn = (args) => {
  const {
    className,
    clientConfig,
    clientField,
    config,
    field,
    fieldPermissions,
    forceRender,
    formState,
    i18n,
    importMap,
    indexPath,
    margins,
    path,
    payload,
    permissions,
    readOnly,
    schemaPath,
  } = args
  const isHidden = 'admin' in field && 'hidden' in field.admin && field.admin.hidden

  const fieldState = formState[path]

  let clientProps: ClientSlotProps = {
    field: clientField,
    fieldState,
    path,
    permissions: fieldPermissions,
    readOnly,
    schemaPath,
  }

  const serverProps: ServerSlotProps = {
    clientField,
    config,
    field,
    i18n,
    indexPath,
    payload,
  }

  const fieldSlots: FieldSlots = {}

  if ('label' in field) {
    fieldSlots.Label = (
      <FieldLabel
        label={
          typeof field.label === 'string' || typeof field.label === 'object'
            ? field.label
            : typeof field.label === 'function'
              ? field.label({ t: i18n.t })
              : ''
        }
        required={'required' in field && field.required}
      />
    )
  }

  switch (field.type) {
    case 'array': {
      fieldSlots.rows = renderFieldRows({
        ...args,
        field,
        fieldState,
        rows: fieldState?.rows,
      })
      break
    }

    case 'blocks': {
      clientProps.Blocks = fieldState?.rows?.map((row, rowIndex) => {
        const blockConfig = field.blocks.find((block) => block.slug === row.blockType)

        const clientBlockConfig =
          'blocks' in clientField &&
          clientField.blocks.find((block) => block.slug === row.blockType)

        return renderFields({
          className,
          clientConfig,
          clientFields: clientBlockConfig?.fields,
          config,
          fields: blockConfig?.fields,
          forceRender,
          formState,
          i18n,
          importMap,
          indexPath: `${indexPath}.${rowIndex}`,
          margins,
          path,
          payload,
          permissions,
          schemaPath,
        })
      })

      break
    }

    case 'group':
    case 'collapsible': {
      clientProps.Fields = renderFields({
        className,
        clientConfig,
        clientFields: 'fields' in clientField ? clientField.fields : undefined,
        config,
        fields: field.fields,
        forceRender,
        formState,
        i18n,
        importMap,
        indexPath,
        margins,
        path,
        payload,
        permissions,
        schemaPath,
      })

      break
    }

    case 'tabs': {
      clientProps.Fields = field.tabs.map((tab, tabIndex) => {
        const clientTabConfig = 'tabs' in clientField && clientField.tabs[tabIndex]

        return renderFields({
          className,
          clientConfig,
          clientFields: 'fields' in clientTabConfig ? clientTabConfig.fields : undefined,
          config,
          fields: tab.fields,
          forceRender,
          formState,
          i18n,
          importMap,
          indexPath: `${indexPath}.${tabIndex}`,
          margins,
          path,
          payload,
          permissions,
          schemaPath,
        })
      })

      break
    }

    default: {
      break
    }
  }

  if (field.admin) {
    if ('description' in field.admin) {
      fieldSlots.Description = (
        <FieldDescription
          description={
            typeof field.admin?.description === 'string' ||
            typeof field.admin?.description === 'object'
              ? field.admin.description
              : typeof field.admin?.description === 'function'
                ? field.admin?.description({ t: i18n.t })
                : ''
          }
          path={path}
        />
      )
    }

    if (field.admin?.components) {
      if ('afterInput' in field.admin.components) {
        fieldSlots.AfterInput = (
          <RenderServerComponent
            clientProps={clientProps}
            Component={field.admin.components.afterInput}
            importMap={importMap}
            key="field.admin.components.afterInput"
            serverProps={serverProps}
          />
        )
      }

      if ('beforeInput' in field.admin.components) {
        fieldSlots.BeforeInput = (
          <RenderServerComponent
            clientProps={clientProps}
            Component={field.admin.components.beforeInput}
            importMap={importMap}
            key="field.admin.components.beforeInput"
            serverProps={serverProps}
          />
        )
      }

      if ('Description' in field.admin.components) {
        fieldSlots.Description = (
          <RenderServerComponent
            clientProps={clientProps}
            Component={field.admin.components.Description}
            importMap={importMap}
            key="field.admin.components.Description"
            serverProps={serverProps}
          />
        )
      }

      if ('Error' in field.admin.components) {
        fieldSlots.Error = (
          <RenderServerComponent
            clientProps={clientProps}
            Component={field.admin.components.Error}
            importMap={importMap}
            key="field.admin.components.Error"
            serverProps={serverProps}
          />
        )
      }

      if ('Label' in field.admin.components) {
        fieldSlots.Label = (
          <RenderServerComponent
            clientProps={clientProps}
            Component={field.admin.components.Label}
            importMap={importMap}
            key="field.admin.components.Label"
            serverProps={serverProps}
          />
        )
      }
    }
  }

  clientProps = {
    ...clientProps,
    ...fieldSlots,
  }

  return (
    <RenderServerComponent
      clientProps={clientProps}
      Component={isHidden ? HiddenField : field.admin?.components?.Field}
      Fallback={fieldComponents?.[field?.type]}
      importMap={importMap}
      serverProps={serverProps}
    />
  )
}