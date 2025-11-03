import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/Header'
import { HomePage } from '@/pages/HomePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/listings" element={<div className="p-8">Listings Page</div>} />
                <Route path="/about" element={<div className="p-8">About Page</div>} />
                <Route path="/contact" element={<div className="p-8">Contact Page</div>} />
                <Route path="/favorites" element={<div className="p-8">Favorites Page</div>} />
                <Route path="/messages" element={<div className="p-8">Messages Page</div>} />
                <Route path="/signin" element={<div className="p-8">Sign In Page</div>} />
                <Route path="/signup" element={<div className="p-8">Sign Up Page</div>} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
