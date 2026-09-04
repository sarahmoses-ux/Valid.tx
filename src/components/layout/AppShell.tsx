import { useState, type ReactNode } from "react";
import SideNav, { type NavKey } from "./SideNav";
import TopAppBar from "./TopAppBar";
import VerificationModal from "../verification/VerificationModal";
import { Link } from "react-router-dom";

type AppShellProps = {
  title: string;
  activeNav: NavKey;
  children: ReactNode;
  className?: string;
  mainClassName?: string;
};

export default function AppShell({
  title,
  activeNav,
  children,
  className,
  mainClassName,
}: AppShellProps) {
  // const [isVerifying, setIsVerifying] = useState(false)

  return (
    <div className={`min-h-screen ${className ?? ""}`}>
      <SideNav active={activeNav} />
      <TopAppBar title={title} />
      <main
        className={
          mainClassName ??
          "md:ml-64 pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 min-h-screen pb-24 md:pb-8"
        }
      >
        {children}
      </main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 h-16 backdrop-blur-xl border-t border-outline-variant flex items-center justify-around px-2">
        {[
          ["overview", "dashboard", "Overview", "/dashboard"],
          ["transactions", "receipt_long", "Transactions", "/transactions"],
          ["profile", "account_circle", "Profile", "/profile"],
        ].map(([key, icon, label, to]) => (
          <Link
            key={key}
            to={to}
            className={`min-w-20 w-full h-full flex flex-col items-center justify-center gap-0.5 text-[11px] ${activeNav === key ? "text-primary border-b-2 bg-primary/10" : "text-on-surface-variant"}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {icon}
            </span>
            {label}
          </Link>
        ))}
      </nav>
      {/* {isVerifying && (
        <VerificationModal
          onComplete={() => setIsVerifying(false)}
          onClose={() => setIsVerifying(false)}
        />
      )} */}
    </div>
  );
}
