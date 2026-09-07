import { useConnect } from "wagmi";

export default function WalletPicker({
  onClose,
}: {
  onClose: () => void;
}) {
  const { connectors, connect, isPending } = useConnect();

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="w-full max-w-[400px]rounded-2xl bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Connect a wallet
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose how you want to connect to ValidTx.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              disabled={isPending}
              onClick={() =>
                connect(
                  { connector },
                  {
                    onSuccess: () => onClose(),
                  }
                )
              }
              className="flex w-full items-center justify-between rounded-xl border p-4 text-left transition hover:bg-muted disabled:opacity-50"
            >
              <div>
                <p className="font-medium">
                  {connector.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  {connector.name === "WalletConnect"
                    ? "Connect with your mobile wallet"
                    : connector.name === "Coinbase Wallet"
                    ? "Use Coinbase Wallet"
                    : "Use an installed browser wallet"}
                </p>
              </div>

              <span className="text-muted-foreground">
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}