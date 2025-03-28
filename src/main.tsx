
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Make sure Tailwind base is imported first
import './styles/global.css'  // Then custom global styles
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
