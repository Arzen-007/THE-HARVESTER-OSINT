import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Sources from './pages/Sources'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sources" element={<Sources />} />
      {/* Placeholder routes for future pages */}
      <Route path="/analytics" element={<Dashboard />} />
      <Route path="/settings" element={<Dashboard />} />
      <Route path="/docs" element={<Dashboard />} />
      <Route path="/config" element={<Dashboard />} />
    </Routes>
  )
}
