import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import HomePage    from './pages/HomePage'
import AuthPage    from './pages/AuthPage'
import HistoryPage from './pages/HistoryPage'
import ResultPage  from './pages/ResultPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <Routes>
          <Route path="/"     element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/history"    element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="dark"
          toastStyle={{ background: '#1e2733', color: '#e6edf3' }} />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
