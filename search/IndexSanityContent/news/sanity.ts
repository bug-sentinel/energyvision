import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { SanityClient } from '@sanity/client'
import { Language } from '../../common'

const publishDateTimeQuery = /* groq */ `
  select(
    customPublicationDate == true =>
      publishDateTime,
      _createdAt
  )
`

export const query = /* groq */ `*[_type == "news" && _lang == $lang] {
  "slug": slug.current,
  _id,
  "title": title,
  "ingress": ingress,
  "type": _type,
  "publishDateTime": ${publishDateTimeQuery},
  "topicTags": tags[]->.title[$lang],
  "countryTags": countryTags[]->.title[$lang],
  "blocks": content[_type == "block"] {
    "blockKey": _key,
    "children": children[text match "*"] {
      "childKey": _key,
      "text": text
    }
  },
}
`

const getQueryParams = (language: Language) => ({
  lang: language.internalCode,
})

export type NewsArticle = {
  slug: string
  title: string
  ingress: string
  // ISO 8601
  publishDateTime?: string
  topicTags?: string[]
  countryTags?: string[]
  blocks: {
    blockKey: string
    children: {
      childKey: string
      text: string
    }[]
  }[]
  _id: string
}

type FetchDataType = (
  query: string,
) => (
  getQueryparams: (language: Language) => Readonly<Record<string, string>>,
) => (sanityClient: SanityClient) => (language: Language) => TE.TaskEither<Error, NewsArticle[]>

const fetch: FetchDataType = (query) => (getQueryParams) => (sanityClient) => (language) =>
  pipe(TE.tryCatch(() => sanityClient.fetch(query, getQueryParams(language)), E.toError))

export const fetchData = fetch(query)(getQueryParams)
