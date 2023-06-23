import { play_circle } from '@equinor/eds-icons'
import { EdsIcon } from '../../icons'

import { configureTitleBlockContent } from '../editors'
import CompactBlockEditor from '../components/CompactBlockEditor'
import blocksToText from '../../helpers/blocksToText'
import type { Rule } from '@sanity/types'
import { ImageWithAlt } from './imageWithAlt'

const titleContentType = configureTitleBlockContent()

export default {
  name: 'fullWidthVideo',
  title: 'Full Width Video Player',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'array',
      title: 'Hidden Video Description',
      description: 'The hidden video description',
      components: { input: CompactBlockEditor },
      of: [titleContentType],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'videoFile',
      type: 'reference',
      title: 'Video',
      to: [{ type: 'videoFile' }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'spacing',
      type: 'boolean',
      title: 'Space between other components',
      initialValue: false,
    },
    {
      name: 'aspectRatio',
      type: 'string',
      title: 'Aspect ratio',
      options: {
        list: [
          { title: 'Full screen', value: 'fullScreen' },
          { title: 'Narrow', value: 'narrow' },
          { title: '2:1', value: '2:1' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'fullscreen',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      videoTitle: 'videoFile.video.title',
      media: 'videoFile.thumbnail',
    },
    prepare({ title, videoTitle, media }: { title: any; videoTitle: string; media: ImageWithAlt }) {
      const plainTitle = title ? blocksToText(title) : undefined

      return {
        title: plainTitle || videoTitle,
        subtitle: `Full width video component`,
        media: media || EdsIcon(play_circle),
      }
    },
  },
}
