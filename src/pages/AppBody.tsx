import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  /* border: 1px solid rgba(255,255,255,0.3); */
  /* background: rgba(0,0,0,0.3); */
  border-radius: 32px;
  position: relative;
  max-width: 420px;
  position: relative;
  width: 100%;
`

export const CircleMain = styled.div`
  background-image: radial-gradient(circle at 26% 23%, rgba(116,221,159,0.3), rgba(116,221,159,0.01) 90%);
  border-radius: 9999px;
  filter: blur(35px);
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  aspect-ratio: 1/1;
  transform: scale(1.3);
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <BodyWrapper>
      {children}
      <CircleMain/>
    </BodyWrapper>
  )
}
