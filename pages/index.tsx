import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import config from '../lib/config';
import { V2EXFrontend } from '../src/fe/index';

// Translation dictionary
const translations = {
  zh: {
    title: '$V2EX 开发模板',
    subtitle: 'Solana 区块链工具包 - 主网',
    installCmd: `$ git clone git@github.com:becoolme/v2ex-starter-template.git
$ cp .env.local.example .env.local
$ pnpm install
$ pnpm dev`,
    configuration: '配置',
    configNote: '配置请在 .env.local 中设置',
    rpcNote: '⚠️ 需要使用私有 RPC 服务，公共 RPC 有限制',
    rpcProviders: 'RPC 服务商：Alchemy、QuickNode、Helius 等',
    wallet: '钱包',
    walletStatus: '状态',
    connected: '已连接',
    disconnected: '未连接',
    balance: '余额',
    connect: '连接',
    disconnect: '断开',
    send: '发送',
    sendV2ex: '发送 v2ex',
    sendSol: '发送 sol',
    queryBalance: '查询余额',
    query: '查询',
    inspectTransaction: '检查交易',
    inspect: '检查',
    sign: '签名',
    verify: '验证',
    verifySignature: '验证签名',
    signatureExplanation: '💡 数字签名是验证钱包所有权的安全方式。只有私钥持有者才能生成有效签名，从而证明钱包归属。建议在消息中包含当前时间戳作为动态参数，防止重放攻击。',
    recipientAddress: '接收地址',
    amount: '数量',
    memo: 'Memo（可选）',
    memoHint: 'memo 可用于关联订单号或备注信息',
    solanaAddress: 'Solana 地址',
    transactionSignature: '交易哈希',
    messageToSign: '待签名消息',
    signature: '签名',
    message: '消息',
    publicKey: '公钥',
    // Error and success messages
    walletNotConnected: '钱包未连接',
    missingRequiredFields: '错误：缺少必填字段',
    sendingPayment: '正在发送付款...',
    sendingV2exPayment: '正在发送 v2ex 付款...',
    sendingSolPayment: '正在发送 sol 付款...',
    txSent: '交易已发送',
    v2exTxSent: 'v2ex 交易已发送',
    solTxSent: 'sol 交易已发送',
    paymentFailed: '付款失败',
    v2exPaymentFailed: 'v2ex 付款失败',
    solPaymentFailed: 'sol 付款失败',
    connectingWallet: '正在连接钱包...',
    walletConnectedSuccessfully: '钱包连接成功',
    failedToConnectWallet: '钱包连接失败',
    walletDisconnected: '钱包已断开',
    failedToDisconnect: '断开失败',
    checkingBalance: '正在查询余额...',
    balanceResult: '余额',
    failedToGetBalance: '获取余额失败',
    failedToCheckBalance: '查询余额失败',
    pleaseEnterAddress: '请输入地址',
    pleaseEnterTransactionSignature: '请输入交易签名',
    gettingTransactionDetails: '正在获取交易详情...',
    txStatus: '状态',
    from: '发送方',
    to: '接收方',
    timestamp: '时间戳',
    transactionNotFound: '未找到交易',
    failedToGetTransaction: '获取交易失败',
    signingMessage: '正在签名消息...',
    messageCannotBeEmpty: '错误：消息不能为空',
    signFailed: '签名失败',
    verifyingSignature: '正在验证签名...',
    allFieldsRequired: '错误：所有字段都是必填的',
    verification: '验证',
    valid: '有效',
    invalid: '无效',
    verificationFailed: '验证失败',
    verifyFailed: '验证失败',
    transactionTip: '只在经过后端检查后，才能认为交易成功',
    balanceFor: '地址余额'
  },
  en: {
    title: '$V2EX starter template',
    subtitle: 'solana blockchain toolkit - mainnet',
    installCmd: `$ git clone git@github.com:becoolme/v2ex-starter-template.git
$ cp .env.local.example .env.local
$ pnpm install
$ pnpm dev`,
    configuration: 'configuration',
    configNote: 'Configure in .env.local file',
    rpcNote: '⚠️ Must use private RPC service, public RPC has limitations',
    rpcProviders: 'RPC Providers: Alchemy, QuickNode, Helius, etc.',
    wallet: 'wallet',
    walletStatus: 'status',
    connected: 'connected',
    disconnected: 'disconnected',
    balance: 'balance',
    connect: 'connect',
    disconnect: 'disconnect',
    send: 'send',
    sendV2ex: 'send v2ex',
    sendSol: 'send sol',
    queryBalance: 'query balance',
    query: 'query',
    inspectTransaction: 'inspect transaction',
    inspect: 'inspect',
    sign: 'sign',
    verify: 'verify',
    verifySignature: 'verify signature',
    signatureExplanation: '💡 Digital signatures are a secure way to verify wallet ownership. Only private key holders can generate valid signatures, proving wallet ownership. Recommend including current timestamp as dynamic parameter to prevent replay attacks.',
    recipientAddress: 'recipient address',
    amount: 'amount',
    memo: 'memo (optional)',
    memoHint: 'memo can be used for order number or notes',
    solanaAddress: 'solana address',
    transactionSignature: 'transaction hash',
    messageToSign: 'message to sign',
    signature: 'signature',
    message: 'message',
    publicKey: 'public key',
    // Error and success messages
    walletNotConnected: 'wallet not connected',
    missingRequiredFields: 'error: missing required fields',
    sendingPayment: 'sending payment...',
    sendingV2exPayment: 'sending v2ex payment...',
    sendingSolPayment: 'sending sol payment...',
    txSent: 'tx sent',
    v2exTxSent: 'v2ex tx sent',
    solTxSent: 'sol tx sent',
    paymentFailed: 'payment failed',
    v2exPaymentFailed: 'v2ex payment failed',
    solPaymentFailed: 'sol payment failed',
    connectingWallet: 'connecting wallet...',
    walletConnectedSuccessfully: 'wallet connected successfully',
    failedToConnectWallet: 'Failed to connect wallet',
    walletDisconnected: 'wallet disconnected',
    failedToDisconnect: 'Failed to disconnect',
    checkingBalance: 'checking balance...',
    balanceResult: 'balance',
    failedToGetBalance: 'failed to get balance',
    failedToCheckBalance: 'failed to check balance',
    pleaseEnterAddress: 'Please enter an address',
    pleaseEnterTransactionSignature: 'Please enter a transaction signature',
    gettingTransactionDetails: 'Getting transaction details...',
    txStatus: 'Status',
    from: 'From',
    to: 'To',
    timestamp: 'Timestamp',
    transactionNotFound: 'Transaction not found',
    failedToGetTransaction: 'Failed to get transaction',
    signingMessage: 'signing message...',
    messageCannotBeEmpty: 'error: message cannot be empty',
    signFailed: 'sign failed',
    verifyingSignature: 'verifying signature...',
    allFieldsRequired: 'error: all fields are required',
    verification: 'verification',
    valid: 'valid',
    invalid: 'invalid',
    verificationFailed: 'verification failed',
    verifyFailed: 'verify failed',
    transactionTip: 'only after backend verification can a transaction be considered successful',
    balanceFor: 'balance for'
  }
};

