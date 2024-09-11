import { ComponentType } from 'react'
import { BlockAnnotationProps, Rule } from 'sanity'
import { EdsIcon, IconSubScript, IconSuperScript } from '../../icons'
import { SubScriptRenderer, SuperScriptRenderer } from '../components'
import { star_filled } from '@equinor/eds-icons'

// redeclare the type of the props to include the value.marker or add the prop type via extension
declare module 'sanity' {
  interface PortableTextObject {
    marker?: string
  }
}

export const FootnoteRenderer: ComponentType<BlockAnnotationProps> = (props) => {
  const { value, renderDefault } = props
  const { marker } = value
  return (
    <span>
      {renderDefault(props)}
      {marker && <span style={{ verticalAlign: 'super', fontSize: '0.8rem' }}>{marker}</span>}
    </span>
  )
}

export type Footnote = {
  _type: 'footnote'
}

export default {
  name: 'footnote',
  type: 'object',
  title: 'Footnote',
  icon: EdsIcon(star_filled),
  fields: [
    {
      name: 'marker',
      title: 'Marker',
      description: 'Enter the footnote marker as asteriks or number',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              {
                title: 'Sub',
                value: 'sub',
                icon: IconSubScript,
                component: SubScriptRenderer,
              },
              {
                title: 'Super',
                value: 'sup',
                icon: IconSuperScript,
                component: SuperScriptRenderer,
              },
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  components: {
    annotation: FootnoteRenderer,
  },
}
