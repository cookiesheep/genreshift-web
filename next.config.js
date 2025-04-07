/** @type {import('next').NextConfig} */
const nextConfig = {
  // 解决canvas依赖问题
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // 添加输出独立性配置
  output: 'standalone',
  // 禁止ESLint错误导致构建失败
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 提高静态资源优化
  images: {
    domains: ['cdn.jsdelivr.net'],
  },
  // 环境变量配置
  env: {
    DASHSCOPE_API_KEY: process.env.DASHSCOPE_API_KEY,
    DASHSCOPE_API_URL: process.env.DASHSCOPE_API_URL,
  },
  // 实验性功能
  experimental: {
    // 启用Edge运行时支持
    runtime: 'nodejs',
    serverComponentsExternalPackages: ['axios']
  }
}

module.exports = nextConfig 