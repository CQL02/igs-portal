/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/merchant',
                permanent: true,
            }
        ];
    },
};

export default nextConfig;