/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useCallback, forwardRef, useState, useRef } from 'react'
// @ts-ignore
import ReactDOM from 'react-dom'
import { Dialog } from '@sanity/ui'
import styled from 'styled-components'

const BM_EVENT_NAME = 'dam:plugin-assets-selected-event'
const BM_URL = process.env.SANITY_STUDIO_BRANDMASTER_URL || ''
const BM_SOURCE = BM_URL + process.env.SANITY_STUDIO_BRANDMASTER_PLUGIN_SOURCE || ''

const Content = styled.div`
  margin: 2em;
`

const BrandmasterAssetSource = forwardRef<HTMLDivElement>((props: any, ref) => {
  const { onSelect, onClose } = props

  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const newWindow = useRef<Window | null>(null)

  const handleBrandmasterEvent = useCallback(
    (event) => {
      if (!event || !event.data || event.origin !== BM_URL) return false

      const data = JSON.parse(event.data)

      console.log('Brandmaster data:', data)

      if (!data.eventName || data.eventName !== BM_EVENT_NAME) return false

      const file = data.eventData.selected[0]
      // @TODO: get this to work with brandmaster provided download URLs (cors issue)
      const downloadUrl = BM_URL + file.arrayfiles[0].file_ref

      onSelect([
        {
          kind: 'url',
          value: downloadUrl,
          assetDocumentProps: {
            originalFileName: file.uniqueId,
            source: {
              id: file.uniqueId,
              name: 'brandmaster',
            },
            ...(file?.title && { title: file.title }),
            ...(file?.description && { description: file.description }),
            ...(file?.photographer && { creditLine: file.photographer }),
          },
        },
      ])
    },
    [onSelect],
  )

  useEffect(() => {
    setContainer(document.createElement('div'))
  }, [])

  useEffect(() => {
    if (container) {
      newWindow.current = window.open(BM_SOURCE, 'Brandmaster', 'width=1200,height=800,left=200,top=200')

      if (newWindow.current) {
        newWindow.current.document.body.appendChild(container)
        window.addEventListener('message', handleBrandmasterEvent)
      }

      const currentWindow = newWindow.current

      return () => {
        window.removeEventListener('message', handleBrandmasterEvent)

        if (currentWindow) {
          currentWindow.close()
        }
      }
    }
  }, [container, handleBrandmasterEvent])

  return (
    <Dialog id="brandmasterAssetSource" header="Select image from Brandmaster" onClose={onClose} ref={ref}>
      {container && ReactDOM.createPortal(props.children, container)}

      {BM_SOURCE ? (
        <Content>
          <p>Select an image from Brandmaster in the popup window.</p>
          <p>Once selected, the upload process should start automatically.</p>
        </Content>
      ) : (
        <Content>
          <p>
            No Brandmaster source URL found. Please define the URL and path in the enviromental variables to load the
            iframe.
          </p>
        </Content>
      )}
    </Dialog>
  )
})

BrandmasterAssetSource.displayName = 'BrandmasterAssetSource'

export default BrandmasterAssetSource
