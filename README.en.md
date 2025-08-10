# V2EX Starter Template

A comprehensive starter template for building V2EX token applications on Solana blockchain, featuring both frontend and backend tools.

> 📦 This project uses [pnpm](https://pnpm.io/) as the package manager for faster, more efficient dependency management.

## Features

### Frontend Tools
- Connect to Solana wallets (Phantom, Solflare, etc.)
- Send V2EX token payments with memo support
- Send SOL payments with memo support
- Check V2EX token balances
- Sign messages with wallet private key

### Backend Tools  
- Get V2EX token balance for any wallet address
- Parse transaction details and extract V2EX/SOL transfer information
- Extract memos from transaction data
- Verify message signatures

### Playground
- Interactive web interface built with Next.js
- Test wallet connections and payments
- View transaction details and balances
- React-based UI with real-time updates
- Support for both Chinese and English

## Prerequisites

Install pnpm if you haven't already:

```bash
# Using npm
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm

# Or using curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Installation

```bash
git clone https://github.com/your-repo/v2ex-starter-template.git
cd v2ex-starter-template
cp .env.local.example .env.local
pnpm install
pnpm dev
```

## Configuration

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Client-side environment variables (exposed to browser) - Public RPC for demo
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_V2EX_TOKEN_ADDRESS=9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump

# Server-side environment variables (only for API routes) - Public RPC for demo
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
V2EX_TOKEN_ADDRESS=9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump
```

### ⚠️ Important: RPC Configuration

**For production use, replace the public RPC with a private RPC provider:**

- **Alchemy**: `https://solana-mainnet.g.alchemy.com/v2/your-api-key`
- **QuickNode**: `https://your-endpoint.solana-mainnet.quiknode.pro/your-api-key`  
- **Helius**: `https://rpc.helius.xyz/?api-key=your-api-key`

Public RPCs have rate limits and may be unstable or slow. Private RPC services provide:
- Higher rate limits
- Better reliability
- Faster response times
- Priority support

### Environment Variables

- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint URL (accessible in browser)
- `NEXT_PUBLIC_V2EX_TOKEN_ADDRESS`: V2EX token contract address (accessible in browser)
- `SOLANA_RPC_URL`: Server-side Solana RPC endpoint URL (for API routes)
- `V2EX_TOKEN_ADDRESS`: Server-side V2EX token contract address (for API routes)

Note: In Next.js, environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser, while others are only available server-side.

## Usage

### Frontend Usage

```typescript
import { V2EXFrontend } from './src/fe';

const frontend = new V2EXFrontend(
  'https://api.mainnet-beta.solana.com',
  '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump'
);

// Connect wallet
const address = await frontend.connectWallet();

// Send V2EX token payment
const v2exSignature = await frontend.sendV2EXPayment(
  amount, memo, recipientAddress
);

// Send SOL payment
const solSignature = await frontend.sendSol(
  amount, memo, recipientAddress
);

// Check balance
const balance = await frontend.getV2EXBalance();

// Sign message
const signResult = await frontend.signMessage('Hello V2EX!');
```

### Backend Usage

```typescript
import { V2EXBackend } from './src/be';

const backend = new V2EXBackend(
  'https://api.mainnet-beta.solana.com',
  '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump'
);

// Get balance
const balance = await backend.getV2EXBalance('wallet-address');

// Get transaction details (supports both V2EX and SOL transactions)
const details = await backend.getTransactionDetails('transaction-signature');

// Verify signature
const isValid = await backend.verifySignature('message', 'signature-hex', 'public-key');
```

## Development

### Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 to access the playground interface.

### Build

```bash
# Build Next.js app
pnpm build
```

## API Endpoints

- `GET /api/balance/:address` - Get V2EX balance for address
- `GET /api/transaction/:signature` - Get transaction details (V2EX or SOL)
- `POST /api/verify-signature` - Verify message signature

## Token Information

- **Token Address**: `9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump`
- **Network**: Solana Mainnet
- **Decimals**: 6

## License

MIT