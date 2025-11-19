import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ColorsList from './ColorsList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorsList />
  </StrictMode>,
)
