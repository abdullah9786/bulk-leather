/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Dangerously allow production builds to succeed even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Allow production builds to succeed even with ESLint errors  
    ignoreDuringBuilds: true,
  },
  // Skip type checking and linting during build
  swcMinify: true,
};

export default nextConfig;

