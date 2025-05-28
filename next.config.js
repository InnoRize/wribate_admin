/** @type {import('next').NextConfig} */
const nextConfig = {
    // distDir: './dist', 
    eslint: {
    // This disables ESLint during both `next build` and `next dev`
    ignoreDuringBuilds: true,
  },
  }
   
  export default nextConfig