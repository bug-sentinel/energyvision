import { HTMLAttributes } from 'react'
import styled from 'styled-components'

type TextProps = HTMLAttributes<HTMLParagraphElement>

const StyledText = styled.div`
  p {
    margin-bottom: 0;
  }
`

export const Text = ({ children, ...rest }: TextProps) => {
  console.log('children', children)
  return <StyledText {...rest}>{children}</StyledText>
}
