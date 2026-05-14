import { useEffect, useRef, useState, useCallback } from 'react'

export default function useBackgroundRefresh<T>(
  key: string,
  fetcher: () => Promise<T | null>,
  opts?: { interval?: number; compare?: (a: T | null, b: T | null) => boolean }
) {
  const intervalMs = opts?.interval ?? 10000
  const compare = opts?.compare ?? ((a: T | null, b: T | null) => JSON.stringify(a) === JSON.stringify(b))

  const latestRef = useRef<T | null>(null)
  // FIX 1: Ganti initializedRef dengan readyRef yang lebih eksplisit
  const readyRef = useRef(false)
  // FIX 2: Simpan fetcher di ref agar tidak stale closure
  const fetcherRef = useRef(fetcher)
  useEffect(() => { fetcherRef.current = fetcher }, [fetcher])

  const [hasNew, setHasNew] = useState(false)
  const [newData, setNewData] = useState<T | null>(null)

  // FIX 3: setInitialData harus sync set latestRef DAN mark ready
  const setInitialData = useCallback((data: T | null) => {
    latestRef.current = data
    readyRef.current = true
  }, [])

  useEffect(() => {
    let mounted = true
    let timer: ReturnType<typeof setInterval>

    const poll = async () => {
      if (typeof document !== 'undefined' && document.hidden) return
      // FIX 4: Gunakan readyRef, bukan initializedRef
      if (!readyRef.current) return

      try {
        const data = await fetcherRef.current()
        if (!mounted) return

        if (!compare(latestRef.current, data)) {
          latestRef.current = data
          setNewData(data)
          setHasNew(true)
        }
      } catch {
        // ignore polling errors
      }
    }

    timer = setInterval(poll, intervalMs)

    return () => {
      mounted = false
      clearInterval(timer)
      // FIX 5: Reset readyRef saat unmount agar saat remount tidak polling dulu
      // sebelum setInitialData dipanggil ulang
      readyRef.current = false
    }
  }, [key, intervalMs])

  const clearNew = useCallback(() => {
    setHasNew(false)
    setNewData(null)
  }, [])

  return { hasNew, newData, clearNew, setInitialData }
}