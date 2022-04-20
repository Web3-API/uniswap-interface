import './prism.css'

import Prism from 'prismjs'
import React, { useEffect } from 'react'
import styled from 'styled-components/macro'

// width: 20rem;
// display: flex;
// justify-content: center;
export const CodeWrapper = styled.div`
  background: transparent;
  width: 40rem;
  margin-left: 2rem;
  position: relative;
  border-radius: 10px;

  @media (max-width: 960px) {
    width: 100%;
    margin-top: 0;
    align-items: center;
  }
`

interface Props {
  codeString: string
}

const Code = (props: React.PropsWithChildren<Props>) => {
  const { codeString } = props

  useEffect(() => {
    Prism.highlightAll()
  }, [codeString])

  return (
    <>
      <CodeWrapper className="codeBlock__code">
        <pre className="line-numbers">
          <code className="language-js">{codeString}</code>
        </pre>
      </CodeWrapper>
    </>
  )
}

export default Code
