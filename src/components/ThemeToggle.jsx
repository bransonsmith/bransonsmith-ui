import './ThemeToggle.css'
import themeSvg from '../Assets/ThemeToggle/theme.svg'
import { useEffect, useState } from 'react';

export default function ThemeToggle(props) {

    const [theme, setTheme] = useState(null)

    useEffect(() => {
        if (!theme) {
            var targetTheme = localStorage.getItem('bsamp-theme')
            setTheme(targetTheme)
            document.documentElement.setAttribute('data-theme', targetTheme)
        }
    })

    function toggleTheme() {
        var targetTheme = "light";
        if (theme == "light") {
            targetTheme = "dark";
        }
        setTheme(targetTheme)
        document.documentElement.setAttribute('data-theme', targetTheme)
        localStorage.setItem('bsamp-theme', targetTheme)
    }

    return <div className='theme-toggle' onClick={toggleTheme}><img className='theme-toggle-icon' src={themeSvg}/></div>
}