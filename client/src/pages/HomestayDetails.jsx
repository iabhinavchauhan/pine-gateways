import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ResortContext } from '../context/ResortContext'
import { foodItems, homestays } from '../data/resortData'
import { apiRequest } from '../utils/api'
import { getStayQuote } from '../utils/pricing'
import { resolveImage } from '../utils/resolveImage'
import './HomestayDetails.css'

const BUSINESS_WHATSAPP_NUMBER = '919433898908'

function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function nextDate(date) {
  if (!date) return ''
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10)
}

export default function HomestayDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { toggleWishlist, addRecentView, wishlist, reviews } = useContext(ResortContext)
  const [selectedRoomName, setSelectedRoom] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [bookingFormOpen, setBookingFormOpen] = useState(false)
  const [booking, setBooking] = useState({ name: '', email: '', phone: '', checkIn: '', checkOut: '', guests: 2 })
  const [bookingStatus, setBookingStatus] = useState({ loading: false, message: '', error: false })
  const touchStartX = useRef(null)
  const lightboxRef = useRef(null)
  const trackedStaySlug = useRef('')

  const stay = useMemo(() => homestays.find((item) => item.slug === slug), [slug])
  const stayMenu = useMemo(
    () => (stay ? foodItems.filter((item) => item.servedAt.includes(stay.name)) : []),
    [stay],
  )
  const stayReviews = useMemo(
    () => reviews.filter((review) => review.staySlug === slug),
    [reviews, slug],
  )
  const selectedRoom = stay?.rooms.find((room) => room.name === selectedRoomName)?.name
    || stay?.rooms[0]?.name
    || ''
  const selectedRoomDetails = stay?.rooms.find((room) => room.name === selectedRoom)
  const bookingQuote = stay && selectedRoom
    ? getStayQuote(stay, selectedRoom, booking.checkIn, booking.checkOut)
    : null
  const today = new Date().toISOString().slice(0, 10)
  const whatsappMessage = stay
    ? [
      `Hello, I would like to enquire about ${stay.name} in ${stay.location}.`,
      booking.checkIn ? `Check-in: ${booking.checkIn}` : '',
      booking.checkOut ? `Check-out: ${booking.checkOut}` : '',
      booking.guests ? `Guests: ${booking.guests}` : '',
    ].filter(Boolean).join('\n')
    : ''

  const handleBookingChange = (event) => {
    const { name, value } = event.target
    setBooking((current) => ({ ...current, [name]: name === 'guests' ? Number(value) : value }))
  }

  const handleBookingSubmit = async (event) => {
    event.preventDefault()
    setBookingStatus({ loading: true, message: '', error: false })
    try {
      const { booking: savedBooking } = await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          ...booking,
          homestaySlug: stay.slug,
          roomName: selectedRoom,
        }),
      })
      setBookingStatus({
        loading: false,
        message: `Request ${savedBooking.id} received for ${savedBooking.nights} nights. Estimated total: ${formatPrice(savedBooking.estimatedTotal)}. Your booking is pending confirmation.`,
        error: false,
      })
      setBookingFormOpen(false)
    } catch (error) {
      setBookingStatus({ loading: false, message: error.message, error: true })
    }
  }

  useEffect(() => {
    if (stay && trackedStaySlug.current !== stay.slug) {
      trackedStaySlug.current = stay.slug
      addRecentView(stay.slug)
    }
  }, [stay, addRecentView])

  useEffect(() => {
    if (!stay) return undefined

    const description = `${stay.description} Explore rooms and send a reservation request for ${stay.name} in ${stay.location}.`
    const previousTitle = document.title
    const descriptionMeta = document.querySelector('meta[name="description"]')
    const previousDescription = descriptionMeta?.content
    const openGraphTitle = document.querySelector('meta[property="og:title"]')
    const previousOpenGraphTitle = openGraphTitle?.content
    const openGraphDescription = document.querySelector('meta[property="og:description"]')
    const previousOpenGraphDescription = openGraphDescription?.content
    const openGraphImage = document.querySelector('meta[property="og:image"]')
    const previousOpenGraphImage = openGraphImage?.content
    const canonical = document.querySelector('link[rel="canonical"]')
    const previousCanonical = canonical?.href
    const openGraphUrl = document.querySelector('meta[property="og:url"]')
    const previousOpenGraphUrl = openGraphUrl?.content
    const canonicalUrl = `https://thepinegetaways.com/homestays/${stay.slug}`

    document.title = `${stay.name} | The Pine Getaways`
    if (descriptionMeta) descriptionMeta.content = description
    if (openGraphTitle) openGraphTitle.content = document.title
    if (openGraphDescription) openGraphDescription.content = description
    if (openGraphImage) openGraphImage.content = stay.mainImage
    if (canonical) canonical.href = canonicalUrl
    if (openGraphUrl) openGraphUrl.content = canonicalUrl

    return () => {
      document.title = previousTitle
      if (descriptionMeta && previousDescription) descriptionMeta.content = previousDescription
      if (openGraphTitle && previousOpenGraphTitle) openGraphTitle.content = previousOpenGraphTitle
      if (openGraphDescription && previousOpenGraphDescription) openGraphDescription.content = previousOpenGraphDescription
      if (openGraphImage && previousOpenGraphImage) openGraphImage.content = previousOpenGraphImage
      if (canonical && previousCanonical) canonical.href = previousCanonical
      if (openGraphUrl && previousOpenGraphUrl) openGraphUrl.content = previousOpenGraphUrl
    }
  }, [stay])

  useEffect(() => {
    if (lightboxIndex === null || !stay) return undefined

    const previousOverflow = document.body.style.overflow
    const closeOnKey = (event) => {
      if (event.key === 'Escape') setLightboxIndex(null)
      if (event.key === 'ArrowRight') setLightboxIndex((index) => (index + 1) % stay.gallery.length)
      if (event.key === 'ArrowLeft') setLightboxIndex((index) => (index - 1 + stay.gallery.length) % stay.gallery.length)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnKey)
    lightboxRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnKey)
    }
  }, [lightboxIndex, stay])

  if (!stay) {
    return (
      <div className="stay-page stay-not-found">
        <p>Homestay not found.</p>
        <button type="button" onClick={() => navigate(-1)}>Return back</button>
      </div>
    )
  }

  const photoSource = (image, index) => resolveImage(image, `${stay.slug}-details-${index}`, 1400, 1000)
  const handlePhotoError = (event) => {
    event.currentTarget.hidden = true
    event.currentTarget.parentElement?.classList.add('is-image-missing')
  }
  const moveLightbox = (direction) => {
    setLightboxIndex((index) => (index + direction + stay.gallery.length) % stay.gallery.length)
  }
  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX
  }
  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return
    const distance = event.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(distance) > 50) moveLightbox(distance < 0 ? 1 : -1)
    touchStartX.current = null
  }

  return (
    <div className="stay-page">
      <div className="stay-breadcrumbs">
        <Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/homestays">Homestays</Link><span aria-hidden="true">/</span><span>{stay.name}</span>
      </div>

      <header className="stay-heading">
        <div>
          <p className="stay-eyebrow"><span aria-hidden="true">⌖</span>{stay.location}</p>
          <h1>{stay.name}</h1>
          <p className="stay-tagline">{stay.tagline}</p>
        </div>
        <button
          type="button"
          className={`stay-save-button${wishlist.includes(stay.slug) ? ' is-saved' : ''}`}
          onClick={() => toggleWishlist(stay.slug)}
          aria-pressed={wishlist.includes(stay.slug)}
        >
          <span aria-hidden="true">{wishlist.includes(stay.slug) ? '♥' : '♡'}</span>
          {wishlist.includes(stay.slug) ? 'Saved' : 'Save stay'}
        </button>
      </header>

      <section className={`stay-gallery${stay.gallery.length < 5 ? ' stay-gallery--single' : ''}`} aria-label={`${stay.name} photos`}>
        <button
          type="button"
          className="stay-gallery-main"
          onClick={() => setLightboxIndex(0)}
          aria-label={`View photo 1 of ${stay.name}`}
        >
          <img
            src={photoSource(stay.gallery[0], 0)}
            alt={`${stay.name} main property view`}
            fetchPriority="high"
            onError={handlePhotoError}
          />
        </button>
        {stay.gallery.slice(1, 5).map((image, index) => (
          <button
            type="button"
            className="stay-gallery-thumb"
            key={`${image}-${index}`}
            onClick={() => setLightboxIndex(index + 1)}
            aria-label={`View photo ${index + 2} of ${stay.name}`}
          >
            <img
              src={photoSource(image, index + 1)}
              alt={`${stay.name} property view ${index + 2}`}
              loading="lazy"
              onError={handlePhotoError}
            />
            {index === 3 && stay.gallery.length > 5 && (
              <span className="stay-gallery-more">+{stay.gallery.length - 5} photos</span>
            )}
          </button>
        ))}
        <button type="button" className="stay-view-photos" onClick={() => setLightboxIndex(0)}>
          <span aria-hidden="true">▦</span> {stay.gallery.length === 1 ? 'View photo (1)' : `View all photos (${stay.gallery.length})`}
        </button>
      </section>

      <div className="stay-layout">
        <div className="stay-content">
          <section className="stay-section stay-overview">
            <div>
              <p className="stay-eyebrow">A stay to remember</p>
              <h2>Welcome to {stay.name}</h2>
            </div>
            <p className="stay-description">{stay.description}</p>
          </section>

          <section className="stay-section">
            <div className="stay-section-heading">
              <div><p className="stay-eyebrow">Thoughtful details</p><h2>What this place offers</h2></div>
              <span className="stay-section-count">{stay.amenities.length} amenities</span>
            </div>
            <div className="stay-amenities">
              {stay.amenities.map((amenity) => (
                <div className="stay-amenity" key={amenity}>
                  <span className="stay-amenity-icon" aria-hidden="true">✦</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="stay-section">
            <div className="stay-section-heading">
              <div><p className="stay-eyebrow">Make yourself at home</p><h2>Choose your room</h2></div>
              <span className="stay-section-count">{stay.rooms.length} room options</span>
            </div>
            <div className="stay-rooms">
              {stay.rooms.map((room) => (
                <article className={`stay-room-card${selectedRoom === room.name ? ' is-selected' : ''}`} key={room.name}>
                  <div className="stay-room-top">
                    <div>
                      <p className="stay-room-label">Room option</p>
                      <h3>{room.name}</h3>
                    </div>
                    <p className="stay-room-price">
                      <strong>{formatPrice(room.price)}</strong>
                      <span>per room / night</span>
                    </p>
                  </div>
                  <p className="stay-room-description">{room.description}</p>
                  <button
                    type="button"
                    className="stay-room-select"
                    onClick={() => setSelectedRoom(room.name)}
                    aria-pressed={selectedRoom === room.name}
                  >
                    {selectedRoom === room.name ? 'Selected room' : 'Choose this room'}
                  </button>
                </article>
              ))}
            </div>
            <p className="stay-policy-note">Guest capacity, check-in and check-out times, and house rules are not listed in the current property information. Please confirm these details with the host.</p>
          </section>

          {bookingQuote?.discountPercent > 0 && (
            <section className="stay-section stay-offers">
              <div className="stay-section-heading">
                <div><p className="stay-eyebrow">Eligible for your dates</p><h2>Configured stay discount</h2></div>
                <span className="stay-offer-mark" aria-hidden="true">✳</span>
              </div>
              <div className="stay-offer-list">
                <article className="stay-offer-card">
                  <strong>{bookingQuote.discountPercent}% OFF</strong>
                  <span>{bookingQuote.discountLabel}</span>
                </article>
              </div>
              <p className="stay-offer-note">The estimate applies the configured customer discount for the selected dates. The host will confirm final terms.</p>
            </section>
          )}

          <section className="stay-section">
            <div className="stay-section-heading">
              <div><p className="stay-eyebrow">A taste of the region</p><h2>Dining at the homestay</h2></div>
            </div>
            <div className="stay-food-highlights">
              {stay.foodHighlights.map((highlight) => (
                <div className="stay-food-highlight" key={highlight}><span aria-hidden="true">✦</span>{highlight}</div>
              ))}
            </div>
            {stayMenu.length > 0 && (
              <div className="stay-menu-list">
                {stayMenu.map((item) => (
                  <article className="stay-menu-card" key={item.id}>
                    <div className="stay-review-heading">
                      <h3>{item.name}</h3><span>{item.rating.toFixed(1)} ★</span>
                    </div>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="stay-section stay-location-section">
            <div className="stay-section-heading">
              <div><p className="stay-eyebrow">Explore nearby</p><h2>Around {stay.location}</h2></div>
            </div>
            <p className="stay-location-address">{stay.contact.address}</p>
            <ul className="stay-attractions">
              {stay.attractions.map((attraction) => <li key={attraction}>{attraction}</li>)}
            </ul>
          </section>

          <section className="stay-section">
            <div className="stay-section-heading">
              <div><p className="stay-eyebrow">From our guests</p><h2>Guest reviews</h2></div>
              {stayReviews.length > 0 && <span className="stay-section-count">{stayReviews.length} reviews</span>}
            </div>
            {stayReviews.length > 0 ? (
              <div className="stay-reviews">
                {stayReviews.map((review) => (
                  <article className="stay-review-card" key={review.id}>
                    <div className="stay-review-heading">
                      <div><h3>{review.author}</h3><p>{review.location}</p></div>
                      <span>{review.rating} ★</span>
                    </div>
                    <p className="stay-review-text">{review.text}</p>
                  </article>
                ))}
              </div>
            ) : <p className="stay-empty-copy">No reviews have been added for this homestay yet.</p>}
          </section>
        </div>

        <aside className="stay-sidebar">
          <section className="stay-booking-card" id="booking">
            <p className="stay-eyebrow">Your mountain escape</p>
            <h2>Find your room</h2>
            <p className="stay-booking-intro">Choose a room and send a reservation request. Your stay is pending host confirmation.</p>
            <div className="stay-booking-price">
              <span>From</span>
              <strong>{formatPrice(Math.min(...stay.rooms.map((room) => room.price)))}</strong>
              <span>per room / night</span>
            </div>
            <div className="stay-selected-room">
              <span>Selected room</span>
              <strong>{selectedRoomDetails.name}</strong>
              <span>{formatPrice(selectedRoomDetails.price)} / night</span>
            </div>
            <div className="stay-estimate" aria-live="polite">
              <div><span>Estimated stay total</span><strong>{bookingQuote ? formatPrice(bookingQuote.estimatedTotal) : 'Select dates'}</strong></div>
              {bookingQuote && (
                <p>
                  {bookingQuote.nights} {bookingQuote.nights === 1 ? 'night' : 'nights'} × {formatPrice(bookingQuote.nightlyRate)}
                  {bookingQuote.discountPercent ? ` · ${bookingQuote.discountLabel} (${bookingQuote.discountPercent}%) applied` : ''}
                </p>
              )}
              <p>Estimate is based on the listed room rate. Taxes or additional charges are not included; availability and final terms require host confirmation.</p>
            </div>
            <button
              type="button"
              className="stay-book-button"
              onClick={() => {
                setBookingFormOpen((open) => !open)
                setBookingStatus({ loading: false, message: '', error: false })
              }}
              aria-expanded={bookingFormOpen}
              aria-controls="booking-form"
            >
              {bookingFormOpen ? 'Close reservation form' : 'Request a reservation'}
            </button>

            {bookingFormOpen && (
              <form id="booking-form" onSubmit={handleBookingSubmit} className="stay-booking-form">
                <p className="stay-form-intro">Request the {selectedRoomDetails.name}. The host will confirm availability.</p>
                <label>
                  Name
                  <input name="name" value={booking.name} onChange={handleBookingChange} required maxLength={100} autoComplete="name" />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={booking.email} onChange={handleBookingChange} autoComplete="email" />
                </label>
                <label>
                  Phone
                  <input name="phone" type="tel" value={booking.phone} onChange={handleBookingChange} autoComplete="tel" pattern="[+]?[\d\s().-]{7,40}" title="Use 7 to 15 digits, with an optional country code." />
                </label>
                <p className="stay-form-hint">Provide at least an email address or a phone number.</p>
                <div className="stay-date-row">
                  <label>
                    Check-in
                    <input name="checkIn" type="date" min={today} value={booking.checkIn} onChange={handleBookingChange} required />
                  </label>
                  <label>
                    Check-out
                    <input name="checkOut" type="date" min={booking.checkIn ? nextDate(booking.checkIn) : nextDate(today)} value={booking.checkOut} onChange={handleBookingChange} required />
                  </label>
                </div>
                <label>
                  Guests
                  <input name="guests" type="number" min="1" max="30" value={booking.guests} onChange={handleBookingChange} required />
                </label>
                <button type="submit" className="stay-submit-button" disabled={bookingStatus.loading}>
                  {bookingStatus.loading ? 'Sending request…' : 'Send reservation request'}
                </button>
              </form>
            )}
            {bookingStatus.message && (
              <p role={bookingStatus.error ? 'alert' : 'status'} className={`stay-booking-status${bookingStatus.error ? ' is-error' : ''}`}>
                {bookingStatus.message}
              </p>
            )}
            <p className="stay-booking-footnote">No payment is taken here. Your reservation is not confirmed until the host responds.</p>
            <a
              className="stay-whatsapp-link"
              href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
            >
              Ask about this stay on WhatsApp
            </a>
          </section>

          <section className="stay-contact-card">
            <p className="stay-eyebrow">Questions about your stay?</p>
            <h2>We’re happy to help.</h2>
            <p>Contact the host to discuss your plans, dining preferences or arrival details.</p>
            <Link to="/contact">Contact the host <span aria-hidden="true">→</span></Link>
          </section>
        </aside>
      </div>

      <a className="stay-mobile-booking" href="#booking">
        <span><small>From</small><strong>{formatPrice(Math.min(...stay.rooms.map((room) => room.price)))}</strong><small>/ room / night</small></span>
        <span>Check rooms</span>
      </a>

      {lightboxIndex !== null && (
        <div
          className="stay-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${stay.name} photo gallery`}
          tabIndex={-1}
          ref={lightboxRef}
          onClick={() => setLightboxIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button type="button" className="stay-lightbox-close" aria-label="Close photo viewer" onClick={() => setLightboxIndex(null)}>×</button>
          {stay.gallery.length > 1 && <button type="button" className="stay-lightbox-arrow is-previous" aria-label="Previous photo" onClick={(event) => { event.stopPropagation(); moveLightbox(-1) }}>‹</button>}
          <img
            src={photoSource(stay.gallery[lightboxIndex], lightboxIndex)}
            alt={`${stay.name}, photo ${lightboxIndex + 1} of ${stay.gallery.length}`}
            onClick={(event) => event.stopPropagation()}
            onError={handlePhotoError}
          />
          {stay.gallery.length > 1 && <button type="button" className="stay-lightbox-arrow is-next" aria-label="Next photo" onClick={(event) => { event.stopPropagation(); moveLightbox(1) }}>›</button>}
          <span className="stay-lightbox-count">{lightboxIndex + 1} / {stay.gallery.length}</span>
        </div>
      )}
    </div>
  )
}
