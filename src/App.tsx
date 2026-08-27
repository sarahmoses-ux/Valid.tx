import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext'
import { ActivityProvider } from './context/ActivityContext'
import RequireWallet from './components/layout/RequireWallet'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import VerifiedProfile from './pages/VerifiedProfile'

function App() {
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
                <VerifiedProfile />
              </RequireWallet>
            }
          />
        </Routes>
      </BrowserRouter>
      </ActivityProvider>
    </WalletProvider>
  )
}

export default App
