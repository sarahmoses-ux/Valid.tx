type Step = {
  number: number
  title: string
  description: string
  icon: string
  footerLabel: string
  accent: 'default' | 'primary' | 'secondary'
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Discover',
    description:
      'Connect your wallet to instantly find activity across supported networks. We index your transaction history seamlessly.',
    icon: 'search',
    footerLabel: 'Scanning nodes...',
    accent: 'default',
  },
  {
    number: 2,
    title: 'Verify',
    description:
      'Cryptographically prove your activity with Attestcoin. Generate zero-knowledge proofs that confirm your history without exposing raw data.',
    icon: 'lock',
    footerLabel: '0xPROOF_GEN',
    accent: 'primary',
  },
  {
    number: 3,
    title: 'Build',
    description:
      'Establish a trusted on-chain profile. Use your verified status to access premium defi protocols, exclusive mints, and trusted networks.',
    icon: 'verified_user',
    footerLabel: 'Profile Minted',
    accent: 'secondary',
  },
]

function StepCard({ step }: { step: Step }) {
  if (step.accent === 'primary') {
    return (
      <div className="glass-panel rounded-xl p-lg flex flex-col h-full border-primary/30 glow-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
        <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center mb-6 border border-primary/50">
          <span className="font-headline-md text-headline-md text-primary">{step.number}</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{step.title}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant flex-grow">{step.description}</p>
        <div className="mt-6 pt-6 border-t border-primary/20 flex justify-between items-center">
          <span className="material-symbols-outlined text-[20px] text-primary">{step.icon}</span>
          <span className="font-mono-data text-mono-data text-primary">{step.footerLabel}</span>
        </div>
      </div>
    )
  }

  const accentTextClass = step.accent === 'secondary' ? 'text-secondary' : 'text-primary'
  const hoverBorderClass = step.accent === 'secondary' ? 'hover:border-secondary/50' : 'hover:border-primary/50'

  return (
    <div className={`glass-panel rounded-xl p-lg flex flex-col h-full ${hoverBorderClass} transition-colors`}>
      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-6 border border-outline-variant">
        <span className={`font-headline-md text-headline-md ${accentTextClass}`}>{step.number}</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{step.title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant flex-grow">{step.description}</p>
      <div className="mt-6 pt-6 border-t border-outline-variant/30 flex justify-between items-center opacity-70">
        <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
        <span className={`font-mono-data text-mono-data ${accentTextClass}`}>{step.footerLabel}</span>
      </div>
    </div>
  )
}

export default function ProcessSteps() {
  return (
    <section id="how-it-works" className="w-full max-w-5xl mb-16 scroll-mt-24">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center">
        The Verification Process
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {steps.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </div>
    </section>
  )
}
