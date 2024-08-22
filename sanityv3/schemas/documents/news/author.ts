import { person } from "@equinor/eds-icons";
import { EdsIcon } from "../../../icons";
import { Rule } from 'sanity'; 
export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: () => EdsIcon(person),
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('Author name is required'),
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          options: {
            isHighlighted: true,
          },
        },
      ],
      validation: (Rule: Rule) => Rule.required().error('Author photo is required'),
    },
    {
      name: 'dob',
      title: 'Date of Birth',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule: Rule) => Rule.required().error('Date of Birth is required'),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'email',
      validation: (Rule: Rule) => Rule.required().error('Email is required').email(),
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'A short biography of the author',
      validation: (Rule: Rule) => Rule.max(500).warning('Bio should be under 500 characters'),
    },
    {
      name: 'experience',
      title: 'Experience',
      type: 'number',
      description: 'Years of experience',
      validation: (Rule: Rule) => Rule.required().min(0).error('Experience is required and must be a positive number'),
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'photo',
    },
  },
}
