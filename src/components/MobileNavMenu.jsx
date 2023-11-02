import { useState } from "react"
import './MobileNavMenu.css'

export default function MobileNavMenu(props) {

    const [expanded, setExpanded] = useState(false)

    return <div className="mobile-nav-menu" onClick={() => setExpanded(!expanded)}>
        { expanded
        ? <div className="fixed right-0 top-0 w-[250px] z-[1000200] flex flex-col bg-defaultBg border-2 rounded rounded-r-none border-gray-800">
            <div className="ml-auto mr-0 px-5 pl-10 py-3 text-lg font-bold">X</div>
            {props.navItems.map(ni => {
                return <a className="w-full pl-5 py-4 border-t-2 border-gray-800" href={ni.target} key={ni.label}>{ni.label}</a>
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
