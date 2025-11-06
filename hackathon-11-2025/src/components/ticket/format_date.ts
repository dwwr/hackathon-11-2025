export const formatDate = (date: Date | string | undefined): string => {
  if (!date) {
    return 'May 16, 2016, 2:33 PM'
  }

  if (typeof date === 'string') {
    return date
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
