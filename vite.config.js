// vite.config.js
export default {
	root: "src/",
	publicDir: "../public/",
	build: {
		outDir: "../dist", // Output in the dist/ folder
		emptyOutDir: true, // Empty the folder first
		sourcemap: true, // Add sourcemap
	},
	base: "/dawn-of-the-dev/",
};
