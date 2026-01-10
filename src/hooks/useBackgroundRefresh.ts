import { useEffect, useRef, useState } from 'react'

// Generic background refresh hook
// fetcher should return the latest data (array or object) or null
export default function useBackgroundRefresh<T> (
  key: string,
  fetcher: () => Promise<T | null>,
  opts?: { interval?: number; compare?: (a: T | null, b: T | null) => boolean }
) {
  const intervalMs = opts?.interval ?? 10000
  const compare = opts?.compare ?? ((a: T | null, b: T | null) => JSON.stringify(a) === JSON.stringify(b))

  const latestRef = useRef<T | null>(null)
  const [hasNew, setHasNew] = useState(false)
  const [newData, setNewData] = useState<T | null>(null)

  useEffect(() => {
    let mounted = true
    let timer: any

    const poll = async () => {
      // Skip polling when tab is not visible to avoid unnecessary backend load
      if (typeof document !== 'undefined' && document.hidden) return
      try {
        const data = await fetcher()
        if (!mounted) return
        // initialize latestRef if null
        if (latestRef.current === null) {
          latestRef.current = data
          return
        }

        if (!compare(latestRef.current, data)) {
          // new data detected
          latestRef.current = data
          setNewData(data)
          setHasNew(true)
        }
      } catch (e) {
        // ignore polling errors
        // console.debug('Background refresh failed', e)
      }
    }

    // initial poll
    poll()
    timer = setInterval(poll, intervalMs)

    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [key, intervalMs])

  const clearNew = () => { setHasNew(false); setNewData(null) }

  return { hasNew, newData, clearNew }
}
