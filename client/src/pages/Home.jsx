import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { homestays } from '../data/resortData'
import { apiRequest } from '../utils/api'

const experiences = [
  ['01', 'Mountain mornings', 'Take in the shifting clouds with a cup of tea and a view from the porch.'],
  ['02', 'Nature escapes', 'Find pine trails, waterfalls and quiet village walks close to your stay.'],
  ['03', 'Scenic photography', 'Catch prayer flags, terraced hills and changing light across the mountains.'],
  ['04', 'Local food', 'Share fresh, home-cooked meals shaped by the ingredients and recipes of the hills.'],
  ['05', 'Road trips', 'Arrange a local vehicle for day trips towards the Silk Route and Sikkim.'],
  ['06', 'Slow living', 'Leave room in the day for a view, a conversation and a little more rest.'],
]

const destinations = [
  {
    name: 'Darjeeling',
    description: 'Tea country, heritage streets and Himalayan panoramas make this a rewarding day out.',
    image: 'https://thepinegetaways.com/images/destinations/darjeeling.jpg',
    tags: ['Tea gardens', 'Himalayan views', 'Heritage'],
  },
  {
    name: 'Sikkim',
    description: 'Travel towards monasteries, high mountain scenery and a distinct local culture.',
    image: 'https://thepinegetaways.com/images/destinations/sikkim.jpg',
    tags: ['Monasteries', 'Local culture', 'Mountain roads'],
  },
  {
    name: 'Silk Route',
    description: 'Follow a historic mountain road through cloud-level villages and expansive views.',
    image: 'https://thepinegetaways.com/images/destinations/silk-route.jpg',
    tags: ['Scenic drives', 'Adventure', 'Nature'],
  },
]

const attractionClusters = [
  ['Kalimpong', 'Deolo Hill', 'Durpin Dara', 'Durpin Monastery', 'Mangal Dham', "Dr. Graham's Homes", 'Cactus and Orchid Nurseries', 'Morgan House', 'Lovers Meet View Point'],
  ['Pedong and Silk Route', 'Damsang Fort', 'Sangchen Dorjee Monastery', 'Rishi Khola', 'Sillery Gaon', 'Icchey Gaon', 'Ramdhura'],
  ['Lava and Neora Valley', 'Lava Monastery', 'Neora Valley National Park', 'Kolakham', 'Changey Falls', 'Loleygaon', 'Canopy Walk', 'Jhandi Dara', 'Rishop / Tiffin Dara', 'Rachela Pass'],
  ['Scenic getaways', 'Teesta Valley', 'Samthar', 'Tinchuley', 'Kaffergaon'],
  ['Zuluk and Old Silk Route', 'Rongli', 'Zuluk', 'Nathang Valley', 'Silent Valley'],
]

const galleryItems = [
  { title: 'The Kanchenjunga range', type: 'Views', image: 'https://thepinegetaways.com/images/gallery/views-kanchenjunga.jpg' },
  { title: 'A quiet guest room', type: 'Rooms', image: 'https://thepinegetaways.com/images/gallery/rooms-blue-floral.jpg' },
  { title: 'A generous homemade spread', type: 'Food', image: 'https://thepinegetaways.com/images/gallery/food-generous-spread.jpg' },
  { title: 'A slow sunrise together', type: 'Experiences', image: 'https://thepinegetaways.com/images/gallery/experiences-couple-sunrise.jpg' },
  { title: 'Peaks above the clouds', type: 'Views', image: 'https://thepinegetaways.com/images/gallery/views-clouds.jpg' },
  { title: 'A warm twin-bed room', type: 'Rooms', image: 'https://thepinegetaways.com/images/gallery/rooms-twin-bed.jpg' },
  { title: 'Tea by the campfire', type: 'Food', image: 'https://thepinegetaways.com/images/gallery/food-evening-tea.jpg' },
  { title: 'Forest birdwatching', type: 'Experiences', image: 'https://thepinegetaways.com/images/gallery/experiences-birdwatching.jpg' },
  { title: 'Changey Falls', type: 'Views', image: 'https://thepinegetaways.com/images/gallery/views-changey-falls.jpg' },
  { title: 'A bright single room', type: 'Rooms', image: 'https://thepinegetaways.com/images/gallery/rooms-vibrant-single.jpg' },
  { title: 'Grilled skewers', type: 'Food', image: 'https://thepinegetaways.com/images/gallery/food-grilled-skewers.jpg' },
  { title: 'Porch time in Pradhan Gaon', type: 'Experiences', image: 'https://thepinegetaways.com/images/gallery/experiences-porch-chat.jpg' },
  { title: 'Sunset over the valley', type: 'Views', image: 'https://thepinegetaways.com/images/gallery/views-sunset-valley.jpg' },
  { title: 'A wood-paneled bedroom', type: 'Rooms', image: 'https://thepinegetaways.com/images/gallery/rooms-wood-paneled.jpg' },
  { title: 'Traditional fish thali', type: 'Food', image: 'https://thepinegetaways.com/images/gallery/food-fish-thali.jpg' },
  { title: 'An evening bonfire', type: 'Experiences', image: 'https://thepinegetaways.com/images/gallery/experiences-bonfire.jpg' },
  { title: 'A waterfall viewpoint', type: 'Views', image: 'https://thepinegetaways.com/images/gallery/views-waterfall-viewpoint.jpg' },
  { title: 'A spacious family room', type: 'Rooms', image: 'https://thepinegetaways.com/images/gallery/rooms-family.jpg' },
  { title: 'Home-style curry and rice', type: 'Food', image: 'https://thepinegetaways.com/images/gallery/food-curry-rice.jpg' },
  { title: 'A walk to the viewpoint', type: 'Experiences', image: 'https://thepinegetaways.com/images/gallery/experiences-trek-viewpoint.jpg' },
]

