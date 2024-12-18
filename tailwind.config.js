/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                defaultBg: '#1a1d22',
                contentBg: '#00000033',
                popUpBg: '#080811',
                inputBg: '#2b2e33',
                inputHoverBg: '#107d69',
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
                error: {
                    950: '#4a0529',
                    900: '#660529',
                    800: '#800529',
                    700: '#990529',
                    600: '#a40529',
                    500: '#af0529',
                    400: '#b30529',
                    300: '#cc0529',
                    200: '#e60529',
                    100: '#ff0529'
                },
                accentText: '#000c09',
                pokerCard: '#c4c4d4',
                pokerBack: '#14141d',
                pokerRed: '#8e3224',
                pokerBlack: '#0e0505'
            }
        },
    },
    plugins: [],
}