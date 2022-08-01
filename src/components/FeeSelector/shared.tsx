import { Trans } from '@lingui/macro'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import type { ReactNode } from 'react'

import { Uni_FeeAmountEnum as FeeAmountEnum } from '../../wrap'

export const FEE_AMOUNT_DETAIL: Record<
  FeeAmountEnum,
  { label: string; description: ReactNode; supportedChains: SupportedChainId[] }
> = {
  [FeeAmountEnum.LOWEST]: {
    label: '0.01',
    description: <Trans>Best for very stable pairs.</Trans>,
    supportedChains: [
      SupportedChainId.MAINNET,
      SupportedChainId.POLYGON,
      SupportedChainId.POLYGON_MUMBAI,
      SupportedChainId.CELO,
      SupportedChainId.CELO_ALFAJORES,
      SupportedChainId.OPTIMISM,
    ],
  },
  [FeeAmountEnum.LOW]: {
    label: '0.05',
    description: <Trans>Best for stable pairs.</Trans>,
    supportedChains: ALL_SUPPORTED_CHAIN_IDS,
  },
  [FeeAmountEnum.MEDIUM]: {
    label: '0.3',
    description: <Trans>Best for most pairs.</Trans>,
    supportedChains: ALL_SUPPORTED_CHAIN_IDS,
  },
  [FeeAmountEnum.HIGH]: {
    label: '1',
    description: <Trans>Best for exotic pairs.</Trans>,
    supportedChains: ALL_SUPPORTED_CHAIN_IDS,
  },
}
