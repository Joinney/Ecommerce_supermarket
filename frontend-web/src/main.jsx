import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Phải có dòng này để Tailwind chạy
import { CartProvider } from './context/CartContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
)