import { useState } from 'react'

export function placeholderDataUri(label, bg = '#E2E8F0', fg = '#64748B') {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='${fg}'>${label}</text></svg>`
  return `data:image/svg+xml;utf8,${svg}`
}

export function PlaceholderImg({ src, label = 'Image', width, height, className = '' }) {
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const finalSrc = showPlaceholder ? placeholderDataUri(label) : src
  return (
    <img
      src={finalSrc}
      alt={label}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      onError={() => setShowPlaceholder(true)}
      style={{ width: width || '100%', height: height || 'auto', display: 'block' }}
    />
  )
}
