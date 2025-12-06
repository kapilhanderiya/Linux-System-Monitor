// main.jsx
// Application bootstrap: mounts React into the DOM. Keeps the
// entrypoint intentionally small so this file only wires the
// top-level React tree.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
