import { getNameFromLocale } from '../../lib/localization'
import { sanityClient } from '../../lib/sanity.server'
import { groq } from 'next-sanity'
import { publishDateTimeQuery } from '../../lib/queries/news'

// These URLs uses SSR and thus should not be static rendered
const topicSlugBlackList = {
  en_GB: ['/news'],
  nb_NO: ['/nyheter'],
}

const getTopicRoutesForLocale = async (locale: string) => {
  const lang = getNameFromLocale(locale)
  // Empty array as fallback for satelittes
  const blacklist = topicSlugBlackList[lang as keyof typeof topicSlugBlackList] || []
  const data: { slug: string; _updatedAt: string }[] = await sanityClient.fetch(
    groq`*[_type match "route_" + $lang + "*" && (!(slug.current in $blacklist)) && defined(slug.current) && !(_id in path("drafts.**"))][] {
      _updatedAt,
      "slug": slug.current,
    }`,
    {
      lang,
      blacklist,
    },
  )
  return data
}

const getDocumentsForLocale = async (type: 'news' | 'localNews' | 'magazine', locale: string) => {
  const lang = getNameFromLocale(locale)
  const data: { slug: string; _updatedAt: string }[] = await sanityClient.fetch(
    groq`*[_type == $type && _lang == $lang && defined(slug.current) && !(_id in path("drafts.**"))][] {
      _updatedAt,
      "slug": slug.current,
    }`,
    {
      type,
      lang,
    },
  )
  return data
}

// Get a Sanity document by given slug
// Only include drafts if preview mode is enabled
export const getDocumentBySlug = async (slug: string, isPreview = false) => {
  const draft = isPreview ? `` : `&& !(_id in path("drafts.**"))`
  const data: { slug: string; _updatedAt: string }[] = await sanityClient.fetch(
    groq`*[defined(slug.current) && slug.current == $slug ${draft}][0] {
      _updatedAt,
      "slug": slug.current,
    }`,
    {
      slug,
    },
  )
  return data
}

export type PathType = {
  slug: string[] | string
  updatedAt: string
  locale: string
}

export const getRoutePaths = async (locales: string[]): Promise<PathType[]> => {
  const fetchPaths = locales.map(async (locale) => {
    const pages = await getTopicRoutesForLocale(locale)
    return pages.map((page) => ({
      slug: page.slug.split('/').filter((p) => p),
      updatedAt: page._updatedAt,
      locale,
    }))
  })

  return (await Promise.all(fetchPaths)).flat()
}

export const getNewsPaths = async (locales: string[]): Promise<PathType[]> => {
  const fetchPaths = locales.map(async (locale) => {
    const pages = await getDocumentsForLocale('news', locale)
    return pages.map((page) => ({
      slug: page.slug.split('/').filter((p) => p),
      updatedAt: page._updatedAt,
      locale,
    }))
  })

  return (await Promise.all(fetchPaths)).flat()
}

export const getMagazinePaths = async (locales: string[]): Promise<PathType[]> => {
  const fetchPaths = locales.map(async (locale) => {
    const pages = await getDocumentsForLocale('magazine', locale)
    return pages.map((page) => ({
      slug: page.slug.split('/').filter((p) => p),
      updatedAt: page._updatedAt,
      locale,
    }))
  })

  return (await Promise.all(fetchPaths)).flat()
}

export const getLocalNewsPaths = async (locales: string[]): Promise<PathType[]> => {
  const fetchPaths = locales.map(async (locale) => {
    const pages = await getDocumentsForLocale('localNews', locale)
    return pages.map((page) => ({
      slug: page.slug.split('/').filter((p) => p),
      updatedAt: page._updatedAt,
      locale,
    }))
  })

  return (await Promise.all(fetchPaths)).flat()
}

export const getNewsroomPaths = async (): Promise<PathType[]> => {
  // Use last published news as updatedAt field for newsroom
  const getUpdatedAt = async (lang: 'en_GB' | 'nb_NO'): Promise<{ _updatedAt: string }> =>
    await sanityClient.fetch(
      groq`*[_type == 'news' && _lang == $lang && !(_id in path("drafts.**"))] | order(${publishDateTimeQuery} desc)[0] {
      _updatedAt,
    }`,
      {
        lang,
      },
    )

  const { _updatedAt: englishUpdatedAt } = await getUpdatedAt('en_GB')
  const { _updatedAt: norwegianUpdatedAt } = await getUpdatedAt('nb_NO')

  return [
    {
      slug: ['news'],
      updatedAt: englishUpdatedAt,
      locale: 'en',
    },
    {
      slug: ['nyheter'],
      updatedAt: norwegianUpdatedAt,
      locale: 'no',
    },
  ]
}

export const getMagazineIndexPaths = async (): Promise<PathType[]> => {
  // Use last published news as updatedAt field for newsroom
  const getUpdatedAt = async (lang: 'en_GB' | 'nb_NO'): Promise<{ _updatedAt: string }> =>
    await sanityClient.fetch(
      groq`*[_type == 'magazine' && _lang == $lang && !(_id in path("drafts.**"))] | order(_createdAt desc)[0] {
      _updatedAt,
    }`,
      {
        lang,
      },
    )

  const { _updatedAt: englishUpdatedAt } = await getUpdatedAt('en_GB')
  const { _updatedAt: norwegianUpdatedAt } = await getUpdatedAt('nb_NO')

  return [
    {
      slug: ['magazine'],
      updatedAt: englishUpdatedAt,
      locale: 'en',
    },
    {
      slug: ['magasin'],
      updatedAt: norwegianUpdatedAt,
      locale: 'no',
    },
  ]
}
