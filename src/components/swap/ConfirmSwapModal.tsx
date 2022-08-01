import { Trans } from '@lingui/macro'
import { Percent } from '@uniswap/sdk-core'
import { ReactNode, useCallback, useMemo } from 'react'

import { reverseMapTokenAmount, toSignificant } from '../../polywrap-utils'
import { tradeMeaningfullyDiffers } from '../../utils/tradeMeaningFullyDiffer'
import { Uni_Trade } from '../../wrap'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from '../TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  swapQuoteReceivedDate,
}: {
  isOpen: boolean
  trade: Uni_Trade | undefined
  originalTrade: Uni_Trade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: Percent
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: ReactNode | undefined
  onDismiss: () => void
  swapQuoteReceivedDate: Date | undefined
}) {
  // shouldLogModalCloseEvent lets the child SwapModalHeader component know when modal has been closed
  // and an event triggered by modal closing should be logged.

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const onModalDismiss = useCallback(() => {
    onDismiss()
  }, [onDismiss])

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter onConfirm={onConfirm} disabledConfirm={showAcceptChanges} swapErrorMessage={swapErrorMessage} />
    ) : null
  }, [onConfirm, showAcceptChanges, swapErrorMessage])

  // text to show while loading
  const pendingText = (
    <Trans>
      Swapping {trade && toSignificant(trade?.inputAmount, 6)} {trade?.inputAmount?.token.currency?.symbol} for{' '}
      {trade && toSignificant(trade?.outputAmount, 6)} {trade?.outputAmount?.token.currency?.symbol}
    </Trans>
  )

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onModalDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title={<Trans>Confirm Swap</Trans>}
          onDismiss={onModalDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onModalDismiss, modalBottom, modalHeader, swapErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onModalDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={reverseMapTokenAmount(trade?.outputAmount)?.currency}
    />
  )
}
