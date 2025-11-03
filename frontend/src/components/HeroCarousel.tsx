import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, Car, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Slide {
  id: number
  category: string
  title: string
  description: string
  image: string
  icon: typeof Home
  color: string
}

const slides: Slide[] = [
  {
    id: 1,
    category: 'Houses',
    title: 'Find Your Dream Home',
    description: 'Explore thousands of houses available for sale and rent',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    icon: Home,
    color: 'from-blue-600/80 to-purple-600/80',
  },
  {
    id: 2,
    category: 'Vehicles',
    title: 'Drive Your Perfect Car',
    description: 'Browse through a wide selection of quality vehicles',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80',
    icon: Car,
    color: 'from-red-600/80 to-orange-600/80',
  },
  {
    id: 3,
    category: 'Land',
    title: 'Invest in Prime Land',
    description: 'Discover valuable land and plots for your next project',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    icon: Map,
    color: 'from-green-600/80 to-teal-600/80',
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [currentSlide])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            {/* Dark Gradient Overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-r',
                slides[currentSlide].color,
                'mix-blend-multiply'
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-3xl"
              >
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
                  <slides[currentSlide].icon size={20} className="text-white" />
                  <span className="text-white font-semibold text-sm">
                    {slides[currentSlide].category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
                  {slides[currentSlide].title}
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 md:mb-10 max-w-2xl">
                  {slides[currentSlide].description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 md:px-8 py-3 md:py-4 bg-white text-gray-900 rounded-full font-semibold text-sm md:text-base shadow-xl hover:shadow-2xl transition-all"
                  >
                    Browse {slides[currentSlide].category}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white rounded-full font-semibold text-sm md:text-base hover:bg-white/20 transition-all"
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all group"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all group"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              'transition-all rounded-full',
              index === currentSlide
                ? 'w-12 md:w-16 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-4 md:right-8 z-10 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
        <span className="font-bold">{currentSlide + 1}</span>
        <span className="text-white/70"> / {slides.length}</span>
      </div>
    </div>
  )
}
