const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

export function countStayNights(checkIn, checkOut) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return 0

  const parseDate = (value) => {
    const [year, month, day] = value.split('-').map(Number)
    const timestamp = Date.UTC(year, month - 1, day)
    return new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : null
  }
  const start = parseDate(checkIn)
  const end = parseDate(checkOut)
  if (start === null || end === null || end <= start) return 0
  return (end - start) / DAY_IN_MILLISECONDS
}

export function getStayQuote(stay, roomName, checkIn, checkOut) {
  const nights = countStayNights(checkIn, checkOut)
  const room = stay?.rooms.find((item) => item.name === roomName)
  if (!room || nights < 1 || !Number.isSafeInteger(room.price) || room.price <= 0) return null

  const discounts = stay.pricing?.customerDiscounts || []
  if (!Array.isArray(discounts)) throw new Error('Customer discount pricing must be configured as a list.')
  if (discounts.some((discount) => (
    !Number.isFinite(discount.percent)
    || discount.percent <= 0
    || discount.percent >= 100
    || !Number.isInteger(discount.minimumNights)
    || discount.minimumNights < 1
    || typeof discount.label !== 'string'
    || !discount.label.trim()
  ))) {
    throw new Error('A customer discount has invalid pricing configuration.')
  }

  const eligibleDiscount = discounts
    .filter((discount) => discount.minimumNights <= nights)
    .sort((first, second) => second.percent - first.percent)[0]
  const subtotal = room.price * nights
  if (!Number.isSafeInteger(subtotal)) throw new Error('The estimated booking total exceeds the supported amount.')
  const discountPercent = eligibleDiscount?.percent || 0
  const discountAmount = Math.round(subtotal * discountPercent) / 100

  return {
    roomName: room.name,
    nightlyRate: room.price,
    nights,
    subtotal,
    discountPercent,
    discountLabel: eligibleDiscount?.label || '',
    discountAmount,
    estimatedTotal: subtotal - discountAmount,
  }
}
