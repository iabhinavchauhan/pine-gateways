import { blogPosts } from '../data/resortData'
import { resolveImage } from '../utils/resolveImage'

export default function Blog() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12">
      <header className="mb-12 rounded-[36px] border border-smoke/10 bg-smoke/5 p-8 shadow-soft backdrop-blur-xl sm:p-10">
        <p className="text-xs uppercase tracking-[0.38em] text-sand/70">Journal</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-cream sm:text-5xl">
          Notes from the valley, the road, and a slower way to travel.
        </h1>
      </header>

      <div className="space-y-12">
        {blogPosts.map((post) => (
          <section key={post.slug} className="rounded-[34px] border border-smoke/10 bg-smoke/5 p-6 shadow-soft sm:p-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-sand/70">{post.category}</p>
                <h2 className="mt-3 text-3xl font-semibold text-cream sm:text-4xl">{post.title}</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-sand/70">{post.excerpt}</p>
            </div>

            <div
              className="mb-8 h-72 overflow-hidden rounded-[28px] bg-cover bg-center sm:h-96"
              style={{ backgroundImage: `url(${resolveImage(post.image, post.slug)})` }}
            />

            <div className="space-y-6 text-base leading-8 text-sand/80">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={`${post.slug}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
