import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/#home', label: 'Home' },
  { to: '/#homestays', label: 'Homestays' },
  { to: '/#experiences', label: 'Experiences' },
  { to: '/#explore', label: 'Explore' },
  { to: '/#gallery', label: 'Gallery' },
  { to: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(() => window.location.hash.slice(1) || 'home')
  const location = useLocation()
  const isHome = location.pathname === '/'
  const headerClass = isHome
    ? 'fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#10281e]/55 text-white backdrop-blur-sm'
    : 'sticky top-0 z-50 border-b border-[#e8e3d6] bg-[#faf8f1]/95 text-[#10281e] backdrop-blur-md'
  const navTextClass = isHome ? 'text-white/75 hover:bg-white/10 hover:text-white' : 'text-[#3f4d43] hover:bg-[#eeeadc] hover:text-[#10281e]'

  useEffect(() => {
    if (!isHome) return undefined

    const sectionIds = navLinks.map((link) => link.to.split('#')[1])
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height || 66
    const updateActiveSection = () => {
      const readingLine = headerHeight + 40
      const currentSection = sections
        .filter((section) => {
          const bounds = section.getBoundingClientRect()
          return bounds.top <= readingLine && bounds.bottom > readingLine
        })
        .at(-1)

      if (currentSection) setActiveSection(currentSection.id)
      else if (window.scrollY < 80) setActiveSection('home')
    }

    const initialFrame = requestAnimationFrame(updateActiveSection)
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      cancelAnimationFrame(initialFrame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [isHome])

  return (
    <header className={headerClass}>
      <div className="mx-auto flex min-h-[66px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/#home" className={`flex shrink-0 items-center gap-2.5 ${isHome ? 'text-white' : 'text-[#10281e]'}`} onClick={() => setOpen(false)}>
          <img src="https://thepinegetaways.com/images/logo/logomark.png" alt="" className="h-9 w-9 shrink-0 object-contain" />
          <span className="leading-tight">
            <span className="display-font block text-[15px] font-bold">The Pine Getaways</span>
            <span className={`block text-[8px] font-bold uppercase tracking-[.2em] ${isHome ? 'text-white/70' : 'text-[#777a70]'}`}>Your home above hills</span>
          </span>
        </a>

        <button
          className={`grid h-10 w-10 place-items-center border md:hidden ${isHome ? 'border-white/25 text-white' : 'border-[#ded8ca] text-[#10281e]'}`}
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span aria-hidden="true" className="text-xl leading-none">{open ? '×' : '☰'}</span>
        </button>

        <nav className="hidden items-center gap-0 md:flex">
          {navLinks.map((link) => (
            <a key={link.to} href={link.to} aria-current={isHome && activeSection === link.to.split('#')[1] ? 'location' : undefined} className={`rounded-full px-2 py-2 text-[11px] font-medium transition lg:px-3 lg:text-[12px] ${navTextClass} ${isHome && activeSection === link.to.split('#')[1] ? 'bg-white/15 text-white' : ''}`}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a href="https://drive.google.com/file/d/1QttOkehL1ogPQIDd0zdEP1S_efpYplQ3/view?usp=sharing" target="_blank" rel="noreferrer" className={`border px-3 py-2 text-[11px] font-semibold transition ${isHome ? 'border-white/25 text-white hover:bg-white/10' : 'border-[#d8d2c5] text-[#324239] hover:bg-white'}`}>↓ <span className="hidden lg:inline">Brochure</span></a>
          <a href="/#contact" className="bg-[#caa34b] px-4 py-2 text-[11px] font-semibold text-[#17291e] transition hover:bg-[#d8b85e]">Book Your Stay</a>
        </div>
      </div>

      <nav className={`overflow-hidden transition-all duration-300 md:hidden ${isHome ? 'bg-[#10281e] text-white' : 'bg-[#faf8f1] text-[#10281e]'} ${open ? `max-h-[440px] border-t ${isHome ? 'border-white/10' : 'border-[#e8e3d6]'} opacity-100` : 'max-h-0 opacity-0'}`}>
        <div className="grid grid-cols-2 gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <a key={link.to} href={link.to} aria-current={isHome && activeSection === link.to.split('#')[1] ? 'location' : undefined} className={`px-3 py-3 text-sm ${isHome && activeSection === link.to.split('#')[1] ? 'bg-white/10 text-white' : (isHome ? 'text-white/85 hover:bg-white/10' : 'text-[#324239] hover:bg-[#eeeadc]')}`} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="/#contact" className="col-span-2 bg-[#caa34b] px-3 py-3 text-center text-sm font-semibold text-[#17291e]" onClick={() => setOpen(false)}>Book Your Stay</a>
        </div>
      </nav>
    </header>
  )
}
