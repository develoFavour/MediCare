/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: "standalone",
	images: {
		domains: ["ogteinyzno7ew73x.public.blob.vercel-storage.com"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.public.blob.vercel-storage.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
