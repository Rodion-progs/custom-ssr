# Rick and Morty Explorer

A React-based web application that uses both SSR (Server Side Rendering) and SPA (Single Page Application) approaches to showcase Rick and Morty series data.

## Features

### Routes Structure

#### SSR Routes
- `/` - Home page (Characters List)
  - Server-side rendered list of all characters
  - Cached by URL pattern
- `/character/:id` - Individual Character Page
  - Server-side rendered character details
  - Cached by URL pattern: `/character/[0-9]+`

#### SPA Routes
- `/episodes` - Episodes List
  - Client-side rendered list of episodes
  - Dynamic loading of character details when selecting an episode

### Caching System

The project implements a file-based caching system for SSR routes:

```
/cache
  /characters
    _.html                # Home page cache
    _character_1.html     # Character #1 page cache
    _character_2.html     # Character #2 page cache
    ...
```

Cache configuration:
- Cache files are stored in separate directories based on content type
- Each cached page is stored as an HTML file
- Cache keys are generated from URL paths
- Cache can be configured using regex patterns in server configuration

## Project Structure

```
src/
├── server/
│   ├── devServer.ts     # Development server configuration
│   ├── prodServer.ts    # Production server configuration
│   ├── routes.ts        # SSR routes handlers
│   └── utils/
│       └── fileCache.ts # Caching implementation
├── pages/
│   ├── Characters.tsx   # SSR home page
│   ├── CharacterPage.tsx# SSR character details
│   └── Episodes.tsx     # SPA episodes page
├── components/
│   └── Navigation.tsx   # Main navigation component
└── styles/
    ├── main.css        # Global styles
    └── navigation.css  # Navigation styles
```

## Technical Details

### SSR Implementation
- Uses Express.js for server-side rendering
- Implements file-based caching system
- Supports development and production environments
- Includes meta tags generation for SEO

### SPA Implementation
- Uses React Router for client-side navigation
- Implements dynamic data loading
- Maintains consistent styling with SSR pages

### Caching Strategy
1. When a request hits an SSR route, the server:
   - Checks if the URL matches caching patterns
   - Looks for existing cache file
   - Serves cached content if available
   - Renders new content and caches it if not found

2. Cache invalidation:
   - Currently manual (delete cache files)
   - Can be extended with time-based invalidation

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Start development server:
```bash
yarn dev
```

3. Build for production:
```bash
yarn build
```

4. Start production server:
```bash
yarn prod
```

## API Integration

The application uses the [Rick and Morty API](https://rickandmortyapi.com/) for data:
- Characters endpoint: `https://rickandmortyapi.com/api/character`
- Episodes endpoint: `https://rickandmortyapi.com/api/episode`

## Browser Support

- Supports all modern browsers
- Includes necessary polyfills for older browsers
- Responsive design for mobile and desktop

## Performance Considerations

- SSR for initial page load and SEO
- File-based caching for frequently accessed pages
- Client-side navigation for better user experience
- Optimized images and assets
- Lazy loading for SPA routes

## Future Improvements

Potential areas for enhancement:
- Add time-based cache invalidation
- Implement service worker for offline support
- Add server-side pagination
- Implement search functionality
- Add more interactive features
