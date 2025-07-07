import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/index.jsx'

createRoot(document.getElementById('root')).render(
    <App />
  ,
)
