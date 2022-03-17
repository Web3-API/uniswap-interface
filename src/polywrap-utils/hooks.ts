import { useEffect, useState } from 'react'

export function useAsync<T>(callback: () => Promise<T>): T | undefined {
  const [val, setVal] = useState<T | undefined>(undefined)

  useEffect(() => {
    const updateAsync = async () => {
      setVal(await callback())
    }
    void updateAsync()
  }, [callback])

  return val
}
