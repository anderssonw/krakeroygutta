/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {

		// Use 'tablet' and 'laptop' instead of 'sm' and 'lg'
		screens: {
			'tablet': '768px',
			'laptop': '1024px',
		},

		// Set primary/secondary color classes to be applied for all elements
		extend: {
			colors: {
				"primary-color": {
					light: "#5a5a5a",
					DEFAULT: "#3e3e3e",
					dark: "#282828",
				},
				"secondary-color": {
					light: "#f0f0f0",
					DEFAULT: "#e8e8e8",
					dark: "#d8d8d8",
				}
			},
		},
	},
		
	plugins: [],
};

module.exports = config;
