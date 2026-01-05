import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    cacheComponents: true,
    env: {
        APP_NAME: 'Demo React App',
    },
};

export default nextConfig;