interface WalletInfo {
  address: string | null;
  balance: string | null;
  connected: boolean;
}

export default function Home() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: null,
    balance: null,
    connected: false
  });
  const [sdk, setSdk] = useState<any>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  const t = (key: string) => translations[language][key as keyof typeof translations['zh']] || key;
  const toggleLanguage = () => setLanguage(prev => prev === 'zh' ? 'en' : 'zh');

  useEffect(() => {
    // Initialize SDK when Solana Web3 is loaded
    const initializeSDK = () => {
      if (typeof window !== 'undefined' && (window as any).solanaWeb3) {
        const newSdk = new V2EXFrontend(config.client.rpcUrl, config.client.tokenAddress);
        setSdk(newSdk);
      }
    };

    // Try to initialize immediately
    initializeSDK();

    // If not available yet, poll for it
    const interval = setInterval(() => {
      if ((window as any).solanaWeb3) {
        initializeSDK();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const showResult = (elementId: string, message: string, type: string = '') => {
    setResults(prev => ({
      ...prev,
      [elementId]: `${type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : ''}${message}`
    }));
  };

  const connectWallet = async () => {
    if (!sdk) return;
    try {
      showResult('walletResult', t('connectingWallet'), 'loading');
      const address = await sdk.connectWallet();
      setWalletInfo({
        address: address,
        balance: 'loading...',
        connected: true
      });
      await checkBalance();
      showResult('walletResult', t('walletConnectedSuccessfully'), 'success');
    } catch (error: any) {
      showResult('walletResult', `${t('failedToConnectWallet')}: ${error.message}`, 'error');
    }
  };

  const disconnectWallet = async () => {
    if (!sdk) return;
    try {
      await sdk.disconnectWallet();
      setWalletInfo({
        address: null,
        balance: null,
        connected: false
      });
      showResult('walletResult', t('walletDisconnected'), 'success');
    } catch (error: any) {
      showResult('walletResult', `${t('failedToDisconnect')}: ${error.message}`, 'error');
    }
  };

  const checkBalance = async () => {
    if (!sdk) return;
    try {
      const address = sdk.getWalletAddress();
      if (!address) {
        showResult('walletResult', t('walletNotConnected'), 'error');
        return;
      }

      showResult('walletResult', t('checkingBalance'), 'loading');
      const response = await fetch(`/api/balance/${address}`);
      const data = await response.json();
      
      if (response.ok) {
        setWalletInfo(prev => ({ ...prev, balance: `${data.balance} V2EX` }));
        showResult('walletResult', `${t('balance')}: ${data.balance} V2EX`, 'success');
      } else {
        showResult('walletResult', data.error || t('failedToGetBalance'), 'error');
      }
    } catch (error: any) {
      showResult('walletResult', `${t('failedToCheckBalance')}: ${error.message}`, 'error');
    }
  };

  const sendV2EXPayment = async () => {
    if (!sdk) return;
    try {
      const recipientInput = document.getElementById('recipientAddress') as HTMLInputElement;
      const amountInput = document.getElementById('amount') as HTMLInputElement;
      const memoInput = document.getElementById('memo') as HTMLInputElement;
      
      const recipient = recipientInput?.value;
      const amount = amountInput?.value;
      const memo = memoInput?.value || '';

      if (!recipient || !amount) {
        showResult('paymentResult', t('missingRequiredFields'), 'error');
        return;
      }

      showResult('paymentResult', t('sendingV2exPayment'), 'loading');
      const signature = await sdk.sendV2EXPayment(amount, memo, recipient);
      showResult('paymentResult', `${t('v2exTxSent')}: ${signature}`, 'success');
      
      if (recipientInput) recipientInput.value = '';
      if (amountInput) amountInput.value = '';
      if (memoInput) memoInput.value = '';
      
      setTimeout(checkBalance, 2000);
    } catch (error: any) {
      showResult('paymentResult', `${t('v2exPaymentFailed')}: ${error.message}`, 'error');
    }
  };

  const sendSolPayment = async () => {
    if (!sdk) return;
    try {
      const recipientInput = document.getElementById('recipientAddress') as HTMLInputElement;
      const amountInput = document.getElementById('amount') as HTMLInputElement;
      const memoInput = document.getElementById('memo') as HTMLInputElement;
      
      const recipient = recipientInput?.value;
      const amount = amountInput?.value;
      const memo = memoInput?.value || '';

      if (!recipient || !amount) {
        showResult('paymentResult', t('missingRequiredFields'), 'error');
        return;
      }

      showResult('paymentResult', t('sendingSolPayment'), 'loading');
      const signature = await sdk.sendSol(amount, memo, recipient);
      showResult('paymentResult', `${t('solTxSent')}: ${signature}`, 'success');
      
      if (recipientInput) recipientInput.value = '';
      if (amountInput) amountInput.value = '';
      if (memoInput) memoInput.value = '';
      
      setTimeout(checkBalance, 2000);
    } catch (error: any) {
      showResult('paymentResult', `${t('solPaymentFailed')}: ${error.message}`, 'error');
    }
  };

  const checkAddressBalance = async () => {
    try {
      const addressInput = document.getElementById('checkAddress') as HTMLInputElement;
      const address = addressInput?.value;
      
      if (!address) {
        showResult('balanceResult', 'Please enter an address', 'error');
        return;
      }

      showResult('balanceResult', 'Checking balance...', 'loading');
      const response = await fetch(`/api/balance/${address}`);
      const data = await response.json();
      
      if (response.ok) {
        showResult('balanceResult', `${t('balanceFor')} ${address.substring(0, 8)}...: ${data.balance} V2EX`, 'success');
      } else {
        showResult('balanceResult', data.error || t('failedToGetBalance'), 'error');
      }
    } catch (error: any) {
      showResult('balanceResult', `${t('failedToCheckBalance')}: ${error.message}`, 'error');
    }
  };

  const getTransactionDetails = async () => {
    try {
      const signatureInput = document.getElementById('txSignature') as HTMLInputElement;
      const signature = signatureInput?.value;
      
      if (!signature) {
        showResult('transactionResult', t('pleaseEnterTransactionSignature'), 'error');
        return;
      }

      showResult('transactionResult', t('gettingTransactionDetails'), 'loading');
      const response = await fetch(`/api/transaction/${signature}`);
      const data = await response.json();
      
      if (response.ok && data.transaction) {
        const tx = data.transaction;
        showResult('transactionResult', `
Status: ${tx.status}
Type: ${tx.type}
Amount: ${tx.amount} ${tx.type === 'V2EX' ? 'V2EX' : 'SOL'}
Memo: ${tx.memo || 'N/A'}
From: ${tx.from}
To: ${tx.to}
Timestamp: ${new Date(tx.timestamp * 1000).toLocaleString()}`, 'success');
      } else {
        showResult('transactionResult', data.error || t('transactionNotFound'), 'error');
      }
    } catch (error: any) {
      showResult('transactionResult', `${t('failedToGetTransaction')}: ${error.message}`, 'error');
    }
  };

  const signMessage = async () => {
    if (!sdk) return;
    try {
      const messageInput = document.getElementById('messageInput') as HTMLInputElement;
      const message = messageInput?.value;
      
      if (!message) {
        showResult('signResult', 'error: message cannot be empty', 'error');
        return;
      }

      showResult('signResult', 'signing message...', 'loading');
      const result = await sdk.signMessage(message);
      
      let signatureHex = '';
      if (result.signature && Array.isArray(result.signature)) {
        signatureHex = result.signature.map((b: number) => b.toString(16).padStart(2, '0')).join('');
      }
      
      showResult('signResult', `signature: ${signatureHex}
publicKey: ${result.publicKey}
message: ${result.message}`, 'success');
      
      // Auto-fill verify form
      const verifySignatureInput = document.getElementById('verifySignature') as HTMLInputElement;
      const verifyMessageInput = document.getElementById('verifyMessage') as HTMLInputElement;
      const verifyPubkeyInput = document.getElementById('verifyPubkey') as HTMLInputElement;
      
      if (verifySignatureInput && signatureHex) verifySignatureInput.value = signatureHex;
      if (verifyMessageInput && result.message) verifyMessageInput.value = result.message;
      if (verifyPubkeyInput && result.publicKey) verifyPubkeyInput.value = result.publicKey;
      
      if (messageInput) messageInput.value = '';
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      showResult('signResult', 'sign failed: ' + errorMessage, 'error');
    }
  };

  const verifySignature = async () => {
    try {
      const signatureInput = document.getElementById('verifySignature') as HTMLInputElement;
      const messageInput = document.getElementById('verifyMessage') as HTMLInputElement;
      const publicKeyInput = document.getElementById('verifyPubkey') as HTMLInputElement;
      
      const signature = signatureInput?.value;
      const message = messageInput?.value;
      const publicKey = publicKeyInput?.value;

      if (!signature || !message || !publicKey) {
        showResult('verifyResult', 'error: all fields are required', 'error');
        return;
      }

      showResult('verifyResult', 'verifying signature...', 'loading');
      
      const response = await fetch('/api/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature: signature,
          message: message,
          publicKey: publicKey
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const status = data.isValid ? 'valid' : 'invalid';
        const resultType = data.isValid ? 'success' : 'error';
        showResult('verifyResult', `${t('verification')}: ${status}`, resultType);
      } else {
        showResult('verifyResult', data.error || t('verificationFailed'), 'error');
      }
      
    } catch (error: any) {
      showResult('verifyResult', `${t('verifyFailed')}: ${error.message}`, 'error');
    }
  };

  return (
    <>
      <Head>
        <title>V2EX Starter Template</title>
        <meta name="description" content="V2EX Starter Template for Solana blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Script 
        src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"
        strategy="beforeInteractive"
      />

      {process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN && process.env.NEXT_PUBLIC_ANALYTICS_SRC && (
        <Script
          defer
          data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}
          src={process.env.NEXT_PUBLIC_ANALYTICS_SRC}
        />
      )}

      <div className="max-w-4xl w-full bg-white mt-10">
        <div className="border-b border-black pb-3 mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-4">
            <div className="flex-1">
              <div className="text-black text-xl sm:text-2xl font-bold mb-2">{t('title')}</div>
              <div className="text-gray-700 text-sm">{t('subtitle')}</div>
            </div>
            <button className="bg-white text-black border border-black px-2 py-1 font-mono text-xs font-bold cursor-pointer hover:bg-black hover:text-white transition-all duration-100" onClick={toggleLanguage}>
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
          <div className="bg-black text-green-400 px-2 py-1 my-1 text-xs border border-gray-600 whitespace-pre-line font-mono overflow-x-auto">{t('installCmd')}</div>
        </div>
        
        <div className="mb-6 border border-black" style={{backgroundColor: '#fafafa'}}>
          <div className="bg-black px-4 py-2.5 text-white text-sm font-bold border-b border-black">{t('configuration')}</div>
          <div className="p-4">
            <div className="my-2">
              <div className="text-sm mb-1.5 text-black">
                <strong className="font-bold inline-block w-20 sm:w-24">RPC URL:</strong> https://api.mainnet-beta.solana.com
              </div>
              <div className="text-sm mb-1.5 text-black">
                <strong className="font-bold inline-block w-20 sm:w-24">V2EX Token:</strong> <span className="break-all">{config.client.tokenAddress}</span>
              </div>
              <div className="text-sm text-orange-600 my-2.5 font-bold p-2 bg-orange-50 border border-orange-600 rounded-sm">
                {t('rpcNote')}
              </div>
              <div className="text-xs text-gray-600 mb-3 italic">
                {t('rpcProviders')}
              </div>
              <div className="text-xs text-gray-700 my-3">
                {t('configNote')}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6 border border-black" style={{backgroundColor: '#fafafa'}}>
          <div className="bg-black px-4 py-2.5 text-white text-sm font-bold border-b border-black">{t('wallet')}</div>
          <div className="p-4">
            <div className="bg-white text-green-600 px-2 py-1.5 mb-3 text-xs border border-black">
              {t('walletStatus')}: {walletInfo.connected ? 
                `${t('connected')} ${walletInfo.address?.substring(0, 8)}...${walletInfo.address?.substring(-4)}` : 
                t('disconnected')}
              {walletInfo.balance && <><br />{t('balance')}: {walletInfo.balance}</>}
            </div>
            <div className="p-3 my-3 text-xs border whitespace-pre-wrap font-mono overflow-x-auto" style={{background: '#f8f8f8', borderColor: '#ccc', color: '#222'}}>{`import { V2EXFrontend } from './src/fe';

const frontend = new V2EXFrontend(rpcUrl, tokenAddress);
const address = await frontend.connectWallet();
const balance = await frontend.getV2EXBalance();`}</div>
            {!walletInfo.connected ? (
              <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={connectWallet}>{t('connect')}</button>
            ) : (
              <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={disconnectWallet}>{t('disconnect')}</button>
            )}
            <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={checkBalance} disabled={!walletInfo.connected}>{t('balance')}</button>
            {results.walletResult && <div className="bg-white text-black border-2 border-black whitespace-pre-wrap break-all overflow-y-auto" style={{padding: '12px', marginTop: '12px', fontSize: '13px', maxHeight: '200px'}}>{results.walletResult}</div>}
          </div>
        </div>

        <div className="mb-6 border border-black" style={{backgroundColor: '#fafafa'}}>
          <div className="bg-black px-4 py-2.5 text-white text-sm font-bold border-b border-black">{t('send')}</div>
          <div className="p-4">
            <div className="p-3 my-3 text-xs border whitespace-pre-wrap font-mono overflow-x-auto" style={{background: '#f8f8f8', borderColor: '#ccc', color: '#222'}}>{`// Send V2EX tokens
const signature = await frontend.sendV2EXPayment(
  amount, memo, recipientAddress
);

// Send SOL
const signature = await frontend.sendSol(
  amount, memo, recipientAddress
);`}</div>
            <input className="w-full bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px', marginBottom: '10px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="text" id="recipientAddress" placeholder={t('recipientAddress')} />
            <div className="flex flex-col sm:flex-row gap-3" style={{marginBottom: '10px'}}>
              <input className="flex-1 bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="number" id="amount" placeholder={t('amount')} step="0.01" />
              <input className="flex-1 bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="text" id="memo" placeholder={t('memo')} />
            </div>
            <div className="italic" style={{fontSize: '12px', color: '#666', marginTop: '4px', marginBottom: '12px'}}>
              💡 {t('memoHint')}
            </div>
            <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={sendV2EXPayment} disabled={!walletInfo.connected}>{t('sendV2ex')}</button>
            <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={sendSolPayment} disabled={!walletInfo.connected}>{t('sendSol')}</button>
            {results.paymentResult && <div className="bg-white text-black border-2 border-black whitespace-pre-wrap break-all overflow-y-auto" style={{padding: '12px', marginTop: '12px', fontSize: '13px', maxHeight: '200px'}}>{results.paymentResult}</div>}
          </div>
        </div>

        <div className="mb-6 border border-black" style={{backgroundColor: '#fafafa'}}>
          <div className="bg-black px-4 py-2.5 text-white text-sm font-bold border-b border-black">{t('queryBalance')}</div>
          <div className="p-4">
            <div className="p-3 my-3 text-xs border whitespace-pre-wrap font-mono overflow-x-auto" style={{background: '#f8f8f8', borderColor: '#ccc', color: '#222'}}>{`import { V2EXBackend } from './src/be';

const backend = new V2EXBackend(rpcUrl, tokenAddress);
const balance = await backend.getV2EXBalance(address);`}</div>
            <input className="w-full bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px', marginBottom: '10px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="text" id="checkAddress" placeholder={t('solanaAddress')} />
            <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={checkAddressBalance}>{t('query')}</button>
            {results.balanceResult && <div className="bg-white text-black border-2 border-black whitespace-pre-wrap break-all overflow-y-auto" style={{padding: '12px', marginTop: '12px', fontSize: '13px', maxHeight: '200px'}}>{results.balanceResult}</div>}
          </div>
        </div>

        <div className="mb-6 border border-black" style={{backgroundColor: '#fafafa'}}>
          <div className="bg-black px-4 py-2.5 text-white text-sm font-bold border-b border-black">{t('inspectTransaction')}</div>
          <div className="p-4">
            <div className="font-normal" style={{fontSize: '13px', color: '#1e3a8a', marginBottom: '12px', padding: '12px', background: '#eff6ff', border: '1px solid #3b82f6', lineHeight: '1.4'}}>
              💡 {t('transactionTip')}
            </div>
            <div className="p-3 my-3 text-xs border whitespace-pre-wrap font-mono overflow-x-auto" style={{background: '#f8f8f8', borderColor: '#ccc', color: '#222'}}>{`const details = await backend.getTransactionDetails(signature);`}</div>
            <input className="w-full bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px', marginBottom: '10px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="text" id="txSignature" placeholder={t('transactionSignature')} />
            <div className="font-mono break-all cursor-pointer transition-colors duration-200" style={{fontSize: '11px', color: '#888', marginTop: '4px', marginBottom: '8px'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#666'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#888'} onClick={() => {
              const input = document.getElementById('txSignature') as HTMLInputElement;
              if (input) input.value = '5rBiFnhk2xypj1wnMAQtAskuysMR1MtrTVVHSPsCxXNEdVNkCdwFPVHua7itteGChKGu5gYMzmZxEQ1ZDQjXxEHX';
            }}>$V2EX tx: 5rBiFnhk2xypj1wnMAQtAskuysMR1MtrTVVHSPsCxXNEdVNkCdwFPVHua7itteGChKGu5gYMzmZxEQ1ZDQjXxEHX</div>
            <div className="font-mono break-all cursor-pointer transition-colors duration-200" style={{fontSize: '11px', color: '#888', marginTop: '4px', marginBottom: '8px'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#666'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#888'} onClick={() => {
              const input = document.getElementById('txSignature') as HTMLInputElement;
              if (input) input.value = '43AZaVYa6B1Z9Wct8nutBvNBEv7KbMzPFqpjWNdJKiSeRpR6eBVQKupe6sSyXoki5RfWgTnHQFDr8YP6vYGwycsE';
            }}>SOL tx: 43AZaVYa6B1Z9Wct8nutBvNBEv7KbMzPFqpjWNdJKiSeRpR6eBVQKupe6sSyXoki5RfWgTnHQFDr8YP6vYGwycsE</div>
            <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={getTransactionDetails}>{t('inspect')}</button>
            {results.transactionResult && <div className="bg-white text-black border-2 border-black whitespace-pre-wrap break-all overflow-y-auto" style={{padding: '12px', marginTop: '12px', fontSize: '13px', maxHeight: '200px'}}>{results.transactionResult}</div>}
          </div>
        </div>

        <div className="mb-6 border border-black" style={{backgroundColor: '#fafafa'}}>
          <div className="bg-black px-4 py-2.5 text-white text-sm font-bold border-b border-black">{t('sign')}</div>
          <div className="p-4">
            <div className="font-normal" style={{fontSize: '13px', color: '#1e3a8a', margin: '8px 0', padding: '12px', background: '#eff6ff', border: '1px solid #3b82f6', lineHeight: '1.4'}}>
              {t('signatureExplanation')}
            </div>
            <div className="p-3 my-3 text-xs border whitespace-pre-wrap font-mono overflow-x-auto" style={{background: '#f8f8f8', borderColor: '#ccc', color: '#222'}}>{`const signature = await frontend.signMessage(message);
const isValid = await backend.verifySignature(message, signature, publicKey);`}</div>
            <input className="w-full bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px', marginBottom: '10px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="text" id="messageInput" placeholder={t('messageToSign')} />
            <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={signMessage} disabled={!walletInfo.connected}>{t('sign')}</button>
            {results.signResult && <div className="bg-white text-black border-2 border-black whitespace-pre-wrap break-all overflow-y-auto" style={{padding: '12px', marginTop: '12px', fontSize: '13px', maxHeight: '200px'}}>{results.signResult}</div>}
            
            <div className="font-bold border-t-2 border-black" style={{color: '#333', fontSize: '14px', margin: '24px 0 16px 0', paddingTop: '16px'}}>{t('verifySignature')}</div>
            <input className="w-full bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px', marginBottom: '10px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="text" id="verifySignature" placeholder={t('signature')} />
            <input className="w-full bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px', marginBottom: '10px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="text" id="verifyMessage" placeholder={t('message')} />
            <input className="w-full bg-white text-black font-mono focus:outline-none" style={{padding: '8px 12px', border: '2px solid #333', fontSize: '14px', marginBottom: '10px'}} onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#000000', (e.target as HTMLInputElement).style.background = '#f9f9f9')} onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333', (e.target as HTMLInputElement).style.background = '#ffffff')} type="text" id="verifyPubkey" placeholder={t('publicKey')} />
            <button className="bg-black text-white border-2 border-black font-mono font-bold cursor-pointer transition-all duration-100 disabled:cursor-not-allowed" style={{padding: '10px 16px', fontSize: '14px', marginRight: '10px', marginBottom: '10px'}} onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#ffffff', e.currentTarget.style.color = '#000000')} onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#000000', e.currentTarget.style.color = '#ffffff')} onClick={verifySignature}>{t('verify')}</button>
            {results.verifyResult && <div className="bg-white text-black border-2 border-black whitespace-pre-wrap break-all overflow-y-auto" style={{padding: '12px', marginTop: '12px', fontSize: '13px', maxHeight: '200px'}}>{results.verifyResult}</div>}
          </div>
        </div>
        
        <div className="text-center border-t" style={{marginTop: '40px', paddingTop: '20px', borderColor: '#333'}}>
          <div style={{fontSize: '14px'}}>
            <a href="https://github.com/becoolme/v2ex-starter-template" target="_blank" rel="noopener noreferrer" className="no-underline font-bold transition-colors duration-200" style={{color: '#000'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#666'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#000'}>github</a>
            <span style={{margin: '0 12px', color: '#333'}}>•</span>
            <a href="https://x.com/becool_me" target="_blank" rel="noopener noreferrer" className="no-underline font-bold transition-colors duration-200" style={{color: '#000'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#666'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#000'}>x</a>
            <span style={{margin: '0 12px', color: '#333'}}>•</span>
            <a href="https://v2ex.com/member/BeCool" target="_blank" rel="noopener noreferrer" className="no-underline font-bold transition-colors duration-200" style={{color: '#000'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#666'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#000'}>v2ex</a>
          </div>
        </div>
      </div>

    </>
  );
}