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
  // 删除或禁用optimizeCss
  experimental: {
    // optimizeCss: true  // 注释掉或删除这一行
  }
}

module.exports = nextConfig 