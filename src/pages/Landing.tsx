import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import VerificationFlow from '../components/VerificationFlow'
import ProcessSteps from '../components/ProcessSteps'
import VerificationModal from '../components/verification/VerificationModal'
import { useWallet } from '../context/WalletContext'

export default function Landing() {
  const { connect, viewAddress } = useWallet()
  const navigate = useNavigate()
  const [isVerifying, setIsVerifying] = useState(false)

  return (
    <div className="font-body-md text-body-md antialiased min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 grid-bg z-0 pointer-events-none opacity-50" />

      <Header />

      <main className="flex-grow z-10 flex flex-col items-center pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <Hero onVerifyWallet={() => setIsVerifying(true)} />
        <VerificationFlow />
        <ProcessSteps />
      </main>

      {isVerifying && (
        <VerificationModal
          onComplete={async (result) => {
            if (result.mode === 'lookup') {
              viewAddress(result.address)
              setIsVerifying(false)
              navigate('/dashboard')
              return
            }
            try {
              await connect()
              setIsVerifying(false)
              navigate('/dashboard')
            } catch {
              setIsVerifying(false)
              navigate('/dashboard')
            }
          }}
        />
      )}
    </div>
  )
}
