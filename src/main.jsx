import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Import the Router
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* The basename tells React Router the app is in a subfolder */}
    <BrowserRouter basename="/career-navigator">
      <App />
    </BrowserRouter>
  </StrictMode>,
)