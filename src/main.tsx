import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Post from './pages/Post.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* A rota "/" carrega a sua Home (App.tsx) */}
        <Route path="/" element={<App />} />
        {/* A rota "/post/:id" carrega a página de detalhes */}
        <Route path="/post/:id" element={<Post />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)