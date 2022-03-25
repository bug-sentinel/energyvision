//import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import styled from 'styled-components'
import { InstantSearch, Configure } from 'react-instantsearch-hooks'

//import { blocksToText } from '../../common/helpers'
//import getOpenGraphImages from '../../common/helpers/getOpenGraphImages'

//import { getFullUrl } from '../../common/helpers/getFullUrl'
import { Text, Heading } from '@components'
import { searchClientServer, searchClient } from '../../lib/algolia'
import NewsContent from '../newsRoom/NewsContent'

const Wrapper = styled.div`
  grid-template-areas:
    'intro intro'
    'news  news';
  grid-template-rows: auto auto;

  display: grid;
`

const Intro = styled.div`
  grid-area: intro;
  padding: var(--space-xLarge) var(--layout-paddingHorizontal-medium) var(--space-xLarge)
    var(--layout-paddingHorizontal-medium);
`

const News = styled.div`
  grid-area: news;
  padding: var(--space-xLarge) var(--layout-paddingHorizontal-small) var(--space-xLarge)
    var(--layout-paddingHorizontal-small);
`

type NewsRoomTemplateProps = {
  isServerRendered?: boolean
}

const NewsRoomPage = ({ isServerRendered = false }: NewsRoomTemplateProps) => {
  // @TODO Add seo and some #947
  //const { documentTitle, metaDescription, openGraphImage } = data.seoAndSome
  // const plainTitle = title ? blocksToText(title) : ''
  //const { pathname } = useRouter()
  //const fullUrl = getFullUrl(pathname, slug)

  return (
    <>
      <NextSeo
      //  title={documentTitle || plainTitle}
      //  description={metaDescription}
      //   openGraph={{
      //     title: plainTitle,
      //     description: metaDescription,
      //     type: 'website',
      //     url: fullUrl,
      //     images: openGraphImage?.asset && getOpenGraphImages(openGraphImage),
      //   }}
      />
      <main>
        <Wrapper>
          <Intro>
            <Heading size="2xl" level="h1">
              Newsroom
            </Heading>
            <Text>
              We’re Equinor, a broad energy company with more than 20,000 colleagues committed to developing oil, gas,
              wind and solar energy in more than 30 countries worldwide. We’re dedicated to safety, equality and
              sustainability.
            </Text>
          </Intro>
          <News>
            <InstantSearch
              searchClient={isServerRendered ? searchClientServer : searchClient}
              indexName="dev_NEWS_en-GB"
              /*  routing={{
                  router: history({
                    getLocation() {
                      if (typeof window === 'undefined') {
                        return new URL(url!) as unknown as Location
                      }

                      return window.location
                    },
                  }),
                }} */
            >
              <Configure facetingAfterDistinct />
              <NewsContent />
            </InstantSearch>
          </News>
        </Wrapper>
      </main>
    </>
  )
}

export default NewsRoomPage
