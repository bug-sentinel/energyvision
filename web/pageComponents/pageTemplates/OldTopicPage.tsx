import { NextSeo } from 'next-seo'
import Script from 'next/script'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { anchorClick } from '../../common/helpers/staticPageHelpers'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// TODO fix the eslint issues
import archivedStyles from '@equinor/energyvision-legacy-css'

type OldTopicPageProps = {
  data: {
    title: string
    description: string
    content: string
  }
}


const OldTopicPage = ({ data }: OldTopicPageProps): JSX.Element => {
  const router = useRouter()
  const onLinkClicked = (e : any) => {
    anchorClick(e,router)
  }
  if (!data?.content) {
    return <ErrorPage statusCode={404} />
  }
  
  // cookiebot script should be beforeInterative.. 
  return (
    <>
      <NextSeo title={data?.title} description={data?.description}></NextSeo>
      <Script src="https://consent.cookiebot.com/uc.js"
       id="Cookiebot" data-cbid="f1327b03-7951-45da-a2fd-9181babc783f"
       strategy="afterInteractive"></Script> 
      <Script src="/legacy/legacy.minified.js" strategy="afterInteractive" />
      <style jsx global>
        {archivedStyles}
      </style>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="legacyStyles"
        onClick={onLinkClicked}
        onKeyDown = { onLinkClicked}
        dangerouslySetInnerHTML={{
          __html: data?.content,
        }}
      />
    </>
  )
}

export default OldTopicPage
