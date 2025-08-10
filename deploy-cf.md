# 部署到 Cloudflare Pages

## ✅ 已支持 Edge Runtime！

所有 API 路由已更新为使用 Edge Runtime，现在可以完整部署到 Cloudflare Pages。

## 方案 1: 完整功能部署（推荐）

现在支持完整的 API 功能，包括前端和后端。

### 步骤：

1. **安装 Cloudflare Pages 适配器**：
   ```bash
   npm install -D @cloudflare/next-on-pages
   ```

2. **在 Cloudflare Pages 创建项目**
   - 连接你的 GitHub 仓库
   - 选择 v2ex-starter-template 项目

3. **配置构建设置**：
   ```
   Framework preset: Next.js
   Build command: npx @cloudflare/next-on-pages
   Build output directory: .vercel/output/static
   ```

4. **设置环境变量**：
   ```
   NEXT_PUBLIC_SOLANA_RPC_URL=你的RPC地址
   NEXT_PUBLIC_V2EX_TOKEN_ADDRESS=9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump
   SOLANA_RPC_URL=你的RPC地址
   V2EX_TOKEN_ADDRESS=9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump
   ```

5. **部署**

### 功能状态：
- ✅ 前端钱包连接和签名功能
- ✅ 查询余额 API（使用直接 RPC 调用）
- ✅ 检查交易 API（使用直接 RPC 调用）
- ⚠️ 签名验证 API（基础格式验证，完整验证需要客户端实现）

---

## 方案 2: 使用 Vercel（完整功能）

如果需要完整的 API 功能，建议使用 Vercel：

1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 自动部署，无需额外配置
4. 支持所有 API 路由

---

## 方案 3: 分离部署

- **前端**: Cloudflare Pages（静态站点）
- **API**: 单独部署为 Cloudflare Workers 或使用其他服务

这需要重写 API 部分以兼容 Workers 环境。

---

## 当前配置说明

`next.config.js` 已配置为静态导出模式：
- `output: 'export'` - 生成静态 HTML
- `images.unoptimized: true` - 禁用图片优化
- `trailingSlash: true` - 添加尾部斜杠

运行 `npm run build` 后会在 `out` 目录生成静态文件。