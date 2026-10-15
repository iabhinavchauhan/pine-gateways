import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ResortProvider } from './context/ResortContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Homestays from './pages/Homestays'
import HomestayDetails from './pages/HomestayDetails'
import Gallery from './pages/Gallery'
import Food from './pages/Food'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Reviews from './pages/Reviews'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <ResortProvider>
        <div className="min-h-screen bg-[#faf8f1] text-[#1b2b22]">
          <Navbar />
          <main className="relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/homestays" element={<Homestays />} />
              <Route path="/homestays/:slug" element={<HomestayDetails />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/food" element={<Food />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ResortProvider>
    </BrowserRouter>
  )
}

export default App
