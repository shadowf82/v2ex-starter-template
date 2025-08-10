/**
 * V2EX Starter Template Usage Examples
 * 
 * These examples show how to use the V2EX tools with environment variables
 */

// Frontend Usage (Browser)
import { V2EXFrontend } from '../src/fe';

// Using environment variables (Next.js)
const frontend = new V2EXFrontend(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
  process.env.NEXT_PUBLIC_V2EX_TOKEN_ADDRESS!
);

// Or using the config helper
import config from '../lib/config';

const frontendWithConfig = new V2EXFrontend(
  config.client.rpcUrl,
  config.client.tokenAddress
);

// Example: Connect wallet and check balance
async function connectAndCheckBalance() {
  try {
    // Connect wallet
    const address = await frontend.connectWallet();
    console.log('Connected wallet:', address);
    
    // Check balance
    const balance = await frontend.getV2EXBalance();
    console.log('V2EX Balance:', balance);
    
    // Sign a message
    const signature = await frontend.signMessage('Hello V2EX!');
    console.log('Signature:', signature);
    
    // Send V2EX payment
    const v2exTxSignature = await frontend.sendV2EXPayment(
      10.5,           // amount
      'order-123',    // order ID
      'recipient-address'
    );
    console.log('V2EX Transaction:', v2exTxSignature);
    
    // Send SOL payment
    const solTxSignature = await frontend.sendSol(
      0.1,            // amount in SOL
      'order-456',    // order ID
      'recipient-address'
    );
    console.log('SOL Transaction:', solTxSignature);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Backend Usage (Server)
import { V2EXBackend } from '../src/be';

// Using environment variables
const backend = new V2EXBackend(
  process.env.SOLANA_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
  process.env.V2EX_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_V2EX_TOKEN_ADDRESS!
);

// Or using the config helper
const backendWithConfig = new V2EXBackend(
  config.server.rpcUrl,
  config.server.tokenAddress
);

// Example: Check balance and verify signature
async function backendOperations() {
  try {
    // Check balance for any address
    const balance = await backend.getV2EXBalance('wallet-address');
    console.log('Balance:', balance);
    
    // Get transaction details
    const txDetails = await backend.getTransactionDetails('tx-signature');
    console.log('Transaction:', txDetails);
    
    
    // Verify a signature
    const isValid = await backend.verifySignature(
      'message',
      'signature-hex',
      'public-key'
    );
    console.log('Signature valid:', isValid);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Next.js API Route Example
export async function handler(req: any, res: any) {
  // The backend will automatically use environment variables
  const backendSdk = new V2EXBackend(
    config.server.rpcUrl,
    config.server.tokenAddress
  );
  
  try {
    const { address } = req.query;
    const balance = await backendSdk.getV2EXBalance(address);
    res.status(200).json({ balance });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}