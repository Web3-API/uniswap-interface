import React from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { Flex, Image, Text } from 'rebass'
import styled from 'styled-components/macro'

import TypeScriptLogo from '../assets/images/typescript-logo.svg'
import Code from './Code'

const CodeTabs = styled(Tabs)`
  -webkit-tap-highlight-color: transparent;
  width: 40rem;
`
// @ts-ignore
CodeTabs.tabsRole = 'Tabs'

const CodeTabList = styled(TabList)`
  margin: 0;
  padding: 0;
  background: #1e2b45;
  border-radius: 8px 8px 0 0;
`
// @ts-ignore
CodeTabList.tabsRole = 'TabList'

const CodeTab = styled(Tab)`
  display: inline-block;
  position: relative;
  padding: 12px;
  width: fit-content;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;

  &.selected {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: inset 0px -2px 0px #93f0b9;
  }

  &:focus {
    outline: none;
  }
`
// @ts-ignore
CodeTab.tabsRole = 'Tab'

const LeftCornerTab = styled(CodeTab)`
  border-radius: 8px 0 0 0;
`
// @ts-ignore
LeftCornerTab.tabsRole = 'Tab'

const CodeTabPanel = styled(TabPanel)`
  display: none;
  padding: 1.5rem;
  background: #293653;
  border-radius: 0 0 8px 8px;

  &.selected {
    display: block;
  }
`
// @ts-ignore
CodeTabPanel.tabsRole = 'TabPanel'

const TSLogo = styled(Image)`
  font-size: 16px;
  line-height: 16px;
`

const TabText = styled(Text)`
  font-family: 'Raleway', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  padding-left: 4px;
`

export interface CodeTabsProps {
  query: string
  variables: string
}

export default function CodeblockTabs({ query, variables }: CodeTabsProps) {
  return (
    <CodeTabs selectedTabClassName="selected" selectedTabPanelClassName="selected">
      <CodeTabList>
        <LeftCornerTab>
          <Flex width={1}>
            <TSLogo src={TypeScriptLogo} />
            <TabText>query.ts</TabText>
          </Flex>
        </LeftCornerTab>
        <CodeTab>
          <Flex width={1}>
            <TSLogo src={TypeScriptLogo} />
            <TabText>variables.ts</TabText>
          </Flex>
        </CodeTab>
      </CodeTabList>
      <CodeTabPanel>
        <Code codeString={query} />
      </CodeTabPanel>
      <CodeTabPanel>
        <Code codeString={variables} />
      </CodeTabPanel>
    </CodeTabs>
  )
}
