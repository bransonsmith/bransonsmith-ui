import bsdev from '../assets/BS_Dev_logo.png'

export default function AppHeader(props) {

    return <>
        <header className='w-full p-2 bg-contentBg flex flex-row'>
        
        <a href='/' className='flex flex-row no-underline'> 
            <img className="h-8 w-9 rounded-full my-auto mx-2 border-2 border-gray-800" src={bsdev}/>
            <div className="my-auto ml-0 mr-5 no-underline">bransonsmith.dev</div>
        </a>
       
        <nav>
          {props.pages.map(page => 
            <a href={page.target} className='my-auto mx-5 text-sm no-underline' key={page.label}>{page.label}</a>
          )}
        </nav>

      </header>
    </>
}