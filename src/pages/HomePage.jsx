import bsdevlogo from '../assets/BS_Dev_logo.png'
import bsdevhero from '../assets/BS_DEV_hero-transparent.png'

export default function HomePage() {

    return <div className="px-[min(40px,5vw)]">
        
        <div className="flex flex-row w-full my-5 mb-10 flex-wrap">
            <div className='flex flex-col mr-auto'>
                <h1 className="m-auto ml-0 mb-0 text-5xl">Branson Smith</h1>
                <h2 className="m-auto ml-0 p-0 pl-[2px]">Software and Cloud Engineer</h2>
            </div>
            <img src={bsdevlogo} alt='logo' className='m-auto my-5 w-[120px] h-[120px] rounded-full border-2 border-gray-800'/>
        </div>

        <p className="text-justify text-md p-0">
            I specialize in <b className="text-accent-300">Web and Cloud Technologies.</b> I have years of development experience on the full web stack, devops, cloud infrastructure, and working with users/clients.
        </p>
        <p className="text-justify text-md p-0">
            <b>Key skills:</b> AWS (Certified Solutions Architect: Associate 2023), .NET, React, SQL, Azure DevOps, Containers, Docker, C#, Python, MS SQL Server, PostgreSQL, DynamoDB, JavaScript, HTML, CSS, Cloud, Terraform, Serverless, REST APIs.
        </p>

        <div className="flex flex-row w-full flex-wrap">
            <a href="/resume" className="py-3 px-4 mt-10 mx-auto rounded border-2 border-gray-800 w-fit h-fit">See my Resume</a>
            <a href="/contact" className="py-3 px-4 mt-10 mx-auto rounded border-2 text-defaultText border-gray-800 w-fit h-fit">Contact Me</a>
            <img src={bsdevhero} className='w-[75%] my-10 mx-auto opacity-40'/>
        </div>
    </div>
}