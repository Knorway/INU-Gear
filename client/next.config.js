/** @type {import('next').NextConfig} */

module.exports = {
	images: {
		unoptimized: true,
	},
	webpack(config, options) {
		config.module.rules.push({
			test: /\.(mp3)$/,
			type: 'asset/resource',
			generator: {
				filename: 'static/chunks/[path][name].[hash][ext]',
			},
		});

		return config;
	},
};

// const nextConfig = {
// 	reactStrictMode: false,
// 	swcMinify: true,
// };

// module.exports = nextConfig;
