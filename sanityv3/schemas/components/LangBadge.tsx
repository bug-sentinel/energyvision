/* eslint-disable @typescript-eslint/ban-ts-comment */
import { languages } from '../../languages'
import countries from '../../icons/countries'
import React from 'react'
import { DocumentBadgeComponent, DocumentBadgeDescription, DocumentBadgeProps } from 'sanity'

interface FlagProps {
  lang: string;
}

const Flag: React.FC<FlagProps> = ({ lang }) => {
  //@ts-ignore
  const FlagIcon = countries[lang]
  return <FlagIcon width={20} height={15} />
}

export const LangBadge: DocumentBadgeComponent = (props: DocumentBadgeProps): DocumentBadgeDescription | null => {
  const lang = props.published?.lang || props.draft?.lang
  const language = languages.find((it) => it.name === lang)

  if (language) {
    return {
      label: language.title,
      title: language.title,
      color: 'primary',
      // Adding the custom component as an icon or any other suitable property.
      icon: <Flag lang={language.id} />,
    }
  } else {
    return {
      label: 'Language not set',
      title: '',
      color: 'warning',
    }
  }
}
