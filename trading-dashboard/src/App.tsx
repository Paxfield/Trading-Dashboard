import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import TradingDashboard from './components/TradingDashboard'
import Auth from './components/Auth'
import { ErrorBoundary } from './components/ErrorBoundary'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <TradingDashboard /> : <Auth />
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
