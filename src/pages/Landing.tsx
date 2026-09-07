import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import VerificationFlow from '../components/VerificationFlow'
import ProcessSteps from '../components/ProcessSteps'
import VerificationModal from '../components/verification/VerificationModal'
import { useAccount } from 'wagmi'
import Footer from '../components/Footer'

export default function Landing() {
  const { connect } = useWallet()
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

      <Footer />

      {isVerifying && (
        <VerificationModal
          onClose={() => setIsVerifying(false)}
          onComplete={async (result) => {
            if (result.mode === 'lookup') {
              setIsVerifying(false)
              navigate(`/transactions?tx=${encodeURIComponent(result.hash)}`)
              return
            }
            try {
              // await connect()
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
