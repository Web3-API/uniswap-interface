import { DependencyList, useEffect, useState } from 'react'

export function useAsync<T>(callback: () => Promise<T>, deps: DependencyList, initialValue: T): T {
  const [val, setVal] = useState<T>(initialValue)

  useEffect(() => {
    const updateAsync = async () => {
      setVal(await callback())
    }
    void updateAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, callback])

  return val
}
