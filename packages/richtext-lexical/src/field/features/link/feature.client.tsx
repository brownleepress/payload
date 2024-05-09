'use client'

import type { LexicalNode } from 'lexical'

import { $findMatchingParent } from '@lexical/utils'
import { $getSelection, $isRangeSelection } from 'lexical'

import type { ToolbarGroup } from '../toolbars/types.js'
import type { FeatureProviderProviderClient } from '../types.js'
import type { ExclusiveLinkCollectionsProps } from './feature.server.js'
import type { LinkFields } from './nodes/types.js'

import { LinkIcon } from '../../lexical/ui/icons/Link/index.js'
import { getSelectedNode } from '../../lexical/utils/getSelectedNode.js'
import { createClientComponent } from '../createClientComponent.js'
import { toolbarFeatureButtonsGroupWithItems } from '../shared/toolbar/featureButtonsGroup.js'
import { AutoLinkNode } from './nodes/AutoLinkNode.js'
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from './nodes/LinkNode.js'
import { AutoLinkPlugin } from './plugins/autoLink/index.js'
import { ClickableLinkPlugin } from './plugins/clickableLink/index.js'
import { TOGGLE_LINK_WITH_MODAL_COMMAND } from './plugins/floatingLinkEditor/LinkEditor/commands.js'
import { FloatingLinkEditorPlugin } from './plugins/floatingLinkEditor/index.js'
import { LinkPlugin } from './plugins/link/index.js'

export type ClientProps = ExclusiveLinkCollectionsProps

const toolbarGroups: ToolbarGroup[] = [
  toolbarFeatureButtonsGroupWithItems([
    {
      ChildComponent: LinkIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection)) {
          const selectedNode = getSelectedNode(selection)
          const linkParent = $findMatchingParent(selectedNode, $isLinkNode)
          return linkParent != null
        }
        return false
      },
      isEnabled: ({ selection }) => {
        return !!($isRangeSelection(selection) && $getSelection()?.getTextContent()?.length)
      },
      key: 'link',
      label: `Link`,
      onSelect: ({ editor, isActive }) => {
        if (!isActive) {
          let selectedText: string = null
          let selectedNodes: LexicalNode[] = []
          editor.getEditorState().read(() => {
            selectedText = $getSelection()?.getTextContent()
            // We need to selected nodes here before the drawer opens, as clicking around in the drawer may change the original selection
            selectedNodes = $getSelection()?.getNodes() ?? []
          })

          if (!selectedText?.length) {
            return
          }

          const linkFields: LinkFields = {
            doc: null,
            linkType: 'custom',
            newTab: false,
            url: 'https://',
          }

          editor.dispatchCommand(TOGGLE_LINK_WITH_MODAL_COMMAND, {
            fields: linkFields,
            selectedNodes,
            text: selectedText,
          })
        } else {
          // remove link
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
        }
      },
      order: 1,
    },
  ]),
]

const LinkFeatureClient: FeatureProviderProviderClient<ClientProps> = (props) => {
  return {
    clientFeatureProps: props,
    feature: () => ({
      clientFeatureProps: props,
      nodes: [LinkNode, AutoLinkNode],
      plugins: [
        {
          Component: LinkPlugin,
          position: 'normal',
        },
        {
          Component: AutoLinkPlugin,
          position: 'normal',
        },
        {
          Component: ClickableLinkPlugin,
          position: 'normal',
        },
        {
          Component: FloatingLinkEditorPlugin,
          position: 'floatingAnchorElem',
        },
      ],
      toolbarFixed: {
        groups: toolbarGroups,
      },
      toolbarInline: {
        groups: toolbarGroups,
      },
    }),
  }
}

export const LinkFeatureClientComponent = createClientComponent(LinkFeatureClient)