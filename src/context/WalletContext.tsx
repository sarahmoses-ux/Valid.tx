import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Eip1193Provider } from 'ethers'

type InjectedEthereumProvider = Eip1193Provider & {
  on?: (event: string, listener: (...args: unknown[]) => void) => void
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void
}

declare global { interface Window { ethereum?: InjectedEthereumProvider } }

type WalletState = {
  isConnected: boolean
  isReadOnly: boolean
  isAuthenticating: boolean
  address: string | null
  chainId: number | null
  authError: string | null
  connect: () => Promise<void>
  viewAddress: (address: string) => void
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletState | null>(null)

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: 'include', ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Authentication request failed.' })) as { error?: string }
    throw new Error(body.error ?? 'Authentication request failed.')
  }
  return response.json() as Promise<T>
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [viewedAddress, setViewedAddress] = useState<string | null>(() => sessionStorage.getItem('validtx.viewed-address'))
  const [chainId, setChainId] = useState<number | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  const restoreSession = useCallback(async () => {
    try {
      const session = await getJson<{ address: string; chainId: number }>('/api/auth/session')
      setAddress(session.address)
      setViewedAddress(null)
      setChainId(session.chainId)
    } catch {
      setAddress(null)
      setChainId(null)
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  useEffect(() => { void restoreSession() }, [restoreSession])

  const disconnect = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setAddress(null)
    setViewedAddress(null)
    sessionStorage.removeItem('validtx.viewed-address')
    setChainId(null)
    setAuthError(null)
  }, [])

  const connect = useCallback(async () => {
    setAuthError(null)
    if (!window.ethereum) {
      const error = 'No injected Ethereum wallet was found. Install MetaMask or another EIP-1193 wallet.'
      setAuthError(error)
      throw new Error(error)
    }
    setIsAuthenticating(true)
    try {
      const { BrowserProvider } = await import('ethers')
      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const walletAddress = await signer.getAddress()
      const network = await provider.getNetwork()
      const walletChainId = Number(network.chainId)
      const { nonce } = await getJson<{ nonce: string }>('/api/auth/nonce')
      const issuedAt = new Date().toISOString()
      const message = `${window.location.host} wants you to sign in with your Ethereum account:\n${walletAddress}\n\nSign in to ValidTx. This request will not trigger a blockchain transaction or cost gas.\n\nURI: ${window.location.origin}\nVersion: 1\nChain ID: ${walletChainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}`
      const signature = await signer.signMessage(message)
      const session = await getJson<{ address: string; chainId: number }>('/api/auth/verify', { method: 'POST', body: JSON.stringify({ message, signature }) })
      setAddress(session.address)
      setViewedAddress(null)
      setChainId(session.chainId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wallet authentication was cancelled.'
      setAuthError(message)
      setAddress(null)
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  useEffect(() => {
    const provider = window.ethereum
    if (!provider?.on) return
    const invalidateSession = () => { void disconnect() }
    provider.on('accountsChanged', invalidateSession)
    provider.on('chainChanged', invalidateSession)
    return () => {
      provider.removeListener?.('accountsChanged', invalidateSession)
      provider.removeListener?.('chainChanged', invalidateSession)
    }
  }, [disconnect])

  const viewAddress = useCallback((nextAddress: string) => { setViewedAddress(nextAddress); sessionStorage.setItem('validtx.viewed-address', nextAddress); setAuthError(null) }, [])
  const activeAddress = address ?? viewedAddress
  const value = useMemo<WalletState>(() => ({ isConnected: Boolean(address), isReadOnly: Boolean(viewedAddress && !address), isAuthenticating, address: activeAddress, chainId, authError, connect, viewAddress, disconnect }), [address, viewedAddress, activeAddress, isAuthenticating, chainId, authError, connect, viewAddress, disconnect])
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) throw new Error('useWallet must be used within a WalletProvider')
  return context
}
