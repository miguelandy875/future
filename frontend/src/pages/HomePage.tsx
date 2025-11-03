import { HeroCarousel } from '@/components/HeroCarousel'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroCarousel />

      {/* Featured Listings Section - Placeholder */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Featured Listings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-primary-400 to-accent-400" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Beautiful Property {i}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Location, Bujumbura
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    $250,000
                  </span>
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Houses', 'Vehicles', 'Land'].map((category) => (
              <div
                key={category}
                className="group relative h-64 rounded-xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600 group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="relative h-full flex items-center justify-center">
                  <h3 className="text-3xl font-bold text-white">{category}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
