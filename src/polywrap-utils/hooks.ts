import { useRef } from 'react'

// dequal/lite copied from https://github.com/lukeed/dequal
const has = Object.prototype.hasOwnProperty
// @ts-ignore
function dequal(foo, bar) {
  let ctor, len
  if (foo === bar) return true

  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date) return foo.getTime() === bar.getTime()
    if (ctor === RegExp) return foo.toString() === bar.toString()

    if (ctor === Array) {
      if ((len = foo.length) === bar.length) {
        while (len-- && dequal(foo[len], bar[len]));
      }
      return len === -1
    }

    if (!ctor || typeof foo === 'object') {
      len = 0
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false
      }
      return Object.keys(bar).length === len
    }
  }

  // eslint-disable-next-line no-self-compare
  return foo !== foo && bar !== bar
}

// * Gracefully copied from https://github.com/apollographql/react-apollo/blob/master/packages/hooks/src/utils/useDeepMemo.ts
/**
 * Memoize a result using deep equality. This hook has two advantages over
 * React.useMemo: it uses deep equality to compare memo keys, and it guarantees
 * that the memo function will only be called if the keys are unequal.
 * React.useMemo cannot be relied on to do this, since it is only a performance
 * optimization (see https://reactjs.org/docs/hooks-reference.html#usememo).
 */
export function useDeepMemo<TKey, TValue>(memoFn: () => TValue, key: TKey): TValue {
  const ref = useRef<{ key: TKey; value: TValue }>()

  if (!ref.current || !dequal(key, ref.current.key)) {
    ref.current = { key, value: memoFn() }
  }

  return ref.current.value
}
