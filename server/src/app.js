import cors from 'cors'
import express from 'express'
import { randomUUID } from 'node:crypto'
import {
  blogPosts,
  foodItems,
  galleryImages,
  homestays,
} from '../../client/src/data/resortData.js'
import { getStayQuote } from '../../client/src/utils/pricing.js'
import { readStore, updateStore } from './dataStore.js'

const app = express()
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    const error = new Error('This origin is not allowed by the API CORS policy.')
    error.status = 403
    callback(error)
  },
}))
app.use(express.json({ limit: '16kb' }))
app.use((request, _response, next) => {
  if (request.body === undefined || request.body === null) request.body = {}
  next()
})

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validPhone(value) {
  const digits = value.replace(/\D/g, '')
  return /^\+?[\d\s().-]{7,40}$/.test(value) && digits.length >= 7 && digits.length <= 15
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsedDate = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsedDate.valueOf()) && parsedDate.toISOString().slice(0, 10) === value
}

function validateStayDates(checkIn, checkOut) {
  if (!validDate(checkIn) || !validDate(checkOut)) {
    return 'Check-in and check-out must be valid dates in YYYY-MM-DD format.'
  }
  if (checkIn < new Date().toISOString().slice(0, 10)) return 'Check-in cannot be in the past.'
  if (checkOut <= checkIn) return 'Check-out must be after check-in.'
  return null
}

function sendValidationError(response, message) {
  return response.status(400).json({ error: message })
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/homestays', (_request, response) => {
  response.json({ homestays })
})

app.get('/api/homestays/:slug', (request, response) => {
  const homestay = homestays.find((item) => item.slug === request.params.slug)
  if (!homestay) return response.status(404).json({ error: 'Homestay not found.' })
  return response.json({ homestay })
})

app.get('/api/food', (request, response) => {
  const staySlug = cleanString(request.query.stay)
  if (!staySlug) return response.json({ foodItems })

  const homestay = homestays.find((item) => item.slug === staySlug)
  if (!homestay) return response.status(404).json({ error: 'Homestay not found.' })
  return response.json({
    foodItems: foodItems.filter((item) => item.servedAt.includes(homestay.name)),
  })
})

app.get('/api/blog', (_request, response) => {
  response.json({ blogPosts })
})

app.get('/api/blog/:slug', (request, response) => {
  const post = blogPosts.find((item) => item.slug === request.params.slug)
  if (!post) return response.status(404).json({ error: 'Blog post not found.' })
  return response.json({ post })
})

app.get('/api/gallery', (_request, response) => {
  response.json({ galleryImages })
})

app.get('/api/reviews', async (request, response, next) => {
  try {
    const store = await readStore()
    const staySlug = cleanString(request.query.staySlug)
    const reviews = staySlug
      ? store.reviews.filter((review) => review.staySlug === staySlug)
      : store.reviews
    return response.json({ reviews })
  } catch (error) {
    return next(error)
  }
})

app.post('/api/reviews', async (request, response, next) => {
  const author = cleanString(request.body.author)
  const location = cleanString(request.body.location)
  const text = cleanString(request.body.text)
  const rating = Number(request.body.rating)
  const staySlug = cleanString(request.body.staySlug)

  if (!author || author.length > 100) return sendValidationError(response, 'Name is required and must be 100 characters or fewer.')
  if (!location || location.length > 100) return sendValidationError(response, 'Location is required and must be 100 characters or fewer.')
  if (!text || text.length > 3000) return sendValidationError(response, 'Review is required and must be 3000 characters or fewer.')
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return sendValidationError(response, 'Rating must be between 1 and 5.')
  if (staySlug && !homestays.some((item) => item.slug === staySlug)) {
    return sendValidationError(response, 'The selected homestay does not exist.')
  }

  try {
    const review = {
      id: randomUUID(),
      ...(staySlug ? { staySlug } : {}),
      author,
      location,
      rating,
      text,
      createdAt: new Date().toISOString(),
    }
    await updateStore((store) => store.reviews.unshift(review))
    return response.status(201).json({ review })
  } catch (error) {
    return next(error)
  }
})

