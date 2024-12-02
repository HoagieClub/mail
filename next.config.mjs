import withPWA from 'next-pwa';

const nextConfig = {
    reactStrictMode: true,
    ...withPWA({
        dest: 'public',
        register: true,
        skipWaiting: true,
    }),
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
        domains: ['github.com'],
    },
};

export default nextConfig;
