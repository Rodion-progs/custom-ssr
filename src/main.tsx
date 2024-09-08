import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'


const { character, characters } = window.__SSR_DATA__ || {};

hydrateRoot(document.getElementById('root')!,
  <BrowserRouter>
    <App characters={characters || []} character={character || undefined} />
  </BrowserRouter>
)