const reasonsToStay = [
  ['Scenic locations', 'Homes looking out over pine forests, ridges and open valley.'],
  ['Easy to reach', 'A straightforward drive from NJP, Bagdogra and Siliguri.'],
  ['Road-trip friendly', 'A natural base between the plains, the Silk Route and Sikkim.'],
  ['Warm hospitality', 'Fresh home cooking and thoughtful care from local hosts.'],
  ['A quieter setting', 'Offbeat villages away from the busiest hill-station routes.'],
  ['Room for everyone', 'Comfortable spaces for families, couples and groups.'],
]

const sightseeingOptions = ['Lava', 'Loleygaon', 'Rishop', 'Delo', 'Changey Falls', 'Kalimpong town', 'Offbeat villages', 'Local sightseeing']
const pineTrees = Array.from({ length: 19 }, (_, index) => ({
  left: `${index * 5.55 + 1}%`,
  height: `${34 + ((index * 17) % 34)}px`,
  width: `${20 + ((index * 7) % 18)}px`,
}))

function wasWelcomeDismissed() {
  try {
    return window.sessionStorage.getItem('pine-welcome-dismissed') === 'true'
  } catch {
    return false
  }
}

export default function Home() {
  const [galleryFilter, setGalleryFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('')
  const [preferredStay, setPreferredStay] = useState('No preference')
  const [welcomeOpen, setWelcomeOpen] = useState(() => !wasWelcomeDismissed())
  const [enquiryStatus, setEnquiryStatus] = useState({ loading: false, message: '', error: false })
  const visibleGallery = galleryFilter === 'All' ? galleryItems : galleryItems.filter((item) => item.type === galleryFilter)
  const visibleStays = locationFilter
    ? homestays.filter((stay) => stay.location === locationFilter)
    : homestays

  const dismissWelcome = () => {
    try {
      window.sessionStorage.setItem('pine-welcome-dismissed', 'true')
    } catch {
      // The dialog can still be dismissed when storage is unavailable.
    }
    setWelcomeOpen(false)
  }

  useEffect(() => {
    if (!welcomeOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') dismissWelcome()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [welcomeOpen])

  const sendEnquiry = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const fields = Object.fromEntries(values.entries())
    const message = [
      'Hello, I would like to enquire about a stay at The Pine Getaways.',
      `Name: ${fields.name}`,
      `Phone: ${fields.phone}`,
      `Check-in: ${fields.checkin}`,
      `Check-out: ${fields.checkout}`,
      `Guests: ${fields.guests}`,
      `Rooms: ${fields.rooms}`,
      `Preferred homestay: ${fields.homestay}`,
      `Message: ${fields.message || 'Not provided'}`,
    ].join('\n')
    const whatsappWindow = window.open('about:blank', '_blank')
    setEnquiryStatus({ loading: true, message: '', error: false })
    try {
      await apiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: fields.name,
          phone: fields.phone,
          checkIn: fields.checkin,
          checkOut: fields.checkout,
          guests: fields.guests,
          rooms: fields.rooms,
          homestay: fields.homestay,
          message: fields.message || 'No additional message provided.',
        }),
      })
      if (whatsappWindow) {
        whatsappWindow.location.href = `https://wa.me/919433898908?text=${encodeURIComponent(message)}`
      }
      setEnquiryStatus({
        loading: false,
        message: whatsappWindow
          ? 'Your enquiry is saved. WhatsApp is opening so you can send it to our team.'
          : 'Your enquiry is saved. Allow pop-ups to continue to WhatsApp.',
        error: false,
      })
      form.reset()
      setPreferredStay('No preference')
    } catch (error) {
      if (whatsappWindow) whatsappWindow.close()
      setEnquiryStatus({ loading: false, message: error.message, error: true })
    }
  }

  const chooseStay = (name) => {
    setPreferredStay(name)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="overflow-hidden bg-[#faf8f1] text-[#1b2b22]">
      {welcomeOpen && <div className="welcome-overlay" onClick={(event) => { if (event.target === event.currentTarget) dismissWelcome() }}>
        <section className="welcome-dialog" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <div className="welcome-banner"><span aria-hidden="true" className="display-font text-5xl text-white/90">♧</span><button type="button" aria-label="Close welcome message" onClick={dismissWelcome} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/15 text-2xl text-white hover:bg-black/25">×</button></div>
            <div className="p-5 sm:p-9">
            <p className="section-kicker">Welcome</p><h2 id="welcome-title" className="display-font mt-2 text-3xl font-semibold text-[#10281e] sm:text-4xl">The Pine Getaways</h2><p className="text-xs font-bold uppercase tracking-[.19em] text-[#9a7b36]">Your home above hills</p>
            <p className="mt-3 text-sm leading-6 text-[#70746c] sm:mt-5 sm:text-base sm:leading-7">Three welcoming homes in the Kalimpong hills, each set in a different landscape and hosted by people who call it home. Make space for mountain views, village life and quieter days.</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 sm:mt-6 sm:gap-x-5 sm:gap-y-3">{['Scenic mountain views', 'Local homestay experience', 'Comfortable rooms', 'Peaceful surroundings', 'Family-friendly stays', 'Great for couples and groups'].map((item) => <li key={item} className="flex items-start gap-2 text-xs leading-5 text-[#445348] sm:gap-3 sm:text-sm"><span className="text-[#b08d3b]">✓</span>{item}</li>)}</ul>
            <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3"><a href="#homestays" onClick={dismissWelcome} className="bg-[#caa34b] px-5 py-3 text-sm font-semibold text-[#15271e]">Explore Homestays</a><button type="button" onClick={dismissWelcome} className="px-4 py-3 text-sm font-semibold text-[#25382c]">Maybe later</button></div>
          </div>
        </section>
      </div>}
      <section id="home" className="home-hero relative isolate flex items-end bg-[#10281e]">
        <div className="hero-atmosphere pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <img className="hero-cloud hero-cloud--one" src="/hero-clouds.png?v=2" alt="" />
          <img className="hero-cloud hero-cloud--two" src="/hero-clouds.png?v=2" alt="" />
          <img className="hero-cloud hero-cloud--three" src="/hero-clouds.png?v=2" alt="" />
          <img className="hero-cloud hero-cloud--four" src="/hero-clouds.png?v=2" alt="" />
          <span className="hero-distant-hills" />
          <span className="hero-ridge" />
          <span className="hero-spark hero-spark--one" />
          <span className="hero-spark hero-spark--two" />
          <span className="hero-spark hero-spark--three" />
          <span className="hero-spark hero-spark--four" />
          <span className="hero-ground" />
          {pineTrees.map((tree, index) => <span key={index} className="hero-pine" style={{ left: tree.left, height: tree.height, width: tree.width }} />)}
        </div>
        <div className="home-shell hero-inner relative z-10 flex w-full flex-col justify-end pb-12 pt-24 text-white sm:pb-16 lg:pb-20">
          <div className="max-w-[720px] animate-[rise-in_.8s_ease_both]">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[.25em] text-[#ddc276] sm:text-xs">Welcome to offbeat Kalimpong</p>
            <h1 className="display-font max-w-[650px] text-[42px] font-semibold leading-[1.04] text-[#fffdf6] sm:text-6xl lg:text-[72px]">Your gateway to the Eastern Himalayas</h1>
            <p className="mt-5 max-w-[510px] text-sm leading-6 text-white/80 sm:text-base sm:leading-7">Quiet homestays close to nature, with an easy route towards Darjeeling, Sikkim and the Silk Route.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#contact" className="bg-[#caa34b] px-5 py-3 text-xs font-bold text-[#16281e] transition hover:bg-[#dfbc60]">Book Your Stay <span aria-hidden="true">→</span></a>
              <a href="#homestays" className="border border-white/35 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10">Explore Homestays</a>
            </div>
            <form
              className="mt-6 flex max-w-[520px] flex-wrap items-end gap-3 rounded-sm border border-white/20 bg-[#10281e]/75 p-3 backdrop-blur-sm"
              onSubmit={(event) => {
                event.preventDefault()
                document.getElementById('homestays')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <label className="min-w-[210px] flex-1 text-[10px] font-semibold uppercase tracking-[.12em] text-white/75">
                Find a homestay by location
                <select
                  className="mt-2 min-h-10 w-full border border-white/25 bg-[#faf8f1] px-3 text-xs font-medium text-[#26352e]"
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                >
                  <option value="">All three locations</option>
                  {homestays.map((stay) => <option key={stay.slug} value={stay.location}>{stay.location}</option>)}
                </select>
              </label>
              <button type="submit" className="min-h-10 bg-[#caa34b] px-5 text-xs font-bold text-[#16281e] transition hover:bg-[#dfbc60]">Explore stays</button>
            </form>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/20 pt-4 text-[9px] font-bold uppercase tracking-[.16em] text-white/75 sm:mt-12 sm:text-[10px]">
            <span>Damsang Valley</span><span className="text-[#d5b458]">•</span><span>Mairung</span><span className="text-[#d5b458]">•</span><span>Pradhan Gaon</span>
          </div>
        </div>
      </section>

      <section id="homestays" className="home-section home-shell py-16 sm:py-24">
        <div className="mb-9 grid gap-4 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <div><p className="section-kicker">Our homestays</p><h2 className="section-title mt-3">Three beautiful locations</h2></div>
          <p className="max-w-xl text-sm leading-7 text-[#6c7169] md:justify-self-end">Each home sits in a different corner of Kalimpong district: a ridge, a valley and a pine forest. Choose the view you would like to wake up to.</p>
        </div>
        <div className="space-y-5">
          {visibleStays.map((stay, index) => (
            <article key={stay.name} className="stay-card">
              <div className="stay-photo relative">
                <Link to={`/homestays/${stay.slug}`} className="block h-full min-h-0 overflow-hidden">
                  <img src={stay.mainImage} alt={`${stay.name} property`} className="home-image transition duration-500 hover:scale-105" />
                </Link>
                <span className="absolute left-4 top-4 bg-[#faf8f1] px-3 py-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#263c2d]">0{index + 1} / 03</span>
              </div>
              <div className="stay-copy">
                <p className="section-kicker">⌖ &nbsp;{stay.location}</p>
                <h3 className="display-font mt-3 text-3xl font-semibold text-[#10281e] sm:text-4xl">{stay.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#73766d]">{stay.description}</p>
                <ul className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">{stay.amenities.map((point) => <li key={point} className="flex items-start gap-2 text-xs leading-5 text-[#47554a]"><span className="mt-[2px] text-[#b39042]">✓</span>{point}</li>)}</ul>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-[#e9e3d7] pt-5">
                  <p className="text-xs text-[#77786f]"><span className="display-font text-2xl font-bold text-[#173528]">₹{Math.min(...stay.rooms.map((room) => room.price)).toLocaleString('en-IN')}</span><br /><span className="mt-1 inline-block">from / room / night</span></p>
                  <div className="flex flex-wrap gap-2"><Link to={`/homestays/${stay.slug}`} className="border border-[#173528] px-4 py-2.5 text-xs font-bold text-[#173528] transition hover:bg-[#173528] hover:text-white">View photos & details →</Link><button type="button" onClick={() => chooseStay(stay.name)} className="bg-[#caa34b] px-4 py-2.5 text-xs font-bold text-[#173528] transition hover:bg-[#d8b85e]">Book Request</button></div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-4 bg-[#f0eddf] px-5 py-4"><span className="text-xl text-[#a58231]">⌖</span><div><p className="text-sm font-bold text-[#213a2b]">Three distinct settings</p><p className="mt-1 text-xs text-[#72766d]">Explore stays in Mairung, Damsang Valley and Pradhan Gaon.</p></div></div>
          <div className="flex items-center gap-4 bg-[#f0eddf] px-5 py-4"><span className="text-xl text-[#a58231]">↗</span><p className="text-xs leading-5 text-[#535e53]">Send a reservation request and wait for the host to confirm availability.</p></div>
        </div>
      </section>

      <section id="experiences" className="home-section border-y border-[#e9e3d7] bg-[#f5f2e8]">
        <div className="home-shell py-16 sm:py-20">
          <div className="mb-8 max-w-xl"><p className="section-kicker">Stay experience</p><h2 className="section-title mt-3">More than just a stay</h2><p className="mt-3 text-sm leading-6 text-[#6c7169]">Full board, warm company, and a slower rhythm than home.</p></div>
          <div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">{experiences.map(([number, title, text]) => <article key={title} className="experience-item"><p className="text-[10px] font-bold tracking-[.18em] text-[#b08d3b]">{number}</p><h3 className="display-font mt-2 text-xl font-semibold text-[#173528]">{title}</h3><p className="mt-2 max-w-sm text-xs leading-6 text-[#73766d]">{text}</p></article>)}</div>
        </div>
      </section>

      <section id="explore" className="home-section bg-[#10281e] text-white">
        <div className="home-shell py-16 sm:py-20">
          <div className="mb-8 grid gap-4 md:grid-cols-[1fr_.8fr] md:items-end"><div><p className="section-kicker !text-[#d0b45e]">Places to visit</p><h2 className="display-font mt-3 text-3xl font-semibold leading-tight text-[#fffdf6] sm:text-5xl">Stay close to the mountains. Explore more.</h2></div><p className="max-w-md text-sm leading-6 text-white/65 md:justify-self-end">A natural stop between the plains and the high country, with day trips in every direction.</p></div>
          <div className="grid gap-4 md:grid-cols-3">{destinations.map((destination) => <article key={destination.name} className="group overflow-hidden border border-white/10 bg-white/[.035]"><div className="h-52 overflow-hidden sm:h-60"><img src={destination.image} alt={`${destination.name} landscape`} className="home-image transition duration-700 group-hover:scale-105" /></div><div className="px-5 py-5"><h3 className="display-font text-2xl font-semibold">{destination.name}</h3><p className="mt-2 min-h-[66px] text-xs leading-5 text-white/65">{destination.description}</p><div className="mt-4 flex flex-wrap gap-2">{destination.tags.map((tag) => <span key={tag} className="border border-white/15 px-2 py-1 text-[9px] text-white/70">{tag}</span>)}</div></div></article>)}</div>
        </div>
      </section>

      <section className="home-shell py-16 sm:py-20">
        <div className="mb-8 max-w-2xl"><p className="section-kicker">Nearby attractions</p><h2 className="section-title mt-3">Five clusters, one base</h2><p className="mt-3 text-sm leading-6 text-[#6c7169]">Viewpoints, monasteries, waterfalls and cloud-level villages, grouped by the way you travel.</p></div>
        <div className="grid gap-x-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{attractionClusters.map(([name, ...places], index) => <article key={name} className="border-t border-[#dcd6c8] py-5"><div className="flex items-center gap-3"><span className="display-font text-2xl text-[#bd9844]">0{index + 1}</span><h3 className="text-sm font-bold text-[#1b3527]">{name}</h3></div><ul className="mt-4 space-y-2 text-xs text-[#73766d]">{places.map((place) => <li key={place}>{place}</li>)}</ul></article>)}</div>
      </section>

      <section className="border-y border-[#e9e3d7] bg-[#f5f2e8]">
        <div className="home-shell grid gap-8 py-16 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div><p className="section-kicker">Getting here and around</p><h2 className="section-title mt-3">The journey, taken care of</h2><p className="mt-3 text-sm leading-6 text-[#6c7169]">Arrange a local pickup and make the most of the road into the hills.</p></div>
          <div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["NJP Railway Station", 'Around 3 hours'], ['Bagdogra Airport', 'Around 3.5 hours'], ['New Mal Junction', 'Around 2.5 hours'], ['Siliguri', 'Around 3 hours']].map(([name, time]) => <div key={name} className="border border-[#e2dccf] bg-[#faf8f1] p-4"><p className="text-[9px] font-bold uppercase tracking-[.17em] text-[#a1813d]">Pickup</p><h3 className="mt-3 text-sm font-bold text-[#193426]">{name}</h3><p className="mt-1 text-xs text-[#77786f]">{time}</p></div>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="bg-[#10281e] p-5 text-white"><p className="section-kicker !text-[#d0b45e]">Vehicles</p><h3 className="display-font mt-2 text-2xl">Choose your ride</h3><ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/75"><li>5-seater · couples</li><li>10-seater · groups</li><li>Brezza · premium</li><li>Innova · premium</li></ul><p className="mt-4 text-[10px] text-white/50">Other vehicles can be arranged on request.</p></article>
              <article className="border border-[#e2dccf] bg-[#faf8f1] p-5"><p className="section-kicker">Sightseeing</p><h3 className="display-font mt-2 text-2xl text-[#173528]">Private rides for the day</h3><div className="mt-4 flex flex-wrap gap-2">{sightseeingOptions.map((place) => <span key={place} className="border border-[#e3ddcf] px-2 py-1 text-[10px] text-[#60685f]">{place}</span>)}</div></article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e9e3d7] bg-[#f5f2e8]">
        <div className="home-shell py-16 sm:py-20"><div className="mb-8 max-w-2xl"><p className="section-kicker">Let's plan your getaway</p><h2 className="section-title mt-3">Why stay with The Pine Getaways</h2></div><div className="grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">{reasonsToStay.map(([title, text], index) => <article key={title} className="experience-item"><p className="text-[10px] font-bold tracking-[.18em] text-[#b08d3b]">0{index + 1}</p><h3 className="display-font mt-2 text-xl font-semibold text-[#173528]">{title}</h3><p className="mt-2 max-w-sm text-xs leading-6 text-[#73766d]">{text}</p></article>)}</div></div>
      </section>

      <section className="home-shell py-16 sm:py-20">
        <div className="mb-8"><p className="section-kicker">A closer look</p><h2 className="section-title mt-3">Rooms, views, food and moments in between</h2></div>
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter gallery">{['All', 'Rooms', 'Views', 'Food', 'Experiences'].map((filter) => <button key={filter} type="button" onClick={() => setGalleryFilter(filter)} aria-pressed={galleryFilter === filter} className={`px-3 py-2 text-xs font-semibold transition ${galleryFilter === filter ? 'bg-[#173528] text-white' : 'border border-[#ddd7c9] text-[#58645a] hover:bg-[#eeebdf]'}`}>{filter}</button>)}</div>
        <div id="gallery" className="home-section grid grid-cols-2 gap-3 md:grid-cols-4">{visibleGallery.map((item) => <figure key={item.title} className="gallery-tile"><img src={item.image} alt={item.title} className="home-image" /><figcaption className="absolute bottom-0 left-0 z-10 p-4 text-white"><span className="text-[9px] font-bold uppercase tracking-[.17em] text-[#e2c96f]">{item.type}</span><h3 className="display-font mt-1 text-base font-semibold sm:text-lg">{item.title}</h3></figcaption></figure>)}</div>
      </section>

      <section className="bg-[#10281e] text-white"><div className="home-shell py-16 sm:py-20"><p className="section-kicker !text-[#d0b45e]">The Pine Getaways</p><h2 className="display-font mt-3 max-w-3xl text-3xl font-semibold sm:text-5xl">Find your own pace in the Kalimpong hills.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/75">Browse the three homestays, compare the available room rates and send a request for the dates you have in mind. Your host will confirm availability directly.</p><a href="#homestays" className="mt-6 inline-flex bg-[#caa34b] px-5 py-3 text-xs font-bold text-[#16281e] transition hover:bg-[#dfbc60]">Explore the stays <span aria-hidden="true" className="ml-2">→</span></a></div></section>

      <section id="contact" className="home-section home-shell py-16 sm:py-20">
        <div className="mb-8 max-w-xl"><p className="section-kicker">Plan your getaway</p><h2 className="section-title mt-3">Tell us about your trip</h2><p className="mt-3 text-sm leading-6 text-[#6c7169]">Share your dates and preferences. Your enquiry opens in WhatsApp, ready for you to send.</p></div>
        <div className="grid gap-6 lg:grid-cols-[1.45fr_.75fr]">
          <form onSubmit={sendEnquiry} className="border border-[#e5dfd1] bg-white p-5 sm:p-7">
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <label className="text-[11px] font-semibold text-[#415044]">Your full name *<input className="enquiry-input mt-2" name="name" placeholder="Name" required /></label>
              <label className="text-[11px] font-semibold text-[#415044]">Phone / WhatsApp *<input className="enquiry-input mt-2" name="phone" placeholder="+91" type="tel" required /></label>
              <label className="text-[11px] font-semibold text-[#415044]">Check-in *<input className="enquiry-input mt-2" name="checkin" type="date" required /></label>
              <label className="text-[11px] font-semibold text-[#415044]">Check-out *<input className="enquiry-input mt-2" name="checkout" type="date" required /></label>
              <label className="text-[11px] font-semibold text-[#415044]">Guests<input className="enquiry-input mt-2" name="guests" type="number" min="1" defaultValue="2" /></label>
              <label className="text-[11px] font-semibold text-[#415044]">No. of rooms *<input className="enquiry-input mt-2" name="rooms" type="number" min="1" defaultValue="1" required /></label>
              <label className="text-[11px] font-semibold text-[#415044] sm:col-span-2">Preferred homestay<select className="enquiry-input mt-2" name="homestay" value={preferredStay} onChange={(event) => setPreferredStay(event.target.value)}><option>No preference</option>{homestays.map((stay) => <option key={stay.name}>{stay.name}</option>)}</select></label>
              <label className="text-[11px] font-semibold text-[#415044] sm:col-span-2">Message<textarea className="enquiry-input mt-2 resize-y" name="message" rows="4" placeholder="Anything else we should know?" /></label>
              <button disabled={enquiryStatus.loading} className="sm:col-span-2 bg-[#24c96b] px-5 py-3 text-sm font-bold text-[#0b2819] transition hover:bg-[#20b95f] disabled:cursor-wait disabled:opacity-60" type="submit">{enquiryStatus.loading ? 'Saving enquiry…' : '◉  Send via WhatsApp'}</button>
            </div>
            <p className="mt-3 text-[10px] text-[#8a8b80]">Your details open as a message to our local team.</p>
            {enquiryStatus.message && <p role={enquiryStatus.error ? 'alert' : 'status'} className={`mt-3 text-xs ${enquiryStatus.error ? 'text-red-700' : 'text-emerald-800'}`}>{enquiryStatus.message}</p>}
          </form>
          <aside className="bg-[#10281e] p-6 text-white sm:p-8"><p className="section-kicker !text-[#d0b45e]">Contact us</p><h3 className="display-font mt-3 text-2xl font-semibold">Prefer to talk it through?</h3><p className="mt-2 text-xs leading-5 text-white/65">Call or WhatsApp us directly.</p><div className="mt-6 space-y-3 text-sm">{['+91 94338 98908', '+91 98307 50247', '+91 87773 29304', '+91 80172 84362'].map((phone) => <a key={phone} href={`tel:${phone.replaceAll(' ', '')}`} className="block text-white/85 hover:text-[#e2c96f]">⌕ &nbsp;{phone}</a>)}</div><div className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-white/70"><p>@the_pine_getaways</p><p>The Pine Getaways</p><p>Kalimpong District, North Bengal</p></div></aside>
        </div>
      </section>

      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"><a href="tel:+919433898908" className="floating-contact flex items-center gap-2 bg-[#173528] px-4 py-2.5 text-xs font-semibold text-white"><span aria-hidden="true">☎</span> Call us</a><a href="https://wa.me/919433898908" target="_blank" rel="noreferrer" className="floating-contact flex items-center gap-2 bg-[#24c96b] px-4 py-2.5 text-xs font-bold text-[#0b2819]"><span aria-hidden="true">◉</span> Chat with us</a></div>
    </div>
  )
}