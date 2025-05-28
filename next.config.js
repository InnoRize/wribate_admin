/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Outputs a Single-Page Application (SPA).
    // distDir: './dist', 
    eslint: {
    // This disables ESLint during both `next build` and `next dev`
    ignoreDuringBuilds: true,
  },
  }
   
  export default nextConfig