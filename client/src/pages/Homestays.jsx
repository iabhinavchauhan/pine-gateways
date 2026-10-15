import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { homestays } from '../data/resortData'
import { resolveImage } from '../utils/resolveImage'

const cardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function Homestays() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12">
      <header className="mb-12 rounded-[36px] border border-smoke/10 bg-smoke/5 p-8 shadow-soft backdrop-blur-xl sm:p-10">
        <p className="text-xs uppercase tracking-[0.38em] text-sand/70">Stay collection</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-cream sm:text-5xl">
          Quiet mountain stays shaped for slow mornings and view-filled evenings.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-sand/80">
          Discover handcrafted hill retreats with warm hospitality, regional food, and cozy spaces built for rest.
        </p>
      </header>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-smoke/10 bg-forest/20 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-sand/70">Homes</p>
          <p className="mt-3 text-3xl font-semibold text-cream">3</p>
        </div>
        <div className="rounded-[28px] border border-smoke/10 bg-forest/20 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-sand/70">Locations</p>
          <p className="mt-3 text-3xl font-semibold text-cream">Kalimpong</p>
        </div>
        <div className="rounded-[28px] border border-smoke/10 bg-forest/20 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-sand/70">Style</p>
          <p className="mt-3 text-3xl font-semibold text-cream">Slow luxury</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {homestays.map((stay, index) => (
          <motion.article
            key={stay.slug}
            variants={cardReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group overflow-hidden rounded-[32px] border border-smoke/10 bg-smoke/5 shadow-soft"
          >
            <div className="h-80 overflow-hidden bg-[#e8e6dd]">
              <img
                src={resolveImage(stay.mainImage, stay.slug)}
                alt={`${stay.name} property`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-5 p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.32em] text-sand/70">{stay.location}</p>
                <span className="rounded-full bg-forest/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream">
                  {stay.rooms?.length || 1} rooms
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-cream">{stay.name}</h2>
              <p className="text-sm leading-7 text-sand/80">{stay.tagline}</p>
              <div className="flex items-center justify-between border-t border-smoke/10 pt-5">
                <span className="text-sm font-semibold text-cream">{`From ₹${Math.min(...stay.rooms.map((room) => room.price)).toLocaleString('en-IN')} / room / night`}</span>
                <Link
                  to={`/homestays/${stay.slug}`}
                  className="inline-flex rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-forest transition hover:bg-white"
                >
                  Explore stay
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
