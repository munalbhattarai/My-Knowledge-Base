const units = [
  ['y', 31557600000],
  ['mo', 2629800000],
  ['w', 604800000],
  ['d', 86400000],
  ['h', 3600000],
  ['m', 60000],
]

// "3d ago", "2h ago", "just now"
export function relativeTime(input) {
  if (!input) return ''
  const date = new Date(input)
  const diff = Date.now() - date.getTime()
  if (diff < 60000) return 'just now'
  for (const [suffix, ms] of units) {
    if (diff >= ms) {
      const value = Math.floor(diff / ms)
      return `${value}${suffix} ago`
    }
  }
  return date.toLocaleDateString()
}

export function formatDate(input) {
  if (!input) return ''
  return new Date(input).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(input) {
  if (!input) return ''
  return new Date(input).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// A few words from markdown content, for card excerpts.
export function excerpt(markdown, max = 130) {
  if (!markdown) return ''
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= max) return plain
  return `${plain.slice(0, max).trimEnd()}…`
}