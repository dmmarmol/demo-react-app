import type { NextConfig } from 'next';
import packageJSON from './package.json' assert { type: 'json' };

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    cacheComponents: true,
    env: {
        APP_NAME: 'Demo React App',
        APP_AUTHOR_NAME: packageJSON.author.name,
        APP_AUTHOR_EMAIL: packageJSON.author.email,
        APP_AUTHOR_URL: packageJSON.author.url,
    },
};

export default nextConfig;
