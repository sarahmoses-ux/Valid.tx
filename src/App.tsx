import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext'
import { ActivityProvider } from './context/ActivityContext'
import RequireWallet from './components/layout/RequireWallet'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import VerifiedProfile from './pages/VerifiedProfile'
import { useState } from 'react'
import VerificationModal from './components/verification/VerificationModal'

function App(activeNav: 'overview' | 'transactions' | 'profile') {
  const [isVerifying, setIsVerifying] = useState(false)
  return (
    <WalletProvider>
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
                <VerifiedProfile active={activeNav} onVerifyWallet={() => setIsVerifying(true)} />
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
    </WalletProvider>
  )
}

export default App
