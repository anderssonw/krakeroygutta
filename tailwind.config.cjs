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
			height: {
				'128': '32rem',
				'160': '40rem',
				'192': '48rem',
			},
			dropShadow: {
				'bronze': "0 25px 25px rgb(184 115 51 / 0.15)",
				'silver': "0 25px 25px rgb(192 192 192 / 0.15)",
				'gold': "0 25px 25px rgb(255 215 0 / 0.15)",
				'card': "0 30px 10px rgb(0 0 0 / 0.50)"
			},
			fontSize: {
				'2xs': ['0.6rem', {lineHeight: '0.8rem'}]
			}
		},
	},
		
	plugins: [],
};

module.exports = config;
