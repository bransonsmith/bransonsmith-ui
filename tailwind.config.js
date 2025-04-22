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
                accentShadePositive: {
                    950: '#1a95d9ff',
                    900: '#1a95d9ee',
                    800: '#1a95d9dd',
                    700: '#1a95d9bb',
                    600: '#1a95d999',
                    500: '#1a95d977',
                    400: '#1a95d955',
                    300: '#1a95d933',
                    200: '#1a95d922',
                    100: '#1a95d911'
                },
                accentShadeNegative: {
                    950: '#d6672bff',
                    900: '#d6672bee',
                    800: '#d6672bdd',
                    700: '#d6672bbb',
                    600: '#d6672b99',
                    500: '#d6672b77',
                    400: '#d6672b55',
                    300: '#d6672b33',
                    200: '#d6672b22',
                    100: '#d6672b11'
                },
                accentShadePowers: {
                    950: '#9d2bd6',
                    900: '#3f2bd6',
                    800: '#2b6ad6',
                    700: '#2ba0d6',
                    600: '#2bcbd6',
                    500: '#2bd6ab',
                    400: '#2bd689',
                    300: '#2bd65b',
                    200: '#2ed62b',
                    100: '#67d62b'
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