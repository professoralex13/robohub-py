import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AuthenticationProvider } from './AuthenticationContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthenticationProvider>
    <App />
  </AuthenticationProvider>
)
