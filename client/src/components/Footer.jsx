export default function Footer() {
  return (
    <footer className="bg-[#10281e] px-5 py-12 text-[#e9e7d9] sm:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-9 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="display-font text-lg font-bold text-white">The Pine Getaways</p>
          <p className="max-w-xs text-sm leading-6 text-[#b9c2b8]">A quiet base in the Kalimpong hills, close to forests, mountain roads and village life.</p>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#d2b45f]">Quick links</h3>
          <ul className="space-y-2.5 text-sm text-[#d9dfd5]">
            <li>
              <a href="/#home" className="hover:text-white">Home</a>
            </li>
            <li>
              <a href="/#homestays" className="hover:text-white">Homestays</a>
            </li>
            <li>
              <a href="/#experiences" className="hover:text-white">Experiences</a>
            </li>
            <li>
              <a href="/#gallery" className="hover:text-white">Gallery</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#d2b45f]">Destinations</h3>
          <ul className="space-y-2.5 text-sm text-[#d9dfd5]">
            <li>Darjeeling</li><li>Sikkim</li><li>Silk Route</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#d2b45f]">Contact</h3>
          <div className="space-y-2.5 text-sm text-[#d9dfd5]">
            <a href="tel:+919433898908" className="block hover:text-white">+91 94338 98908</a>
            <a href="https://instagram.com/the_pine_getaways" target="_blank" rel="noreferrer" className="block hover:text-white">@the_pine_getaways</a>
            <p>Kalimpong District, North Bengal</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1240px] border-t border-white/10 pt-5 text-xs text-[#9faea1]">© {new Date().getFullYear()} The Pine Getaways</div>
    </footer>
  )
}
