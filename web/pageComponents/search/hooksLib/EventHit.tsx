import { Highlight } from './Highlight'
import { default as NextLink } from 'next/link'
import styled from 'styled-components'
import type { Hit as AlgoliaHit } from '@algolia/client-search'
import { Heading, FormattedDate } from '@components'
import { useRouter } from 'next/router'
import { getFullUrl } from '../../../common/helpers/getFullUrl'
import HitLink, { StyledHitLink } from './HitLink'

const DisplayLink = styled.p`
  color: var(--mist-blue-100);
  font-size: var(--typeScale-0);
  margin: var(--space-xSmall) 0 var(--space-medium) 0;
`

/* @TODO: Let's use the Text component if the margin is removed */
const TextSnippet = styled.p`
  margin: 0;
  font-size: var(--typeScale-0);
  line-height: var(--lineHeight-3);
  color: var(--inverted-text);
`

const HitHeading = styled(Heading)`
  position: relative;
  &:after {
    background: none repeat scroll 0 0 transparent;
    bottom: 0;
    content: '';
    display: block;
    height: 1px;
    left: 50%;
    position: absolute;
    background: #fff;
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
    width: 0;
  }

  ${StyledHitLink}:hover &:after {
    width: 100%;
    left: 0;
  }
`

const StyledFormattedDate = styled(FormattedDate)`
  font-size: var(--typeScale-0);
  letter-spacing: 1px;
`

type EventResultHit = {
  ingress?: string
  slug?: string
  title?: string
  eventDescription?: string
  eventDate?: string
  type?: string // @TODO: be more specific, like "news", "page", "event"?
}

export type EventHit = AlgoliaHit<EventResultHit>

export type HitProps = {
  hit: EventHit
  setIsOpen: (arg0: boolean) => void
}

const EventHit = ({ hit, setIsOpen }: HitProps) => {
  // Shouldn't be empty string, but this is work in progress
  const { slug = '', eventDate } = hit

  const { pathname } = useRouter()
  const fullUrl = getFullUrl(pathname, slug)

  // @TODO: A more generic Hit component for more than events. Or multiple components???
  return (
    <article>
      <NextLink href={slug} passHref>
        <HitLink setIsOpen={() => setIsOpen(false)}>
          {eventDate && <StyledFormattedDate datetime={eventDate} uppercase></StyledFormattedDate>}
          <HitHeading level="h2" size="sm" inverted>
            <Highlight hit={hit} attribute="title" />
          </HitHeading>
          <TextSnippet>
            <Highlight hit={hit} attribute="ingress" />
          </TextSnippet>
          <TextSnippet>
            <Highlight hit={hit} attribute="eventDescription" />
          </TextSnippet>
          <DisplayLink>{fullUrl}</DisplayLink>
        </HitLink>
      </NextLink>
    </article>
  )
}

export default EventHit
