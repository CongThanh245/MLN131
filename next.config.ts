import type { NextConfig } from 'next';

// The game API lives in src/app/api (Next.js route handlers); rooms are stored in Supabase,
// so the app runs as-is on Vercel or any Node host.
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false
};

export default nextConfig;
