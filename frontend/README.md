# Umuhuza Frontend

Modern, responsive frontend for the Umuhuza marketplace platform.

## Features

- ✨ Modern two-tier responsive header with glass morphism effect
- 🎨 Light/Dark/System theme support
- 🌍 Multi-language support (English, French, Kirundi)
- 📱 Fully responsive design (mobile-first)
- 🎠 Hero carousel with smooth animations
- 🔍 Real-time search functionality
- 🎯 Smooth navigation with active state indicators
- ♿ Accessible components

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Zustand** - State management
- **React Query** - Data fetching
- **React Hook Form + Zod** - Form handling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── Header.tsx
│   │   └── HeroCarousel.tsx
│   ├── pages/          # Page components
│   │   └── HomePage.tsx
│   ├── contexts/       # React contexts
│   │   └── ThemeContext.tsx
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   │   └── utils.ts
│   ├── api/            # API client
│   ├── assets/         # Static assets
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Public assets
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## Header Features

### Desktop View
- **Top Bar:**
  - Logo (handshake emoji)
  - Language selector dropdown
  - Central search bar with real-time results
  - Quick links (Favorites, Messages)
  - Sign In / Sign Up buttons
  - Theme toggle (Light/Dark/System)

- **Bottom Bar:**
  - Main navigation links
  - Active state with animated underline
  - Smooth hover effects

### Mobile View
- **Hamburger menu** (left) for main navigation
- **Search icon** (replaces search bar)
- **Three-dot menu** (right) for:
  - Top bar links
  - Theme selector
  - Auth buttons
- Smooth slide-in animations
- Glass blur overlays

## Hero Carousel Features

- Auto-play (5 second intervals)
- Manual navigation (arrows + dots)
- Smooth slide transitions with Framer Motion
- Category-specific slides (Houses, Vehicles, Land)
- Text overlay with gradient
- Responsive design
- Touch/swipe support

## API Integration

The frontend is configured to proxy API requests to the Django backend:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
  },
}
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=Umuhuza
```

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  primary: { ... },
  accent: { ... },
}
```

### Carousel Slides

Edit `src/components/HeroCarousel.tsx` to customize slides:

```typescript
const slides = [
  {
    id: 1,
    category: 'Your Category',
    title: 'Your Title',
    description: 'Your Description',
    image: 'image-url',
    ...
  }
]
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use TypeScript for all new files
- Follow functional component patterns
- Use Tailwind CSS for styling
- Follow naming conventions:
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- Lazy loading images
- Code splitting with React.lazy
- Optimized bundle size
- Fast refresh in development

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus visible states
- Screen reader friendly

## Next Steps

1. Implement authentication pages
2. Build listings page with filters
3. Create listing detail page
4. Add messaging interface
5. Implement user profile
6. Add payment integration UI
7. Build admin dashboard

## License

MIT License - see LICENSE file for details

## Authors

- Andy Miguel Habyarimana
- Dahl Ndayisenga

## Support

For issues and questions, please contact: support@umuhuza.bi
