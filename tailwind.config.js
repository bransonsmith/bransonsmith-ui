/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				defaultBg: '#1a1d22',
				contentBg: '#00000033',
				inputBg: '#2b2e33',
				defaultText: '#cdddcd',
				accent: '#25c486',
				accentText: '#111111',
      }
		},
	},
	plugins: [],
}