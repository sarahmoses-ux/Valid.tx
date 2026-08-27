export default function VerificationFlow() {
  return (
    <section className="w-full max-w-6xl mb-24">
      <div className="glass-panel rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 hidden md:block z-0" />

        <div className="flex flex-col items-center gap-sm z-10 relative group">
          <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-on-surface text-[32px]">account_balance_wallet</span>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant">1. Wallet</span>
        </div>

        <span className="material-symbols-outlined text-primary/50 text-[24px] rotate-90 md:rotate-0 z-10">
          arrow_forward
        </span>

        <div className="flex flex-col items-center gap-sm z-10 relative group">
          <div className="w-20 h-20 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center p-2 group-hover:border-primary transition-colors">
            <div className="w-full flex flex-col gap-1 opacity-60">
              <div className="h-2 w-full bg-outline-variant rounded-sm" />
              <div className="h-2 w-3/4 bg-outline-variant rounded-sm" />
              <div className="h-2 w-5/6 bg-outline-variant rounded-sm" />
            </div>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant">2. Discovered Activity</span>
        </div>

        <span className="material-symbols-outlined text-primary/50 text-[24px] rotate-90 md:rotate-0 z-10">
          arrow_forward
        </span>

        <div className="flex flex-col items-center gap-sm z-10 relative group">
          <div className="w-24 h-24 rounded-full bg-surface-container border border-primary/50 flex items-center justify-center glow-accent relative">
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin opacity-50" />
            <span className="material-symbols-outlined text-primary text-[40px]">shield</span>
          </div>
          <span className="font-label-md text-label-md text-primary text-center">
            3. Attestcoin
            <br />
            Verification
          </span>
        </div>

        <span className="material-symbols-outlined text-primary/50 text-[24px] rotate-90 md:rotate-0 z-10">
          arrow_forward
        </span>

        <div className="flex flex-col items-center gap-sm z-10 relative group">
          <div className="w-20 h-24 rounded-lg bg-surface-container-high border border-secondary/50 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-secondary" />
            <div className="w-8 h-8 rounded-full bg-surface-variant" />
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-mono-data text-[10px] text-secondary">Verified</span>
            </div>
          </div>
          <span className="font-label-md text-label-md text-secondary">4. Verified Profile</span>
        </div>
      </div>
    </section>
  )
}
