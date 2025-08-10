# V2EX 开发模板

一个用于在 Solana 区块链上构建 V2EX 代币应用的综合开发模板，提供前端和后端工具。

> 📦 本项目使用 [pnpm](https://pnpm.io/) 作为包管理器，提供更快、更高效的依赖管理。

[English](./README.en.md)

## 功能特性

### 前端工具
- 连接 Solana 钱包（Phantom、Solflare 等）
- 发送 V2EX 代币支付（支持备注）
- 发送 SOL 支付（支持备注）
- 查询 V2EX 代币余额
- 使用钱包私钥签名消息

### 后端工具  
- 获取任意钱包地址的 V2EX 代币余额
- 解析交易详情并提取 V2EX/SOL 转账信息
- 从交易数据中提取备注信息
- 验证消息签名

### 演示界面
- 基于 Next.js 构建的交互式网页界面
- 测试钱包连接和支付功能
- 查看交易详情和余额
- 基于 React 的实时更新 UI
- 支持中文和英文界面

## 环境要求

如果尚未安装 pnpm，请先安装：

```bash
# 使用 npm
npm install -g pnpm

# 或使用 Homebrew (macOS)
brew install pnpm

# 或使用 curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## 安装

```bash
git clone https://github.com/your-repo/v2ex-starter-template.git
cd v2ex-starter-template
cp .env.local.example .env.local
pnpm install
pnpm dev
```

## 配置

将 `.env.local.example` 复制为 `.env.local` 并配置：

```bash
# 客户端环境变量（浏览器可访问）- 演示使用公共 RPC
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_V2EX_TOKEN_ADDRESS=9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump

# 服务端环境变量（仅用于 API 路由）- 演示使用公共 RPC
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
V2EX_TOKEN_ADDRESS=9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump
```

### ⚠️ 重要：RPC 配置

**生产环境请使用私有 RPC 服务提供商替换公共 RPC：**

- **Alchemy**: `https://solana-mainnet.g.alchemy.com/v2/your-api-key`
- **QuickNode**: `https://your-endpoint.solana-mainnet.quiknode.pro/your-api-key`  
- **Helius**: `https://rpc.helius.xyz/?api-key=your-api-key`

公共 RPC 有速率限制且可能不稳定或缓慢。私有 RPC 服务提供：
- 更高的速率限制
- 更好的可靠性
- 更快的响应时间
- 优先支持

### 环境变量说明

- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC 端点 URL（浏览器可访问）
- `NEXT_PUBLIC_V2EX_TOKEN_ADDRESS`: V2EX 代币合约地址（浏览器可访问）
- `SOLANA_RPC_URL`: 服务端 Solana RPC 端点 URL（仅用于 API 路由）
- `V2EX_TOKEN_ADDRESS`: 服务端 V2EX 代币合约地址（仅用于 API 路由）

注意：在 Next.js 中，以 `NEXT_PUBLIC_` 前缀的环境变量会暴露给浏览器，其他变量仅在服务端可用。

## 使用方法

### 前端使用

```typescript
import { V2EXFrontend } from './src/fe';

const frontend = new V2EXFrontend(
  'https://api.mainnet-beta.solana.com',
  '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump'
);

// 连接钱包
const address = await frontend.connectWallet();

// 发送 V2EX 代币支付
const v2exSignature = await frontend.sendV2EXPayment(
  amount, memo, recipientAddress
);

// 发送 SOL 支付
const solSignature = await frontend.sendSol(
  amount, memo, recipientAddress
);

// 查询余额
const balance = await frontend.getV2EXBalance();

// 签名消息
const signResult = await frontend.signMessage('Hello V2EX!');
```

### 后端使用

```typescript
import { V2EXBackend } from './src/be';

const backend = new V2EXBackend(
  'https://api.mainnet-beta.solana.com',
  '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump'
);

// 获取余额
const balance = await backend.getV2EXBalance('wallet-address');

// 获取交易详情（支持 V2EX 和 SOL 交易）
const details = await backend.getTransactionDetails('transaction-signature');

// 验证签名
const isValid = await backend.verifySignature('message', 'signature-hex', 'public-key');
```

## 开发

### 启动开发服务器

```bash
pnpm dev
```

打开 http://localhost:3000 访问演示界面。

### 构建

```bash
# 构建 Next.js 应用
pnpm build
```

## API 端点

- `GET /api/balance/:address` - 获取地址的 V2EX 余额
- `GET /api/transaction/:signature` - 获取交易详情（V2EX 或 SOL）
- `POST /api/verify-signature` - 验证消息签名

## 代币信息

- **代币地址**: `9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump`
- **网络**: Solana 主网
- **小数位数**: 6

## 许可证

MIT