export interface CancelablePromise<T> {
  promise: Promise<T>
  cancel: () => void
}

// make a promise cancelable
export function makeCancelable<T>(promise: Promise<T>): CancelablePromise<T | undefined> {
  let isCanceled = false
  const wrappedPromise = new Promise<T | undefined>((resolve, reject) => {
    promise
      .then((val: T) => (isCanceled ? resolve(undefined) : resolve(val)))
      .catch((error) => !isCanceled && reject(error))
  })
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true
    },
  }
}
