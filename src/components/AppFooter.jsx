
export default function AppFooter(props) {

    return <>
      <div className="w-full p-5 pt-10 text-xs mt-5 border-t-2 border-gray-800 bg-contentBg">
        <div className='m-auto max-w-screen-md'>
          <div>&copy; 2024 Branson Smith Dev Portfolio and Projects</div>
          <div className='flex flex-row mr-auto'>
            <div className='flex flex-col mr-auto'>
              {props.pages.map(page => <a href={page.target} key={page.label}>{page.label}</a>)}
            </div>
          </div>
        </div>
      </div>
    </>
}