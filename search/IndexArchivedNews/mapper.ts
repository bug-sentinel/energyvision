import { NewsIndex } from '../common'
import type { SearchMetadataEntry } from './fileStorage'

type MapDataType = (article: SearchMetadataEntry) => NewsIndex
export const mapData: MapDataType = (article) => {
  const {
    publishedDate,
    tags: { topics, country },
    title,
    category,
    description,
    link,
    content,
  } = article
  const year = publishedDate ? new Date(publishedDate).getFullYear() : ''
  return  {
    slug: link,
    objectID: `${publishedDate}-${link}`,
    type: 'news',
    pageTitle: title,
    ingress: description,
    text: content,
    publishDateTime: publishedDate,
    topicTags: [...topics, category],
    countryTags: [country],
    year,
  } as NewsIndex
}
