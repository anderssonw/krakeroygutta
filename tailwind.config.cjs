/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontSize: {
				"h1-base": "28px", // 2*default
				"h1-sm": "30px", // 2*default
				"h1-lg": "32px", // 2*default
		
				"h2-base": "21px", // 1.5*default
				"h2-sm": "22px", // 1.5*default
				"h2-lg": "24px", // 1.5*default
		
				"h3-base": "12px", // Default readability
				"h3-sm": "16px", // Default readability
				"h3-lg": "20px", // Default readability
			},
			colors: {
				"primary-color": {
				light: "var(--base-color-light)",
				DEFAULT: "var(--base-color-default)",
				dark: "var(--base-color-dark)",
				},
				"secondary-color": {
				light: "var(--text-color-light)",
				DEFAULT: "var(--text-color-default)",
				dark: "var(--text-color-dark)",
				}
			},
		},
	},
		
	plugins: [],
};

module.exports = config;
