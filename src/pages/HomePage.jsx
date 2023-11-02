import bsdevlogo from '../assets/BS_Dev_logo.png'
import bsdevhero from '../assets/BS_DEV_hero-transparent.png'

export default function HomePage() {

    return <>
        
        <div className="flex flex-row w-full my-5 mb-10 flex-wrap">
            <img src={bsdevlogo} alt='logo' className='m-auto my-5 w-[120px] h-[120px] rounded-full border-2 border-gray-800'/>
            <div className='flex flex-col m-auto'>
                <h1 className="m-auto ml-0 mb-0">Branson Smith</h1>
                <h2 className="m-auto">Full Stack Software and Cloud Engineer</h2>
            </div>
        </div>

        <p className="text-justify text-sm">
            I specialize in <b className="text-accent-300">Web and Cloud Technologies.</b> With over a decade of development experience, and being a certified AWS Solutions Architect, I can leverage my diverse skill set to build and improve all aspects of applications.
        </p>
        <p className="text-justify text-sm">
            <b>Key skills:</b> AWS, Cloud, Serverless, C#, .NET, Python, REST APIs, Django, Azure DevOps, RabbitMQ, Terraform, SQL, MS SQL Server, PostgreSQL, DynamoDB, JavaScript, React, HTML, CSS, Google Cloud, GraphQL and more.
        </p>

        <div className="flex flex-row w-full flex-wrap">
            <a href="/resume" className="py-3 px-4 mt-10 mx-auto rounded border-2 border-gray-800 w-fit h-fit">See my Resume</a>
            <a href="/contact" className="py-3 px-4 mt-10 mx-auto rounded border-2 text-defaultText border-gray-800 w-fit h-fit">Contact Me</a>
            <img src={bsdevhero} className='w-[75%] my-10 mx-auto opacity-40'/>
        </div>
    </>
}