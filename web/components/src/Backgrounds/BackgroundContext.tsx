import { BackgroundContainerProps } from '@components'
import { createContext, useState } from 'react'

type Props = {
  backgroundContainerProps: BackgroundContainerProps | undefined
  setBackgroundContainerProps: React.Dispatch<React.SetStateAction<BackgroundContainerProps | undefined>>
}

type ProviderProps = {
  children: React.ReactNode
}

export const BackgroundContext = createContext<Props>({
  backgroundContainerProps: undefined,
  setBackgroundContainerProps: () => {
    return
  },
})

export const BackgroundContextProvider = ({ children }: ProviderProps) => {
  const [backgroundContainerProps, setBackgroundContainerProps] = useState({
    background: { backgroundColor: 'White' },
  } as BackgroundContainerProps | undefined)

  return (
    <BackgroundContext.Provider value={{ backgroundContainerProps, setBackgroundContainerProps }}>
      {children}
    </BackgroundContext.Provider>
  )
}
