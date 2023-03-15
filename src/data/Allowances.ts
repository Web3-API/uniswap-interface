import { useMemo } from 'react'

import { useTokenContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { W3Token, W3TokenAmount } from '../polywrap/types'

export function useTokenAllowance(token?: W3Token, owner?: string, spender?: string): W3TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(() => (token && allowance ? { token: token, amount: allowance.toString() } : undefined), [
    token,
    allowance
  ])
}
