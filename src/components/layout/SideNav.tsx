import { Link } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { truncateAddress } from "../../lib/address";

export type NavKey = "overview" | "transactions" | "profile";

type NavItem = {
  key: NavKey;
  label: string;
  icon: string;
  to: string;
};

const navItems: NavItem[] = [
  { key: "overview", label: "Overview", icon: "dashboard", to: "/dashboard" },
  {
    key: "transactions",
    label: "Transactions",
    icon: "receipt_long",
    to: "/transactions",
  },
  { key: "profile", label: "Profile", icon: "account_circle", to: "/profile" },
];

export default function SideNav({ active }: { active: NavKey }) {
  const { address, isReadOnly, disconnect } = useWallet();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-outline-variant hidden md:flex flex-col py-6 px-5 z-20">
      <div className="mb-xl flex items-center gap-xs">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-on-primary-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            security
          </span>
        </div>
        <div>
          <Link to="/">
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface leading-tight">
              ValidChain
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Web3 Verification
            </p>
          </Link>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-sm">
        {navItems.map((item) =>
          item.key === active ? (
            <Link
              key={item.key}
              to={item.to}
              className="flex items-center gap-md px-sm py-xs text-primary font-bold border-r-2 border-primary bg-primary/5 rounded-l-lg hover:bg-surface-container-high transition-colors active:scale-95 duration-150"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {item.icon}
              </span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </Link>
          ) : (
            <Link
              key={item.key}
              to={item.to}
              className="flex items-center gap-md px-sm py-xs text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors active:scale-95 duration-150"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </Link>
          ),
        )}
      </nav>

      <div className="mt-auto pt-sm border-t border-outline-variant/50 flex flex-col gap-sm">
        {address && (
          <div className="flex items-center gap-xs px-xs">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_rgba(78,222,163,0.6)] shrink-0" />
            <span className="font-mono-data text-mono-data text-on-surface-variant truncate">
              {truncateAddress(address, 3, 4)}
            </span>
          </div>
        )}
        {/* <button
          type="button"
          onClick={onVerifyWallet}
          className="w-full py-xs px-sm bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:bg-primary-fixed-dim transition-colors flex items-center justify-center gap-xs active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined text-[18px]">{address ? 'refresh' : 'wallet'}</span>
          {isReadOnly ? 'Scan another wallet' : address ? 'Re-scan Wallet' : 'Verify Wallet'}
        </button> */}
        <button
          type="button"
          onClick={() => void disconnect()}
          className="w-full py-2 px-3 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors flex items-center justify-center gap-2 text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          {isReadOnly ? "Exit lookup" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
