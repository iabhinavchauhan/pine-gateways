import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { blogPosts } from '../data/resortData'
import { resolveImage } from '../utils/resolveImage'

export default function BlogDetail() {
  const { slug } = useParams()
  const post = useMemo(() => blogPosts.find((item) => item.slug === slug), [slug])

  if (!post) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-28 text-center sm:px-8 lg:px-12">
        <p className="text-sand/70">Blog post not found.</p>
        <Link to="/blog" className="mt-8 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition hover:bg-forest/90">
          Back to journal
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-28 sm:px-8 lg:px-12">
      <div className="mb-14 rounded-[40px] border border-smoke/10 bg-smoke/5 p-10 shadow-soft backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-sand/70">{post.category}</p>
        <h1 className="mt-4 text-4xl font-semibold text-cream">{post.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-sand/80">{post.excerpt}</p>
      </div>
      <div className="overflow-hidden rounded-[40px] border border-smoke/10 bg-smoke/5 shadow-soft">
        <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(${resolveImage(post.image, post.slug)})` }} />
        <div className="space-y-6 p-10 text-sand/80">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/blog" className="inline-flex rounded-full bg-smoke/10 px-5 py-3 text-sm font-semibold text-cream transition hover:bg-smoke/15">
              Back to blog
            </Link>
            <Link to="/contact" className="inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream transition hover:bg-forest/90">
              Book a retreat
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
