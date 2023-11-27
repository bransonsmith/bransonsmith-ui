import { useState } from "react"
import './MobileNavMenu.css'
import { UserNav } from './AuthComponents'

export default function MobileNavMenu(props) {

    const [expanded, setExpanded] = useState(false)
    const [expandedMore, setExpandedMore] = useState(false);

    return <div className="mobile-nav-menu">
        { expanded
        ? <div className="fixed right-0 top-0 w-[250px] z-[1000200] flex flex-col bg-defaultBg border-2 rounded rounded-r-none border-gray-800">

            <div className="ml-auto mr-0 px-5 pl-10 py-3 text-lg font-bold hover:text-accent-300" onClick={() => setExpanded(!expanded)}>X</div>
            
            <UserNav />

            {props.navItems.map(ni => {
                return <a className="w-full pl-5 py-4 border-t-2 border-gray-800 hover:text-accent-200" href={ni.target} key={ni.label}>{ni.label}</a>
            })}
            
          { props.morePages.length > 0 &&
            <div className="mt-0 mx-5 text-sm no-underline cursor-pointer py-2" onClick={() => setExpandedMore(!expandedMore)}>
                { !expandedMore
                ? <div className="my-auto mx-0 w-full p-0 text-sm no-underline font-bold text-defaultText py-2 border-t-2 border-gray-800">
                    More 
                </div> 
                : <div className="w-48 flex flex-col mt-0 py-2 z-10 absolute top-[50px] bg-defaultBgz-[1000210] bg-defaultBg border-2 rounded rounded-r-none border-gray-800"> 
                    <div className="ml-auto mr-0 px-5 pl-10 py-0 text-lg font-bold">X</div>
                    {props.morePages.map(page => {
                        return <a href={page.target} className='my-auto mx-5 text-sm no-underline py-1 hover:text-accent-200' key={page.label}>{page.label}</a>
                    })}
                </div>
                }
            </div>
            }
        </div>
        : <div className="collapased-nav-menu" onClick={() => setExpanded(!expanded)}>
            <span className="nav-menu-bar"></span>
            <span className="nav-menu-bar"></span>
            <span className="nav-menu-bar"></span>
        </div>
        }
    </div>
}
