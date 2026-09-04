import crypto from 'node:crypto'
import express from 'express'
import session from 'express-session'
import { generateNonce, SiweMessage } from 'siwe'
import cors from 'cors'

declare module 'express-session' {
  interface SessionData {
    nonce?: string
    address?: string
    chainId?: number
    authenticatedAt?: string
  }
}

const app = express()
const port = Number(process.env.AUTH_PORT ?? 3001)
const isProduction = process.env.NODE_ENV === 'production'

app.set('trust proxy', 1)

// CORS configuration for wallet connection
const corsOptions = {
  origin: isProduction ? process.env.FRONTEND_URL || 'http://localhost:5173' : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '16kb' }))
app.use(session({
  name: 'validtx.sid',
  secret: process.env.SESSION_SECRET ?? crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: isProduction, maxAge: 1000 * 60 * 60 * 12 },
}))

app.get('/api/auth/nonce', (req, res) => {
  const nonce = generateNonce()
  req.session.nonce = nonce
  res.setHeader('Cache-Control', 'no-store')
  res.json({ nonce })
})

app.post('/api/auth/verify', async (req, res) => {
  try {
    const { message, signature } = req.body as { message?: string; signature?: string }
    if (!message || !signature || !req.session.nonce) return res.status(400).json({ error: 'Missing sign-in challenge.' })
    const siwe = new SiweMessage(message)
    const expectedHost = req.get('host')?.replace(':3001', ':5173')
    const result = await siwe.verify({ signature, nonce: req.session.nonce, domain: expectedHost })
    if (!result.success) return res.status(401).json({ error: 'Signature verification failed.' })

    req.session.address = siwe.address
    req.session.chainId = siwe.chainId
    req.session.authenticatedAt = new Date().toISOString()
    delete req.session.nonce
    res.json({ authenticated: true, address: siwe.address, chainId: siwe.chainId })
  } catch {
    res.status(401).json({ error: 'Invalid or expired SIWE signature.' })
  }
})

app.get('/api/auth/session', (req, res) => {
  res.setHeader('Cache-Control', 'no-store')
  if (!req.session.address) return res.status(401).json({ authenticated: false })
  res.json({ authenticated: true, address: req.session.address, chainId: req.session.chainId, authenticatedAt: req.session.authenticatedAt })
})

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('validtx.sid')
    res.status(204).end()
  })
})

app.listen(port, () => console.log(`ValidChain auth server listening on http://localhost:${port}`))