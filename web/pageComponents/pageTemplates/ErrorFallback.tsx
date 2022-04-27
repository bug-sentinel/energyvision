import { Button, Text, Heading } from '@components'
import styled from 'styled-components'
import { GlobalStyle, GlobalFontStyle } from '../../styles/globalStyles'

const Wrapper = styled.section`
  padding: clamp(40px, calc(14.3125px + 11.0032vw), 210px) clamp(16px, calc(-69.1942px + 22.7184vw), 367px);
`

const ContentWrapper = styled.div`
  margin: var(--space-xLarge) 0;
`

const StyledButton = styled(Button)`
  margin-bottom: var(--space-large);
`

const StyledDetails = styled.details`
  margin: var(--space-xLarge) 0;
`

const StyledSummary = styled.summary`
  font-size: var(--typeScale-2);
  margin-bottom: var(--space-medium);
`

const StyledCode = styled.code`
  padding: var(--space-small);
  background: var(--grey-20);
  display: block;
  border-radius: 10px;
  margin: var(--space-medium) 0;
`

const StyledPre = styled.pre`
  padding: var(--space-small);
  overflow-x: auto;
  line-height: 1.5em;
`

const sliceErrorStack = (stackTrace = '', numLines = 10) => {
  const lines = stackTrace.split('\n')
  const firstNLines = lines.slice(0, numLines)
  const joinedLines = firstNLines.join('\n')
  return joinedLines
}

export const ErrorFallback = ({ error, errorInfo, resetErrorBoundary }: any) => {
  return (
    <Wrapper>
      <GlobalStyle />
      <GlobalFontStyle />
      <Heading level="h1" size="xl">
        An Error Occurred
      </Heading>

      <ContentWrapper>
        <Text>
          The application detected an error that prevented it from loading. This error has been automatically reported
          to the development team. You can try clicking the <strong>Reload the Page</strong> button below to return to
          the page you were on previously.
        </Text>

        <StyledButton onClick={resetErrorBoundary}>Reload the Page</StyledButton>

        {/* TODO: get correct text & contact details
        <Text>
          If the error keeps occurring, please file a bug report with the following details, and include any steps to
          reproduce the issue:
        </Text>
        */}
      </ContentWrapper>

      <ContentWrapper>
        <Heading level="h2" size="lg">
          Error Details
        </Heading>
        <StyledCode>
          <pre>{error.message}</pre>
        </StyledCode>
        <StyledDetails>
          <StyledSummary>Expand to Show Error Stack Traces</StyledSummary>
          <Heading level="h3">Stack Trace</Heading>
          <StyledCode>
            <StyledPre>{sliceErrorStack(error.stack)}</StyledPre>
          </StyledCode>

          <Heading level="h3">Component Stack</Heading>
          <StyledCode>
            <StyledPre>{sliceErrorStack(errorInfo?.componentStack)}</StyledPre>
          </StyledCode>
        </StyledDetails>
      </ContentWrapper>
    </Wrapper>
  )
}
