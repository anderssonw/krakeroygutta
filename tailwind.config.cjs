/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontSize: {
				"h1-base": "16px",
				"h1-sm": "28px",
				"h1-lg": "40px",
		
				"h2-base": "10px", // Juster fortløpende
				"h2-sm": "18px", // Juster fortløpende
				"h2-lg": "24px", // Juster fortløpende
		
				"h3-base": "12px", // Juster fortløpende
				"h3-sm": "16px", // Juster fortløpende
				"h3-lg": "20px", // Juster fortløpende
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
