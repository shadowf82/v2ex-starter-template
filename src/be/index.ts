import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import * as nacl from 'tweetnacl';

export interface V2EXTransactionDetails {
  signature: string;
  amount: number;
  memo: string | null;
  from: string;
  to: string;
  timestamp: number;
  status: 'success' | 'failed';
  type: 'V2EX' | 'SOL';
}

export class V2EXBackend {
  private connection: Connection;
  private v2exTokenAddress: PublicKey;

  constructor(rpcUrl: string, v2exTokenAddress: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.v2exTokenAddress = new PublicKey(v2exTokenAddress);
  }

  async getV2EXBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      
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
      console.error('Error getting V2EX balance:', error);
      throw new Error(`Failed to get V2EX balance: ${error}`);
    }
  }

  async getTransactionDetails(txSignature: string): Promise<V2EXTransactionDetails | null> {
    try {
      const transaction = await this.connection.getParsedTransaction(txSignature, {
        maxSupportedTransactionVersion: 0
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const memo = this.extractMemo(transaction);
      
      // Try V2EX transfer first
      const v2exTransferInfo = this.extractV2EXTransferInfo(transaction);
      if (v2exTransferInfo) {
        return {
          signature: txSignature,
          amount: v2exTransferInfo.amount,
          memo: memo,
          from: v2exTransferInfo.from,
          to: v2exTransferInfo.to,
          timestamp: transaction.blockTime || 0,
          status: transaction.meta?.err ? 'failed' : 'success',
          type: 'V2EX'
        };
      }

      // Try SOL transfer
      const solTransferInfo = this.extractSOLTransferInfo(transaction);
      if (solTransferInfo) {
        return {
          signature: txSignature,
          amount: solTransferInfo.amount,
          memo: memo,
          from: solTransferInfo.from,
          to: solTransferInfo.to,
          timestamp: transaction.blockTime || 0,
          status: transaction.meta?.err ? 'failed' : 'success',
          type: 'SOL'
        };
      }

      throw new Error('No V2EX or SOL transfer found in transaction');
    } catch (error) {
      console.error('Error getting transaction details:', error);
      return null;
    }
  }

  private extractMemo(transaction: ParsedTransactionWithMeta): string | null {
    try {
      const instructions = transaction.transaction.message.instructions;
      
      for (const instruction of instructions) {
        const programId = instruction.programId.toString();
        
        if (programId === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr') {
          let data: string;
          
          if ('parsed' in instruction) {
            // Handle parsed memo instruction
            if (instruction.parsed && typeof instruction.parsed === 'string') {
              data = instruction.parsed;
            } else if (instruction.parsed && instruction.parsed.info) {
              data = instruction.parsed.info;
            } else {
              // Fallback to data field - cast as any to access data
              data = Buffer.from((instruction as any).data, 'base64').toString('utf-8');
            }
          } else {
            // Handle unparsed memo instruction
            data = Buffer.from(instruction.data, 'base64').toString('utf-8');
          }
          
          // Return memo as-is, no prefix processing
          return data || null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting memo:', error);
      return null;
    }
  }

  private extractV2EXTransferInfo(transaction: ParsedTransactionWithMeta): {
    amount: number;
    from: string;
    to: string;
  } | null {
    try {
      const instructions = transaction.transaction.message.instructions;
      
      for (const instruction of instructions) {
        if (!('parsed' in instruction)) {
          continue;
        }

        const parsed = instruction.parsed;
        if (!parsed) continue;

        if (parsed.type === 'transferChecked' || parsed.type === 'transfer') {
          const info = parsed.info;
          
          const postBalances = transaction.meta?.postTokenBalances || [];
          const preBalances = transaction.meta?.preTokenBalances || [];
          
          for (let i = 0; i < postBalances.length; i++) {
            const postBalance = postBalances[i];
            const preBalance = preBalances[i];
            
            if (postBalance?.mint === this.v2exTokenAddress.toString()) {
              if (info.authority || info.source) {
                const decimals = postBalance.uiTokenAmount.decimals || 6;
                const amount = info.tokenAmount ? 
                  info.tokenAmount.uiAmount : 
                  (info.amount / Math.pow(10, decimals));

                return {
                  amount: amount,
                  from: info.authority || info.source || '',
                  to: info.destination || ''
                };
              }
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error extracting V2EX transfer info:', error);
      return null;
    }
  }

  private extractSOLTransferInfo(transaction: ParsedTransactionWithMeta): {
    amount: number;
    from: string;
    to: string;
  } | null {
    try {
      const instructions = transaction.transaction.message.instructions;
      
      for (const instruction of instructions) {
        if (!('parsed' in instruction)) {
          continue;
        }

        const parsed = instruction.parsed;
        if (!parsed) continue;

        // Look for system program transfers (SOL transfers)
        if (parsed.type === 'transfer' && instruction.programId.toString() === '11111111111111111111111111111111') {
          const info = parsed.info;
          
          if (info && info.lamports) {
            const amount = info.lamports / 1000000000; // Convert lamports to SOL
            
            return {
              amount: amount,
              from: info.source || '',
              to: info.destination || ''
            };
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error extracting SOL transfer info:', error);
      return null;
    }
  }


  async verifySignature(message: string, signature: string, publicKey: string): Promise<boolean> {
    try {
      // Convert hex signature to Uint8Array
      const signatureBytes = new Uint8Array(
        signature.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );
      
      if (signatureBytes.length !== 64) {
        throw new Error('Invalid signature length');
      }
      
      const messageBytes = new TextEncoder().encode(message);
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      
      return nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

}