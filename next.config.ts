import { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    ...withPWA({
        dest: 'public',
        register: true,
        skipWaiting: true,
    }),
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
            },
            {
				protocol: 'https',
				hostname: 'media.licdn.com',
			},
        ],
    },
};

export default nextConfig;
