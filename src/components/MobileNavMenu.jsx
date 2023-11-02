import { useState } from "react"
import './MobileNavMenu.css'
import close from '../Assets/MobileNavMenu/closeIcon.png'

export default function MobileNavMenu(props) {

    const [expanded, setExpanded] = useState(false)

    return <div className="mobile-nav-menu" onClick={() => setExpanded(!expanded)}>
        { expanded
        ? <div className="fixed right-0 top-0 w-[250px] z-[1000200] flex flex-col p-5 bg-defaultBg border-2 rounded rounded-r-none border-gray-800">
            <img src={close} alt="close menu" className="close-nav-menu"/>
            {props.navItems.map(ni => {
                return <a className="nav-menu-item" href={ni.target} key={ni.label}>{ni.label}</a>
            })}
        </div>
        : <div className="collapased-nav-menu">
            <span className="nav-menu-bar"></span>
            <span className="nav-menu-bar"></span>
            <span className="nav-menu-bar"></span>
        </div>
        }
    </div>
}
