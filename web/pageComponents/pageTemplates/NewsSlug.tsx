// pages/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next'
import { groq } from 'next-sanity'
import { sanityClient } from 'lib/sanity.server'
import NewsPage from './News'
import { NewsSchema } from '../../types/types'

const query = groq`*[_type == "news" && slug.current == $slug][0] {
    ...,
    author->,
    editorPicks[]-> {
      _id,
      title,
      slug {
        current
      }
    }
  }
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await sanityClient.fetch(groq`*[_type == "news" && defined(slug.current)][].slug.current`)
  return {
    paths: paths.map((slug: string) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }
  const data = await sanityClient.fetch(query, { slug })

  return {
    props: {
      data,
    },
    revalidate: 10,
  }
}

export default NewsPage
