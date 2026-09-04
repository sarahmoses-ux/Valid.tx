import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="w-full max-w-4xl text-center flex flex-col items-center gap-5 mb-16 sm:mb-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-primary/30 mb-4">
        <span className="w-2 h-2 rounded-full bg-secondary" />
        <span className="font-label-md text-label-md text-primary">
          Attestcoin Integration Live
        </span>
      </div>

      <h1 className="font-display-lg text-[36px] leading-[42px] sm:text-display-lg text-on-surface max-w-3xl">
        Your On-Chain Activity.
        <br />
        <span className="gradient-text">Verified.</span>
      </h1>

      <p className="font-body-md text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl mt-1 sm:mt-2">
        Turn wallet transaction history into cryptographically verified on-chain
        activity using Attestcoin, with verification references anchored through
        Creditcoin.
      </p>

      <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 mt-4">
        <Link to="/dashboard" className="btn-primary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2">
        <button
          type="button"
          className="btn-primaryrounded-lg font-label-md text-label-md flex items-center justify-center gap-2"
        >
          Verify a Wallet
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
        </Link>
        <a
          href="#how-it-works"
          className="btn-secondary px-6 py-3 rounded-lg font-label-md text-label-md text-center"
        >
          Explore How It Works
        </a>
      </div>
    </section>
  );
}
