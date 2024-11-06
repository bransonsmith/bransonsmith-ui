import bsdev from '../assets/BS_Dev_logo.png'
import { useState } from 'react'
// import { UserNav } from './AuthComponents'
// import UserInfo from './UserInfo';

export default function AppHeader(props) {

    const [expanded, setExpanded] = useState(false);


    return <>
        <header className='w-full p-2 bg-contentBg flex flex-row'>
        
        <a href='/' className='flex flex-row no-underline'> 
            <img className="h-8 w-9 rounded-full my-auto mx-2 border-2 border-gray-800" src={bsdev}/>
            <div className="my-auto ml-0 mr-5 no-underline">bransonsmith.dev</div>
        </a>
       
        <nav>
          {props.pages.map(page => 
            <a href={page.target} className='my-auto mx-5 text-sm no-underline hover:text-accent-200' key={page.label}>{page.label}</a>
          )}
          { props.morePages.length > 0 &&
            <div className="mt-0 mx-5 text-sm no-underline cursor-pointer py-2" onClick={() => setExpanded(!expanded)}>
            { !expanded 
            ? <div className="my-auto mx-5 text-sm no-underline font-bold text-defaultText pt-0">
                 More 
            </div> 
            : <div className="w-48 flex flex-col mt-0 py-2 z-10 absolute top-[0px] bg-defaultBgz-[1000210] bg-defaultBg border-2 rounded rounded-r-none border-gray-800"> 
                  <div className="ml-auto mr-0 px-5 pl-10 py-0 text-lg font-bold">X</div>
                  {props.morePages.map(page => {
                    return <a href={page.target} className='my-auto mx-5 text-sm no-underline py-1 hover:text-accent-200' key={page.label}>{page.label}</a>
                  })}
            </div>
            }
          </div>
          }
          {/* <div className="absolute right-2 top-5"><UserInfo /></div> */}
        </nav>

      </header>
    </>
}