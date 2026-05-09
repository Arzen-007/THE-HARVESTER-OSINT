import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Sources from './pages/Sources'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sources" element={<Sources />} />
      {/* Placeholder routes for future pages */}
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/docs" element={<Dashboard />} />
      <Route path="/config" element={<Dashboard />} />
    </Routes>
  )
}
