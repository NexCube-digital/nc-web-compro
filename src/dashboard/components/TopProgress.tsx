import React, { useEffect, useState } from 'react'
import apiClient from '../../services/api'

const TopProgress: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    let timer: any
    let incTimer: any

    const onLoading = (loading: boolean) => {
      if (loading) {
        // show bar and start increasing
        setVisible(true)
        setWidth(6)
        setAnimate(true)
        // gradually increase until 90%
        clearInterval(incTimer)
        incTimer = setInterval(() => {
          setWidth((w) => Math.min(90, w + Math.random() * 8))
        }, 400)
      } else {
        // finish animation
        clearInterval(incTimer)
        setWidth(100)
        // wait for expand animation then hide
        clearTimeout(timer)
        timer = setTimeout(() => {
          setAnimate(false)
          setVisible(false)
          setWidth(0)
        }, 350)
      }
    }

    apiClient.onLoadingChange(onLoading)

    return () => {
      apiClient.offLoadingChange(onLoading)
      clearInterval(incTimer)
      clearTimeout(timer)
    }
  }, [])

  if (!visible) return null

  return (
    <div aria-hidden className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="h-1 w-full bg-transparent">
        <div
          className="h-1 shadow-lg transition-all duration-300 ease-linear"
          style={{ width: `${width}%`, background: 'linear-gradient(90deg,#06b6d4,#6366f1)', transform: animate ? 'scaleX(1)' : 'scaleX(1)'}}
        />
      </div>
    </div>
  )
}

export default TopProgress
