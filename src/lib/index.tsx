import { cookieStorage, createStorage } from 'wagmi'
import { sepolia, mainnet } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'


// 1. Get projectId from https://dashboard.reown.com
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if(!projectId) {
  throw new Error("projectId is not defined")
}


export const networks = [mainnet, sepolia]


export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  networks,
  projectId,
  ssr: true
})

export const Config = wagmiAdapter.wagmiConfig;