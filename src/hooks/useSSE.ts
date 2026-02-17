import { useEffect, useRef } from 'react'

type Handlers = { [event: string]: (data: any) => void }

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function useSSE(url = '/stream', handlers: Handlers = {}) {
  const ev = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!('EventSource' in window)) return
    // Convert relative URL to absolute API URL
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`
    const es = new EventSource(fullUrl)
    ev.current = es

    es.onmessage = (e) => {
      // default message
      try {
        const data = JSON.parse(e.data)
        if (handlers['message']) handlers['message'](data)
      } catch {}
    }

    Object.keys(handlers).forEach((event) => {
      if (event === 'message') return
      es.addEventListener(event, (evnt: MessageEvent) => {
        try {
          const d = JSON.parse(evnt.data)
          handlers[event] && handlers[event](d)
        } catch (e) {
          handlers[event] && handlers[event](evnt.data)
        }
      })
    })

    es.onerror = () => {
      // try reconnect logic handled by browser
    }

    return () => {
      try { es.close() } catch {}
      ev.current = null
    }
  }, [url])

  return ev
}
