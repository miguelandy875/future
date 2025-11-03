import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronDown,
  Home,
  ListPlus,
  Info,
  Mail,
  Heart,
  MessageSquare,
  User,
  MoreVertical,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'rn', name: 'Kirundi', flag: '🇧🇮' },
]

const mainNavLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/listings', label: 'Browse Listings', icon: Search },
  { to: '/about', label: 'About Us', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
]

const topRightLinks = [
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileTopMenuOpen, setMobileTopMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileTopMenuOpen(false)
  }, [location])

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg'
            : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-md'
        )}
      >
        {/* Top Bar */}
        <div className="border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between gap-4">
              {/* Left: Logo & Language Selector */}
              <div className="flex items-center gap-4">
                {/* Mobile Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                  <span className="text-3xl">🤝</span>
                  <span className="hidden sm:inline bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    Umuhuza
                  </span>
                </Link>

                {/* Language Selector - Desktop */}
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                  >
                    <Globe size={18} />
                    <span className="text-sm font-medium">{selectedLanguage.flag}</span>
                    <ChevronDown size={16} />
                  </button>

                  <AnimatePresence>
                    {languageMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang)
                              setLanguageMenuOpen(false)
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                              selectedLanguage.code === lang.code && 'bg-gray-50 dark:bg-gray-700/50'
                            )}
                          >
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="text-sm font-medium">{lang.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Center: Search Bar - Desktop */}
              <div className="hidden md:flex flex-1 max-w-2xl">
                <div className="relative w-full">
                  <div
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
                      searchFocused
                        ? 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    )}
                  >
                    <Search size={20} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="🔍 Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
                    />
                  </div>

                  {/* Search Results Dropdown - Show when typing */}
                  <AnimatePresence>
                    {searchQuery && searchFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <p className="text-sm text-gray-500">
                          Search results for "{searchQuery}" will appear here...
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right: Links, Auth Buttons, Theme Toggle */}
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Top Right Links - Desktop */}
                <div className="hidden lg:flex items-center gap-1">
                  {topRightLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      <link.icon size={18} />
                      <span className="hidden xl:inline">{link.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Auth Buttons - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/signin"
                    className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Search Icon - Mobile */}
                <button
                  className="md:hidden rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Theme Toggle - Desktop */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' && <Sun size={20} />}
                    {theme === 'dark' && <Moon size={20} />}
                    {theme === 'system' && <Monitor size={20} />}
                  </button>

                  <AnimatePresence>
                    {themeMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 right-0 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        {themeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setTheme(option.value)
                              setThemeMenuOpen(false)
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                              theme === option.value && 'bg-gray-50 dark:bg-gray-700/50'
                            )}
                          >
                            <option.icon size={18} />
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Three-dot Menu - Mobile */}
                <button
                  onClick={() => setMobileTopMenuOpen(!mobileTopMenuOpen)}
                  className="md:hidden rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Main Navigation - Desktop */}
        <div className="hidden lg:block">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-1 h-12">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors group',
                    location.pathname === link.to
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <link.icon size={18} />
                    {link.label}
                  </span>
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Main Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🤝</span>
                    <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      Umuhuza
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Language Selector - Mobile */}
                <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Language
                  </div>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                          selectedLanguage.code === lang.code
                            ? 'bg-white dark:bg-gray-700'
                            : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                        )}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Navigation - Mobile */}
                <nav className="space-y-1 mb-6">
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        location.pathname === link.to
                          ? 'bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 text-primary-600 dark:text-primary-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                    >
                      <link.icon size={20} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Top Menu - Three Dots Menu */}
      <AnimatePresence>
        {mobileTopMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileTopMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-50 md:hidden overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-lg">Menu</h3>
                  <button
                    onClick={() => setMobileTopMenuOpen(false)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Top Links - Mobile */}
                <div className="space-y-1 mb-6">
                  {topRightLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <link.icon size={20} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Theme Selector - Mobile */}
                <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Theme
                  </div>
                  <div className="space-y-1">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                          theme === option.value
                            ? 'bg-white dark:bg-gray-700'
                            : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                        )}
                      >
                        <option.icon size={18} />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auth Buttons - Mobile */}
                <div className="space-y-3">
                  <Link
                    to="/signin"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 font-medium hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                  >
                    <User size={18} />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    <ListPlus size={18} />
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-28 lg:h-28" />
    </>
  )
}
