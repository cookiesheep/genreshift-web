This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 环境变量配置

在开始运行项目前，请先配置必要的环境变量：

1. 复制`.env.example`文件并重命名为`.env.local`
2. 编辑`.env.local`文件，填入您的API密钥：
   ```
   DASHSCOPE_API_KEY=your_api_key_here
   DASHSCOPE_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
   ```

### 启动开发服务器

配置好环境变量后，运行开发服务器：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### 在Vercel上配置环境变量

在Vercel上部署本项目时，需要配置以下环境变量：

1. 登录Vercel账户
2. 进入已部署的项目页面
3. 点击顶部导航栏的"Settings"选项
4. 在左侧菜单找到"Environment Variables"选项
5. 添加以下两个环境变量：
   - 名称：`DASHSCOPE_API_KEY`，值：``
   - 名称：`DASHSCOPE_API_URL`，值：``
6. 点击"Save"保存设置
7. 重新部署项目

> **注意**：虽然代码中已设置了默认的API密钥和URL，在Vercel上配置环境变量可以提高安全性，并且方便未来更新API密钥。

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 性能优化

本项目已经通过以下方式进行了优化，确保在Vercel部署环境中获得良好的用户体验：

### 服务器端优化

1. **Edge Runtime使用**: 使用Edge运行时提高API响应速度和稳定性
2. **API响应缓存**: 对相同内容的请求进行缓存，减少重复API调用
3. **分段处理机制**: 支持处理任意长度的文章，通过智能分段和并行处理提高效率
4. **模型选择优化**: 使用qwen-turbo模型提高响应速度
5. **超时控制**: 添加明确的超时设置，提高请求可靠性

### 前端体验优化

1. **平滑进度显示**: 改进进度条显示逻辑，更直观展示处理过程
2. **分段处理状态**: 显示当前处理进度和总段数，提供更好的用户体验
3. **离线模式支持**: 当API不可用时，使用本地处理提供基本功能
4. **错误处理增强**: 提供明确的错误信息和可行的恢复选项
5. **Markdown渲染改进**: 优化Markdown内容渲染，提供更好的阅读体验
6. **重试机制**: 支持请求失败时重试，并智能切换到离线模式

### 分段处理机制说明

本项目采用智能分段处理机制来处理长文本：

1. **智能分段**: 系统会自动将长文本按段落和句子进行智能分割，确保每段内容不超过2000字符
2. **并行处理**: 所有段落会并行处理，提高整体处理速度
3. **上下文保持**: 每段处理时会考虑其在原文中的位置，保持内容的连贯性
4. **进度显示**: 前端会显示当前处理的段落进度，让用户了解处理状态
5. **结果合并**: 所有段落处理完成后会自动合并，确保最终结果的完整性

在低网络连接质量或API服务中断时，应用将自动降级到离线模式，确保用户仍能获得基本功能，提高应用整体可用性。
