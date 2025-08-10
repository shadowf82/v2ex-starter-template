// Configuration for V2EX SDK
export const config = {
  // Client-side configuration (accessible in browser)
  client: {
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    tokenAddress: process.env.NEXT_PUBLIC_V2EX_TOKEN_ADDRESS || '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump',
  },
  // Server-side configuration (only accessible in API routes)
  server: {
    rpcUrl: process.env.SOLANA_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    tokenAddress: process.env.V2EX_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_V2EX_TOKEN_ADDRESS || '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump',
  }
};

// Validate configuration
export function validateConfig() {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    if (!config.server.rpcUrl || !config.server.tokenAddress) {
      console.warn('Warning: Missing server-side environment variables. Using defaults.');
    }
  } else {
    if (!config.client.rpcUrl || !config.client.tokenAddress) {
      console.warn('Warning: Missing client-side environment variables. Using defaults.');
    }
  }
}

export default config;