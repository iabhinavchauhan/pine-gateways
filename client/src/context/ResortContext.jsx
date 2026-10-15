import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { foodItems, homestays, initialReviews } from '../data/resortData'
import { apiRequest } from '../utils/api'

export const ResortContext = createContext({
  theme: 'dark',
  wishlist: [],
  favorites: [],
  reviews: [],
  reviewsError: '',
  recentViews: [],
  bookingDraft: {},
  toggleWishlist: () => {},
  toggleFavorite: () => {},
  addReview: async () => {},
  addRecentView: () => {},
  updateBookingDraft: () => {},
  homestays: [],
  foodItems: [],
})

function loadStorage(key, fallback) {
  try {
    const cached = window.localStorage.getItem(`resort.${key}`)
    return cached ? JSON.parse(cached) : fallback
  } catch {
    return fallback
  }
}

function saveStorage(key, value) {
  window.localStorage.setItem(`resort.${key}`, JSON.stringify(value))
}

export function ResortProvider({ children }) {
  const [theme, setTheme] = useState(loadStorage('theme', 'dark'))
  const [wishlist, setWishlist] = useState(loadStorage('wishlist', []))
  const [favorites, setFavorites] = useState(loadStorage('favorites', []))
  const [reviews, setReviews] = useState(initialReviews)
  const [reviewsError, setReviewsError] = useState('')
  const [recentViews, setRecentViews] = useState(loadStorage('recentViews', []))
  const [bookingDraft, setBookingDraft] = useState(
    loadStorage('bookingDraft', {
      homestay: homestays[0].slug,
      checkIn: '',
      checkOut: '',
      guests: 2,
      room: homestays[0].rooms[0].name,
    }),
  )

  useEffect(() => {
    saveStorage('theme', theme)
  }, [theme])

  useEffect(() => {
    saveStorage('wishlist', wishlist)
  }, [wishlist])

  useEffect(() => {
    saveStorage('favorites', favorites)
  }, [favorites])

  useEffect(() => {
    saveStorage('recentViews', recentViews)
  }, [recentViews])

  useEffect(() => {
    saveStorage('bookingDraft', bookingDraft)
  }, [bookingDraft])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    let active = true
    apiRequest('/reviews')
      .then(({ reviews: serverReviews }) => {
        if (active) {
          setReviews(serverReviews)
          setReviewsError('')
        }
      })
      .catch((error) => {
        if (active) setReviewsError(error.message)
      })
    return () => {
      active = false
    }
  }, [])

  const toggleWishlist = (slug) => {
    setWishlist((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    )
  }

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const addReview = useCallback(async (review) => {
    const { review: savedReview } = await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    })
    setReviews((current) => [savedReview, ...current])
    setReviewsError('')
    return savedReview
  }, [])

  const addRecentView = (slug) => {
    setRecentViews((current) => {
      const next = [slug, ...current.filter((item) => item !== slug)]
      return next.slice(0, 5)
    })
  }

  const updateBookingDraft = (patch) => {
    setBookingDraft((current) => ({ ...current, ...patch }))
  }

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      wishlist,
      toggleWishlist,
      favorites,
      toggleFavorite,
      reviews,
      reviewsError,
      addReview,
      recentViews,
      addRecentView,
      bookingDraft,
      updateBookingDraft,
      homestays,
      foodItems,
    }),
    [theme, wishlist, favorites, reviews, reviewsError, recentViews, bookingDraft, addReview],
  )

  return <ResortContext.Provider value={value}>{children}</ResortContext.Provider>
}
