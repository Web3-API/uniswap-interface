import React from 'react'
import styled from 'styled-components'

export const BackgroundImg = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  pointerevents: none;
  height: 200vh;
  mixblendmode: color;
  background: radial-gradient(50% 50% at 50% 50%, rgb(37.65, 75.29, 38.82) 0%, rgba(255, 255, 255, 0) 100%);
  transform: translateY(-130vh);
  maxwidth: 100vw !important;
`
export default function Background() {
  return <BackgroundImg />
}
