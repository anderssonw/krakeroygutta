/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		// Use 'tablet' and 'laptop' instead of 'sm' and 'lg'
		screens: {
			tablet: '768px',
			laptop: '1024px'
		},

		// Set primary/secondary color classes to be applied for all elements
		extend: {
			colors: {
				'primary-color': {
					light: '#5a5a5a',
					DEFAULT: '#3e3e3e',
					dark: '#282828'
				},
				'secondary-color': {
					light: '#f0f0f0',
					DEFAULT: '#e8e8e8',
					dark: '#d8d8d8'
				},
				'team-green': '#2E8B57',
				'team-red': '#DC143C',
				'team-white': '#FAF9F6',
				'team-black': '#343434'
			},
			height: {
				46: '11.5rem',
				128: '32rem',
				160: '40rem',
				192: '48rem'
			},
			fontSize: {
				'2xs': ['0.6rem', { lineHeight: '0.8rem' }]
			},

			animation: {
				fadeIn: 'fadeIn 0.5s linear',
				captainDropShadowPulse: 'captainDropShadowPulse 3s ease-in-out infinite'
			},
			keyframes: (theme) => ({
				fadeIn: {
					'0%': { opacity: '0%' },
					'100%': { opacity: '100%' }
				},

				captainDropShadowPulse: {
					'0%, 100%': { filter: 'drop-shadow(0 0 5px #FFD700)', transform: 'translateY(0)' },
					'50%': { filter: 'drop-shadow(0 0 20px #FFD700)', transform: 'translateY(-4px)' }
				}
			})
		}
	},

	plugins: []
};

module.exports = config;
