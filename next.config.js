/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
	trailingSlash: true,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
	optimizeFonts: false,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	env: {
		JWT_SECRET: "asdfghjklnbvcxzqwertyuiopmkioprewqasderfgnujm",
		AWS_SES_USER: "AKIA4QP4RTHI5CZNU65N",
		AWS_SES_PASSWORD: "BHNvcl65QPok7up3Fc+yl6a6oOvLK5SiABP8QD5fxiMz",
		CLOUD_NAME: "dev-empty",
		UPLOAD_PRESETS: "vikings",
		CLOUDINARY_URL:
			"https://api.cloudinary.com/v1_1/dev-empty/image/upload",
		CLOUDINARY_VIDEO_URL:
			"https://api.cloudinary.com/v1_1/dev-empty/video/upload",
		CLOUDINARY_ZIP_URL:
			"https://api.cloudinary.com/v1_1/dev-empty/raw/upload",
		STRIPE_SECRET_KEY: "sk_test_2DqyjEwaU0Nq0PpEMVQ3qSAw00zgrbnfPk",
		STRIPE_PUBLISHABLE_KEY: "pk_test_ZaZZWZGlvdIn12yFleIqyjSI00G4e18Kf7",
	},
};

module.exports = nextConfig;
