/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetStaticProps, GetStaticPaths } from 'next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import dynamic from 'next/dynamic'
import { SkipNavContent } from '@reach/skip-nav'
/* import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js' */
import { filterDataToSingleItem } from '../lib/filterDataToSingleItem'
import { getQueryFromSlug } from '../lib/queryFromSlug'
// import { usePreviewSubscription } from '../lib/sanity'
import { Layout } from '../pageComponents/shared/Layout'
import { defaultLanguage } from '../languages'
import Header from '../pageComponents/shared/Header'
import { isGlobal } from '../common/helpers/datasetHelpers'
import { FormattedMessage } from 'react-intl'
import getIntl from '../common/helpers/getIntl'
import { getRoutePaths } from '../common/helpers/getPaths'
import getPageSlugs from '../common/helpers/getPageSlugs'
import { getComponentsData } from '../lib/fetchData'

const LandingPage = dynamic(() => import('../pageComponents/pageTemplates/LandingPage'))
const TopicPage = dynamic(() => import('../pageComponents/pageTemplates/TopicPage'))
const OldTopicPage = dynamic(() => import('../pageComponents/pageTemplates/OldTopicPage'))
const EventPage = dynamic(() => import('../pageComponents/pageTemplates/Event'))
const NewsPage = dynamic(() => import('../pageComponents/pageTemplates/News'))

// @TODO Improve types here, don't use any
export default function Page({ data, preview }: any) {
  /*   const appInsights = useAppInsightsContext()
   */

  const router = useRouter()

  // Let's nuke the preview hook temporarily for performance reasons
  /*   const { data: previewData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    initialData: data?.pageData,
    enabled: preview || router.query.preview !== null,
    //  sanity types not updated to beta yet
    // eslint-disable-next-line
    // @ts-ignore
    useGroqBeta: true,
  }) */

  const pageData = data?.pageData?.news
    ? filterDataToSingleItem(data.pageData.news, preview)
    : filterDataToSingleItem(data.pageData, preview)

  const slug = pageData?.slug
  if (!router.isFallback && !slug && !data?.queryParams?.id) {
    return <ErrorPage statusCode={404} />
  }

  //appInsights.trackPageView({ name: slug /* uri: fullUrl */ })

  if (data?.isArchivedFallback) {
    return router.isFallback ? (
      <p>
        <FormattedMessage id="loading" defaultMessage="Loading..." />
      </p>
    ) : (
      <OldTopicPage data={pageData} />
    )
  }

  const template = pageData?.template || null

  // @TODO: How should we handle this in the best possible way?
  if (!template) console.warn('Missing template for', slug)

  if (router.isFallback) {
    return (
      <p>
        <FormattedMessage id="loading" defaultMessage="Loading..." />
      </p>
    )
  }

  switch (template) {
    case 'landingPage':
      return <LandingPage data={pageData} />
    case 'event':
      return <EventPage data={pageData} />
    case 'news':
    case 'localNews':
      return <NewsPage data={{ news: pageData, latestNews: data.pageData?.latestNews }} />
    default:
      return <TopicPage data={pageData} />
  }
}

// eslint-disable-next-line react/display-name
Page.getLayout = (page: AppProps) => {
  /* The getLayout pattern is a way to preserve state in the layout
  across client side navigation. The downside is that since it's just an
  ordinary function, we can't use the preview subscription hook out of the box.
  As a consequence, preview for the menu data is not available.

  If this is a problem, we need to see if we are able to find another solution  */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { props } = page
  const { data, preview } = props
  const slugs = getPageSlugs(data)

  return (
    <>
      <Layout footerData={data?.footerData} intl={data?.intl} preview={preview}>
        <Header slugs={slugs} menuData={data?.menuData} />
        <SkipNavContent />
        {page}
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params, preview = false, locale = defaultLanguage.locale }) => {
  const { query, queryParams, isNews } = getQueryFromSlug(params?.slug as string[], locale)

  const intl = await getIntl(locale, preview)

  const { menuData, pageData, footerData } = await getComponentsData(
    {
      query,
      queryParams,
    },
    preview,
    isNews,
  )

  // @TODO This doesn't feel bullet proof at all this doesn't scale to well.
  const notFound = (!pageData && !queryParams?.id) || (typeof pageData?.news != 'undefined' && !pageData?.news)
  // If global, fetch static content in case data is not found or trying to access news
  // @TODO This should only be for news at some point
  if (isGlobal && ((!pageData && !queryParams?.id) || (params?.slug === 'news' && !pageData.news))) {
    const { getArchivedPageData } = await import('../common/helpers/staticPageHelpers')

    const slug = params?.slug ? (params?.slug as string[]).join('/') : '/'

    const archivedData = await getArchivedPageData(locale, slug)
    const notFoundInArchived = !archivedData

    return {
      props: {
        preview: false,
        data: {
          isArchivedFallback: true,
          pageData: { slug: slug, ...archivedData },
          menuData,
          footerData,
          intl,
        },
      },
      //@TODO: revalidate how often?
      revalidate: 300,
      notFound: notFoundInArchived,
    }
  }

  return {
    props: {
      preview,
      data: {
        isArchivedFallback: false,
        query,
        queryParams,
        pageData,
        menuData,
        footerData,
        intl,
      },
    },
    revalidate: 120,
    notFound,
  }
}

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const routePaths = await getRoutePaths(locales)

  const paths = routePaths.map((path) => ({
    params: { slug: path.slug },
    locale: path.locale,
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}
