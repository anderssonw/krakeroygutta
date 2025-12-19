import { type Config } from 'prettier';

const config: Config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 140,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	],
	tailwindFunctions: ['clsx'],
	tailwindStylesheet: './src/routes/layout.css'
};

export default config;
