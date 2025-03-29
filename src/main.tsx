
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Import Tailwind base first
import './App.css'  // App specific styles
import './styles/browser-compatibility.css'  // Browser compatibility styles
import './styles/global.css'  // Then custom global styles
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
