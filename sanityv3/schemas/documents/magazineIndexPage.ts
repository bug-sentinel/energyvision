import blocksToText from '../../helpers/blocksToText'
import { configureBlockContent } from '../editors/blockContentType'
import CompactBlockEditor from '../components/CompactBlockEditor'
import MagazineFooterComponent from '../objects/magazineFooterComponent'
import { EdsIcon } from '../../icons'
import { bookmarks } from '@equinor/eds-icons'

import type { PortableTextBlock, Rule } from 'sanity'
import { lang } from './langField'
import { HeroTypes } from '../HeroTypes'
import { configureTitleBlockContent } from '../editors'
import { ValidationContext } from '../../types/schemaTypes'

const titleContentType = configureTitleBlockContent()

const textContentType = configureBlockContent({
  h2: true,
  h3: true,
  h4: false,
  externalLink: false,
  internalLink: true,
  lists: true,
  attachment: false,
})

export default {
  type: 'document',
  title: 'Magazine Index Page',
  name: 'magazineIndex',
  icon: () => EdsIcon(bookmarks),
  fieldsets: [
    {
      title: 'Header',
      name: 'header',
    },
    {
      title: 'SEO & metadata',
      name: 'metadata',
      description: 'This part is used for meta information when this content is used on the web',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    lang,
    {
      title: 'Meta information',
      name: 'seo',
      type: 'titleAndMeta',
      fieldset: 'metadata',
    },
    {
      title: 'Open Graph Image',
      name: 'openGraphImage',
      type: 'imageWithAlt',
      description: 'You can override the hero image as the SoMe image by uploading another image here.',
      fieldset: 'metadata',
    },
    {
      name: 'title',
      type: 'array',
      title: 'Title',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
      fieldset: 'header',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Type',
      name: 'heroType',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: HeroTypes.DEFAULT },
          { title: 'Full Image', value: HeroTypes.FULL_WIDTH_IMAGE },
          { title: 'Background image', value: HeroTypes.BACKGROUND_IMAGE },
        ].filter((e) => e),
      },
      initialValue: 'default',
      fieldset: 'header',
    },
    {
      title: 'Hero image',
      name: 'heroFigure',
      type: 'imageWithAltAndCaption',
      fieldset: 'header',
    },
    {
      title: 'Hero image ratio',
      name: 'heroRatio',
      type: 'string',
      options: {
        list: [
          { title: 'Tall', value: 'tall' },
          { title: '2:1(deprecated)', value: '0.5' },
          { title: 'Narrow', value: 'narrow' },
        ],
      },
      hidden: ({ parent }: DocumentType) => {
        return parent?.heroType !== HeroTypes.FULL_WIDTH_IMAGE
      },
      validation: (Rule: Rule) =>
        Rule.custom((value: string, context: ValidationContext) => {
          const { parent } = context as unknown as DocumentType
          if (parent?.heroType === HeroTypes.FULL_WIDTH_IMAGE && !value) return 'Field is required'
          return true
        }),
      initialValue: '0.5',
      fieldset: 'header',
    },
    {
      title: 'Text',
      name: 'ingress',
      type: 'array',
      of: [textContentType],
      fieldset: 'header',
    },
    {
      title: 'Ingress Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'ingressBackground',
      type: 'colorlist',
      fieldset: 'header',
    },
    {
      title: 'Promoted Magazine Tags',
      name: 'promotedMagazineTags',
      description: 'Place the magazine tags in the correct order',
      type: 'array',
      of: [
        {
          title: 'Magazine Tag',
          type: 'reference',
          to: [{ type: 'magazineTag' }],
          options: {
            // Disable new since this button does not work with dynamic initial
            // values  :(
            disableNew: true,
          },
        },
      ],
      validation: (Rule: Rule) => Rule.unique().min(5).max(5),
    },
    MagazineFooterComponent,
  ],
  preview: {
    select: {
      title: 'title',
      ingress: 'ingress',
    },
    prepare({ title, ingress }: { title: PortableTextBlock[]; ingress: PortableTextBlock[] }) {
      const plainTitle = title ? blocksToText(title) : ''

      return {
        title: plainTitle,
        subtitle: blocksToText(ingress) || '',
      }
    },
  },
}