app.post('/api/inquiries', async (request, response, next) => {
  const name = cleanString(request.body.name)
  const email = cleanString(request.body.email)
  const phone = cleanString(request.body.phone)
  const message = cleanString(request.body.message)
  const checkIn = cleanString(request.body.checkIn)
  const checkOut = cleanString(request.body.checkOut)
  const guests = request.body.guests === undefined || request.body.guests === ''
    ? undefined
    : Number(request.body.guests)
  const rooms = request.body.rooms === undefined || request.body.rooms === ''
    ? undefined
    : Number(request.body.rooms)

  if (!name || name.length > 100) return sendValidationError(response, 'Name is required and must be 100 characters or fewer.')
  if ((!email && !phone) || (email && !validEmail(email))) {
    return sendValidationError(response, 'Provide a valid email address or phone number.')
  }
  if (phone && !validPhone(phone)) return sendValidationError(response, 'Provide a valid phone number with 7 to 15 digits.')
  if (!message || message.length > 3000) return sendValidationError(response, 'Message is required and must be 3000 characters or fewer.')
  if (checkIn || checkOut) {
    const dateError = validateStayDates(checkIn, checkOut)
    if (dateError) return sendValidationError(response, dateError)
  }
  if (guests !== undefined && (!Number.isInteger(guests) || guests < 1 || guests > 30)) {
    return sendValidationError(response, 'Guests must be a whole number between 1 and 30.')
  }
  if (rooms !== undefined && (!Number.isInteger(rooms) || rooms < 1 || rooms > 20)) {
    return sendValidationError(response, 'Rooms must be a whole number between 1 and 20.')
  }

  try {
    const inquiry = {
      id: randomUUID(),
      name,
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
      ...(checkIn ? { checkIn, checkOut } : {}),
      ...(guests !== undefined ? { guests } : {}),
      ...(rooms !== undefined ? { rooms } : {}),
      ...(cleanString(request.body.homestay) ? { homestay: cleanString(request.body.homestay) } : {}),
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    await updateStore((store) => store.inquiries.unshift(inquiry))
    return response.status(201).json({ inquiry })
  } catch (error) {
    return next(error)
  }
})

app.post('/api/bookings', async (request, response, next) => {
  const name = cleanString(request.body.name)
  const email = cleanString(request.body.email)
  const phone = cleanString(request.body.phone)
  const homestaySlug = cleanString(request.body.homestaySlug)
  const roomName = cleanString(request.body.roomName)
  const checkIn = cleanString(request.body.checkIn)
  const checkOut = cleanString(request.body.checkOut)
  const guests = Number(request.body.guests)
  const homestay = homestays.find((item) => item.slug === homestaySlug)

  if (!name || name.length > 100) return sendValidationError(response, 'Name is required and must be 100 characters or fewer.')
  if ((!email && !phone) || (email && !validEmail(email))) {
    return sendValidationError(response, 'Provide a valid email address or phone number.')
  }
  if (phone && !validPhone(phone)) return sendValidationError(response, 'Provide a valid phone number with 7 to 15 digits.')
  if (!homestay) return sendValidationError(response, 'Select a valid homestay.')
  if (!homestay.rooms.some((room) => room.name === roomName)) {
    return sendValidationError(response, 'Select a valid room for this homestay.')
  }
  const dateError = validateStayDates(checkIn, checkOut)
  if (dateError) return sendValidationError(response, dateError)
  if (!Number.isInteger(guests) || guests < 1 || guests > 30) {
    return sendValidationError(response, 'Guests must be a whole number between 1 and 30.')
  }

  try {
    const quote = getStayQuote(homestay, roomName, checkIn, checkOut)
    if (!quote) return sendValidationError(response, 'A booking estimate could not be calculated for the selected room and dates.')
    const booking = {
      id: randomUUID(),
      name,
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
      homestaySlug,
      homestayName: homestay.name,
      roomName,
      checkIn,
      checkOut,
      guests,
      ...quote,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    await updateStore((store) => store.bookings.unshift(booking))
    return response.status(201).json({ booking })
  } catch (error) {
    return next(error)
  }
})

app.post('/api/feedback', async (request, response, next) => {
  const name = cleanString(request.body.name)
  const email = cleanString(request.body.email)
  const message = cleanString(request.body.message)
  const rating = Number(request.body.rating)

  if (!name || name.length > 100) return sendValidationError(response, 'Name is required and must be 100 characters or fewer.')
  if (!validEmail(email)) return sendValidationError(response, 'A valid email address is required.')
  if (!message || message.length > 3000) return sendValidationError(response, 'Feedback is required and must be 3000 characters or fewer.')
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return sendValidationError(response, 'Rating must be a whole number between 1 and 5.')
  }

  try {
    const feedback = {
      id: randomUUID(),
      name,
      email,
      message,
      rating,
      createdAt: new Date().toISOString(),
    }
    await updateStore((store) => store.feedback.unshift(feedback))
    return response.status(201).json({ feedback })
  } catch (error) {
    return next(error)
  }
})

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API endpoint not found.' })
})

app.use((error, _request, response, _next) => {
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must contain valid JSON.' })
  }
  if (error.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Request body is too large.' })
  }
  console.error('API request failed:', error)
  return response.status(error.status || 500).json({
    error: error.status === 403 ? error.message : 'An unexpected server error occurred.',
  })
})

export default app
