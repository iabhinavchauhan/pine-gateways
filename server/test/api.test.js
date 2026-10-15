import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { after, before, test } from 'node:test'
import { getStayQuote } from '../../client/src/utils/pricing.js'

let server
let baseUrl
let temporaryDirectory

before(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'pine-getaways-api-'))
  process.env.DATA_FILE = path.join(temporaryDirectory, 'site-data.json')
  const { default: app } = await import('../src/app.js')
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true })
})

async function request(endpoint, options) {
  const response = await fetch(`${baseUrl}${endpoint}`, options)
  return { response, body: await response.json() }
}

test('catalog endpoints expose homestays, food, blog posts and gallery', async () => {
  const [stays, food, blog, gallery, filteredFood, stay] = await Promise.all([
    request('/api/homestays'),
    request('/api/food'),
    request('/api/blog'),
    request('/api/gallery'),
    request('/api/food?stay=vivanta-homestay'),
    request('/api/homestays/vivanta-homestay'),
  ])

  assert.equal(stays.body.homestays.length, 3)
  assert.deepEqual(
    stays.body.homestays.map((homestay) => homestay.name),
    ['SAMTHAR Hill-Stay', 'Suviksha Homestay', 'Asher Homestay'],
  )
  assert.ok(food.body.foodItems.length > 0)
  assert.equal(blog.body.blogPosts.length, 3)
  assert.ok(gallery.body.galleryImages.length > 0)
  assert.ok(filteredFood.body.foodItems.every((item) => item.servedAt.includes('Suviksha Homestay')))
  assert.equal(stay.body.homestay.slug, 'vivanta-homestay')
})

test('health, feedback and API not-found responses are available', async () => {
  const health = await request('/api/health')
  assert.deepEqual(health.body, { status: 'ok' })

  const feedback = await request('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test guest',
      email: 'guest@example.com',
      rating: 4,
      message: 'The trip was lovely.',
    }),
  })
  assert.equal(feedback.response.status, 201)
  assert.equal(feedback.body.feedback.rating, 4)

  const missing = await request('/api/not-a-route')
  assert.equal(missing.response.status, 404)
  assert.deepEqual(missing.body, { error: 'API endpoint not found.' })
})

test('CORS allows the configured frontend origin and rejects unknown origins', async () => {
  const allowed = await request('/api/health', {
    headers: { Origin: 'http://localhost:5173' },
  })
  assert.equal(allowed.response.headers.get('access-control-allow-origin'), 'http://localhost:5173')

  const blocked = await request('/api/health', {
    headers: { Origin: 'https://unapproved.example' },
  })
  assert.equal(blocked.response.status, 403)
  assert.match(blocked.body.error, /origin is not allowed/)
})

test('reviews can be submitted, filtered and persisted', async () => {
  const created = await request('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: 'Test guest',
      location: 'Kalimpong',
      rating: 5,
      text: 'A lovely stay.',
      staySlug: 'green-leaf-homestay',
    }),
  })
  assert.equal(created.response.status, 201)
  assert.equal(created.body.review.staySlug, 'green-leaf-homestay')

  const filtered = await request('/api/reviews?staySlug=green-leaf-homestay')
  assert.ok(filtered.body.reviews.some((review) => review.id === created.body.review.id))

  const savedData = JSON.parse(await readFile(process.env.DATA_FILE, 'utf8'))
  assert.ok(savedData.reviews.some((review) => review.id === created.body.review.id))
})

test('inquiries and booking requests validate input and are saved', async () => {
  const inquiry = await request('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test guest',
      phone: '+911234567890',
      checkIn: '2027-02-10',
      checkOut: '2027-02-12',
      guests: 2,
      rooms: 1,
      homestay: 'No preference',
      message: 'Please contact me.',
    }),
  })
  assert.equal(inquiry.response.status, 201)
  assert.equal(inquiry.body.inquiry.status, 'new')

  const booking = await request('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test guest',
      email: 'guest@example.com',
      homestaySlug: 'vivanta-homestay',
      roomName: 'Meadow Room',
      checkIn: '2027-02-10',
      checkOut: '2027-02-12',
      guests: 2,
      nightlyRate: 1,
      estimatedTotal: 1,
    }),
  })
  assert.equal(booking.response.status, 201)
  assert.equal(booking.body.booking.status, 'pending')
  assert.equal(booking.body.booking.nights, 2)
  assert.equal(booking.body.booking.nightlyRate, 1400)
  assert.equal(booking.body.booking.estimatedTotal, 2800)

  const invalidBooking = await request('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test guest',
      email: 'guest@example.com',
      homestaySlug: 'vivanta-homestay',
      roomName: 'Meadow Room',
      checkIn: '2027-02-12',
      checkOut: '2027-02-10',
      guests: 2,
    }),
  })
  assert.equal(invalidBooking.response.status, 400)
  assert.match(invalidBooking.body.error, /after check-in/)

  const invalidPhone = await request('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test guest',
      email: 'guest@example.com',
      phone: 'not a phone',
      homestaySlug: 'vivanta-homestay',
      roomName: 'Meadow Room',
      checkIn: '2027-02-10',
      checkOut: '2027-02-12',
      guests: 2,
    }),
  })
  assert.equal(invalidPhone.response.status, 400)
  assert.match(invalidPhone.body.error, /valid phone number/)
})

test('booking estimates apply only explicitly configured eligible customer discounts', () => {
  const stay = {
    rooms: [{ name: 'Test room', price: 1500 }],
    pricing: {
      customerDiscounts: [
        { label: 'Long stay', percent: 4, minimumNights: 2 },
        { label: 'Extended stay', percent: 6, minimumNights: 4 },
      ],
    },
  }

  assert.deepEqual(
    getStayQuote(stay, 'Test room', '2027-02-10', '2027-02-12'),
    {
      roomName: 'Test room',
      nightlyRate: 1500,
      nights: 2,
      subtotal: 3000,
      discountPercent: 4,
      discountLabel: 'Long stay',
      discountAmount: 120,
      estimatedTotal: 2880,
    },
  )
  assert.equal(getStayQuote(stay, 'Test room', '2027-02-10', '2027-02-14').discountPercent, 6)
  assert.equal(getStayQuote(stay, 'Test room', '2027-02-10', '2027-02-10'), null)
})

test('reviews endpoint handles a legacy store without replacing its existing data', async () => {
  const file = process.env.DATA_FILE
  const store = JSON.parse(await readFile(file, 'utf8'))
  const savedBookings = store.bookings
  delete store.reviews
  await writeFile(file, JSON.stringify(store, null, 2), 'utf8')

  const reviews = await request('/api/reviews')
  assert.equal(reviews.response.status, 200)
  assert.deepEqual(reviews.body.reviews, [])

  const feedback = await request('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Legacy store test',
      email: 'legacy@example.com',
      rating: 5,
      message: 'Existing data remains available.',
    }),
  })
  assert.equal(feedback.response.status, 201)

  const migratedStore = JSON.parse(await readFile(file, 'utf8'))
  assert.deepEqual(migratedStore.reviews, [])
  assert.deepEqual(migratedStore.bookings, savedBookings)
  assert.equal(migratedStore.feedback[0].name, 'Legacy store test')
})
