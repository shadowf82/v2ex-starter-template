import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, getAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';

interface WalletAdapter {
  publicKey: PublicKey | null;
  connected: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
  sendTransaction(transaction: Transaction, connection: Connection): Promise<string>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
}

export class V2EXFrontend {
  private connection: Connection;
  private wallet: WalletAdapter | null = null;
  private v2exTokenAddress: PublicKey;

  constructor(rpcUrl: string, v2exTokenAddress: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.v2exTokenAddress = new PublicKey(v2exTokenAddress);
  }

  async connectWallet(): Promise<string | null> {
    try {
      // Check if running in browser environment
      const globalWindow = (typeof window !== 'undefined' ? window : (globalThis as any).window) as any;
      
      if (!globalWindow || !globalWindow.solana) {
        throw new Error('Solana wallet not found. Please install Phantom or another Solana wallet.');
      }

      const solanaWallet = globalWindow.solana;
      
      if (!solanaWallet.isPhantom && !solanaWallet.isSolflare) {
        throw new Error('Please install a supported Solana wallet (Phantom or Solflare).');
      }

      this.wallet = solanaWallet as WalletAdapter;
      
      await this.wallet.connect();
      
      if (!this.wallet.publicKey) {
        throw new Error('Failed to get wallet public key');
      }

      return this.wallet.publicKey.toString();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    if (this.wallet) {
      await this.wallet.disconnect();
      this.wallet = null;
    }
  }

  getWalletAddress(): string | null {
    return this.wallet?.publicKey?.toString() || null;
  }

  isWalletConnected(): boolean {
    return this.wallet?.connected || false;
  }


  /**
   * Send SOL payment with memo
   */
  async sendSol(amount: number, memo: string, recipientAddress: string): Promise<string> {
    if (!this.wallet || !this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const recipientPubkey = new PublicKey(recipientAddress);
      const transaction = new Transaction();

      // Add memo instruction if provided
      if (memo) {
        const memoInstruction = {
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
          keys: [],
          data: Buffer.from(memo, 'utf-8')
        };
        transaction.add(memoInstruction);
      }

      // Add SOL transfer instruction
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: this.wallet.publicKey,
        toPubkey: recipientPubkey,
        lamports: lamports,
      });
      transaction.add(transferInstruction);

      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.wallet.publicKey;

      const signedTransaction = await this.wallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());

      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      return signature;
    } catch (error) {
      console.error('SOL payment failed:', error);
      throw error;
    }
  }

  /**
   * Send V2EX token payment with memo
   */
  async sendV2EXPayment(amount: number, memo: string, recipientAddress: string): Promise<string> {
    if (!this.wallet || !this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const recipientPubkey = new PublicKey(recipientAddress);
      
      const senderTokenAccount = await getAssociatedTokenAddress(
        this.v2exTokenAddress,
        this.wallet.publicKey
      );

      const recipientTokenAccount = await getAssociatedTokenAddress(
        this.v2exTokenAddress,
        recipientPubkey
      );

      const tokenAccountInfo = await this.connection.getAccountInfo(senderTokenAccount);
      if (!tokenAccountInfo) {
        throw new Error('Sender does not have a V2EX token account');
      }

      const tokenAccount = await getAccount(this.connection, senderTokenAccount);
      const decimals = 6;
      const adjustedAmount = amount * Math.pow(10, decimals);

      if (Number(tokenAccount.amount) < adjustedAmount) {
        throw new Error(`Insufficient V2EX balance. Required: ${amount}, Available: ${Number(tokenAccount.amount) / Math.pow(10, decimals)}`);
      }

      const transaction = new Transaction();

      // Add memo instruction if provided
      if (memo) {
        const memoInstruction = {
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
          keys: [],
          data: Buffer.from(memo, 'utf-8')
        };
        transaction.add(memoInstruction);
      }

      const transferInstruction = createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        this.wallet.publicKey,
        adjustedAmount,
        [],
        TOKEN_PROGRAM_ID
      );
      transaction.add(transferInstruction);

      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.wallet.publicKey;

      const signedTransaction = await this.wallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());

      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      return signature;
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<{signature: number[], publicKey: string, message: string}> {
    if (!this.wallet || !this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Try different signing methods for maximum compatibility
    try {
      // Method 1: Try with Uint8Array encoding (most common)
      const messageBytes = new TextEncoder().encode(message);
      const result1 = await this.wallet.signMessage(messageBytes);
      if (result1) {
        // Handle case where result might be the signature directly
        const signatureBytes = (result1 as any).signature || result1;
        return {
          signature: Array.from(signatureBytes),
          publicKey: this.wallet.publicKey.toString(),
          message: message
        };
      }
    } catch (error1) {
      // Continue to next method
    }

    try {
      // Method 2: Try with different wallet interfaces
      const messageBytes = new TextEncoder().encode(message);
      const result2 = await this.wallet.signMessage(messageBytes);
      
      if (result2) {
        let signatureBytes = (result2 as any).signature || result2;
        return {
          signature: Array.from(signatureBytes),
          publicKey: this.wallet.publicKey.toString(),
          message: message
        };
      }
    } catch (error2) {
      // Continue to next method
    }

    try {
      // Method 3: Try with display parameter for Phantom
      const messageBytes = new TextEncoder().encode(message);
      const result3 = await (this.wallet.signMessage as any)(messageBytes, 'utf8');
      
      return {
        signature: Array.from((result3 as any).signature || result3),
        publicKey: this.wallet.publicKey.toString(),
        message: message
      };
    } catch (error3) {
      // All methods failed
    }

    throw new Error('Message signing failed. Please ensure your wallet is unlocked and supports message signing.');
  }

  async getV2EXBalance(walletAddress?: string): Promise<number> {
    try {
      const address = walletAddress || this.getWalletAddress();
      if (!address) {
        throw new Error('No wallet address provided');
      }

      const publicKey = new PublicKey(address);
      const tokenAccount = await getAssociatedTokenAddress(
        this.v2exTokenAddress,
        publicKey
      );

      const accountInfo = await this.connection.getAccountInfo(tokenAccount);
      if (!accountInfo) {
        return 0;
      }

      const account = await getAccount(this.connection, tokenAccount);
      const decimals = 6;
      return Number(account.amount) / Math.pow(10, decimals);
    } catch (error) {
      console.error('Failed to get V2EX balance:', error);
      return 0;
    }
  }
}