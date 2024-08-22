import { apiVersion } from '../../../../sanity.client'
export const UnusedAndPublished = (S) =>
  S.listItem()
    .title('Unused and Published')
    .child(S.list('unusedAndPublished').title('Unused and Published Documents').items(unusedTypesListItems(S)))
    .id('unusedAndPublished')

const getUnusedPublishedDocuments = (S, docType) =>
  S.documentTypeList(docType)
    .apiVersion(apiVersion)
    .filter(/* groq */ `
        _type == $docType && !(_id in path("drafts.**")) && count(*[references(^._id)]) == 0
      `,
    )
    .params({ docType })
    .id(`unusedPublishedDocuments-${docType}`)

const unusedTypesListItems = (S) => [
  S.listItem()
    .title('Pages')
    .child(getUnusedPublishedDocuments(S, 'page'))
    .id('unusedPages')
    .title('Unused Pages'),
  S.listItem()
    .title('News')
    .child(getUnusedPublishedDocuments(S, 'news'))
    .id('unusedNews')
    .title('Unused News'),
  S.listItem()
    .title('Magazines')
    .child(getUnusedPublishedDocuments(S, 'magazine'))
    .id('unusedMagazines')
    .title('Unused Magazines'),
  S.listItem()
    .title('Events')
    .child(getUnusedPublishedDocuments(S, 'event'))
    .id('unusedEvents')
    .title('Unused Events'),
]

export default UnusedAndPublished
