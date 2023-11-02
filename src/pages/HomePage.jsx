import bsdevlogo from '../assets/BS_Dev_logo.png'
import bsdevhero from '../assets/BS_DEV_hero-transparent.png'

export default function HomePage() {

    return <>
        
        <div className="flex flex-row w-full my-5 mb-10">
            <img src={bsdevlogo} alt='logo' className='m-auto mr-5 w-[120px] h-[120px] rounded-full border-2 border-gray-800'/>
            <div className='flex flex-col m-8'>
                <h1 className="m-auto ml-0 mb-0">Branson Smith</h1>
                <h2 className="m-auto">Full Stack Software and Cloud Engineer</h2>
            </div>
        </div>

        <p>
            I have over 5 years of professional development experience, and have been programming for over a decade. 
        </p>
        <p>
            I have mostly worked on Web Technologies hosted in AWS, and am a certified AWS Solutions Architect (Associate). I love solving problems and have put a variety of technologies in my toolbelt to help me do just that.
        </p>
        <p> 
            AWS, Cloud, Serverless, C#, .Net, Python, REST APIs, Django, Azure Dev Ops Pipelines, RabbitMQ, Terraform, SQL, Microsoft SQL Server, PostgreSql, DynamoDb, Javascript, React, HTML, CSS
        </p>

        <a href="/resume" className="py-2 px-4 mt-10">Resume</a>

        <img src={bsdevhero} className='h-[200px] my-10 mx-auto opacity-40'/>
    </>
}