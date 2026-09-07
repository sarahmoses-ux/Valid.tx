import { wagmiAdapter, projectId } from "../lib/index";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, sepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode} from "react";
import { cookieToInitialState, WagmiProvider, type Config  } from "wagmi";

const queryClient = new QueryClient();

if(!projectId) {
  throw new Error("projectId is not defined")
}

const metadata = {
  name: 'ValidChain',
  description: 'Turn wallet transaction history into cryptographically verified on-chain activity using Attestcoin, with verification references anchored through Creditcoin.',
  url: 'https://validchain.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}


createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia],
  defaultNetwork: mainnet,
  projectId,
  metadata,
  features: {
    analytics: true
  },
  themeMode: 'light'
})

function ContextProvider({ children, cookies }: { children: React.ReactNode, cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider