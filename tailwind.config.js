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
                accent: {
                    950: '#000c09',
                    900: '#013124',
                    800: '#023a2b',
                    700: '#04503c',
                    600: '#057053',
                    500: '#0b9c75',
                    400: '#0da57c',
                    300: '#10c696',
                    200: '#a6ddce',
                    100: '#d8f3eb'
                },
                accentText: '#000c09',
            }
        },
    },
    plugins: [],
}