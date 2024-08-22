import { person } from "@equinor/eds-icons";
import { EdsIcon } from "../../icons";
import { Rule } from 'sanity'; 
import editorPicksInput from "./news/editorPicksInput";

interface Selection {
  title: string;
  authorName: string;
  media: any; 
}

export default {
  name: 'editorPicks',
  title: 'Editor Picks',
  type: 'document',
  icon: () => EdsIcon(person),
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('Title is required'),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule: Rule) => Rule.required().error('Author is required'),
      inputComponent: editorPicksInput,
    },
    {
      name: 'articles',
      title: 'Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'news' }] }],
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      authorName: 'author.name',
      media: 'author.photo',
    },
    prepare(selection: Selection) {
      const { title, authorName, media } = selection;
      return {
        title: `${title} - ${authorName}`,
        media,
      };
    },
  },
};
