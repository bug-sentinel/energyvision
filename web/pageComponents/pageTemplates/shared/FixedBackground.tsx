import { BackgroundContext } from '@components/Backgrounds/BackgroundContext'
import { useSanityLoader } from 'lib/hooks/useSanityLoader'
import { useContext, forwardRef, HTMLAttributes, useEffect, useState, memo } from 'react'
import styled from 'styled-components'
import { getContainerColor } from '@utils/backgroundColours'

type ContainerProps = {
  imageUrl?: string
  backgroundColor: String
}
const ImageContainer = styled.div<ContainerProps>`
  position: relative;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: ${({ color, imageUrl }) => `var(${color})`};
  background-image: ${({ color, imageUrl }) =>
    imageUrl ? `linear-gradient(to right, rgba(0, 0, 0, 0), var(${color}) 70%), url(${imageUrl})` : 'none'};
  transition: all 0.5s ease-out;
  //animation: reveal 5s;
  /*@keyframes reveal {
    from {
      opacity: 0.2;
    }
    to {
      opacity: 1;
    }
  }*/
`

export const FixedBackground = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function FixedBackground(
    { children, className, style, ...rest },
    ref,
  ) {
    const { backgroundContainerProps } = useContext(BackgroundContext)
    const background = backgroundContainerProps?.background

    const styleVariant = getContainerColor(background?.backgroundColor || 'White')

    let props = undefined
    if (background?.imageBackground?.image) {
      props = useSanityLoader(background?.imageBackground?.image, 1920, undefined)
    }
    return (
      <ImageContainer imageUrl={props?.src} color={styleVariant}>
        {children}
      </ImageContainer>
    )
  }),
)
