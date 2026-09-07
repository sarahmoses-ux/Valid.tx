import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ContextProvider from './context/index'
import { ActivityProvider } from './context/ActivityContext'
import RequireWallet from './components/layout/RequireWallet'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import VerifiedProfile from './pages/VerifiedProfile'
import { useState } from 'react'
import VerificationModal from './components/verification/VerificationModal'

function App({ activeNav }: { activeNav: 'overview' | 'transactions' | 'profile' }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const cookies = null;
  
  return (
    <ContextProvider cookies={cookies}>
      <ActivityProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <RequireWallet>
                <Dashboard />
              </RequireWallet>
            }
          />
          <Route
            path="/transactions"
            element={
              <RequireWallet>
                <Transactions />
              </RequireWallet>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireWallet>
                <VerifiedProfile />
              </RequireWallet>
            }
          />
        </Routes>
      </BrowserRouter>
      </ActivityProvider>
      {isVerifying && (
              <VerificationModal
                onComplete={() => setIsVerifying(false)}
                onClose={() => setIsVerifying(false)}
              />
            )}
    </ContextProvider>
  )
}

export default App
