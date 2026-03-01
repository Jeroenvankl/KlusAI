import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint warnings/errors are checked locally via `npm run lint`.
    // Skip during production builds to avoid blocking deploys.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Limit file tracing root to the webapp directory to prevent
    // the build from resolving packages from the monorepo root
    // (which has React 19 from React Native, conflicting with our React 18).
    outputFileTracingRoot: __dirname,
  },
};

export default nextConfig;
