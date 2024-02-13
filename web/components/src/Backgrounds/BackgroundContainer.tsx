import { forwardRef, HTMLAttributes, memo, useContext, useEffect } from 'react'
import type { BackgroundColours, ImageBackground } from '../../../types/types'
import { ColouredContainer } from './ColouredContainer'
import { ImageBackgroundContainer } from './ImageBackgroundContainer'
import { BackgroundContext } from './BackgroundContext'
import { useInView } from 'react-intersection-observer'
import styled from 'styled-components'

export type BackgroundContainerProps = {
  background?: {
    backgroundColor?: BackgroundColours
    imageBackground?: ImageBackground
  }
  isTrueComponent?: Boolean
} & HTMLAttributes<HTMLDivElement>

const Wrapper = styled.div<{ isTrueComponent: Boolean }>`
  ${({ isTrueComponent }) =>
    isTrueComponent
      ? `
   padding-top: 25vh;
   padding-bottom: 25vh;
   `
      : ''}
`
export const BackgroundContainer = forwardRef<HTMLDivElement, BackgroundContainerProps>(function BackgroundContainer(
  { background, style, children, className, isTrueComponent = true, ...rest },
  ref,
) {
  const { setBackgroundContainerProps } = useContext(BackgroundContext)

  const { ref: inViewRef, inView } = useInView({
    rootMargin: '0px 0px',
    threshold: 0.5,
  })

  useEffect(() => {
    if (inView && isTrueComponent) {
      console.log(background)
      setBackgroundContainerProps({ background })
    }
  }, [background, inView, isTrueComponent])

  const Container = memo(({ children }: { children: React.ReactNode }) => {
    return background?.imageBackground ? (
      <ImageBackgroundContainer
        ref={ref}
        {...rest}
        imageBackground={background?.imageBackground}
        style={style}
        className={className}
      >
        {children}
      </ImageBackgroundContainer>
    ) : (
      <ColouredContainer
        ref={ref}
        {...rest}
        background={background?.backgroundColor}
        style={style}
        className={className}
      >
        {children}
      </ColouredContainer>
    )
  })

  return (
    <Wrapper ref={inViewRef} isTrueComponent={isTrueComponent}>
      <Container>{children}</Container>
    </Wrapper>
  )
})
