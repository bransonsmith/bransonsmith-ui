import bsdevlogo from '../assets/BS_Dev_logo.png'
import bsdevhero from '../assets/BS_DEV_hero-transparent.png'
import { Helmet } from 'react-helmet'

export default function HomePage() {

    // Condensed, grouped high‑signal skill set
    const skills = [
        '.NET / C#',
        'React + TypeScript',
        'SQL (PostgreSQL / MSSQL)',
        'AWS (SAA 2023)',
        'Python',
        'Serverless & Event‑Driven',
        'Terraform (IaC)',
        'Docker / Containers',
        'CI/CD (Azure DevOps & GitHub)'
    ];

    return <div className="px-[min(40px,5vw)]">
        <Helmet>
            <title>Branson Smith | Software & Cloud Engineer</title>
            <meta name="description" content="Software & Cloud Engineer specializing in AWS, React, .NET, serverless, Terraform, CI/CD. Building scalable, secure web and cloud solutions." />
            <meta name="keywords" content="Branson Smith, Software Engineer, Cloud Engineer, AWS, React, .NET, Terraform, Serverless, DevOps, Portfolio" />
            <meta name="author" content="Branson Smith" />
            <link rel="canonical" href="https://www.bransonsmith.dev/" />
            {/* Open Graph */}
            <meta property="og:title" content="Branson Smith | Software & Cloud Engineer" />
            <meta property="og:description" content="Shipping resilient web & serverless solutions end‑to‑end on AWS, React, .NET, Terraform, CI/CD." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.bransonsmith.dev/" />
            <meta property="og:image" content="https://www.bransonsmith.dev/BS_DEV_hero-transparent.png" />
            <meta property="og:image:alt" content="Branson Smith developer hero graphic" />
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Branson Smith | Software & Cloud Engineer" />
            <meta name="twitter:description" content="AWS, React, .NET, Serverless, Terraform, CI/CD." />
            <meta name="twitter:image" content="https://www.bransonsmith.dev/BS_DEV_hero-transparent.png" />
        </Helmet>
        
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
        <div className="mt-4">
            <div className="flex flex-wrap gap-2" aria-label="key skills">
                {skills.map(s => <span key={s} className="text-xs px-2 py-1 rounded-full border border-gray-400/40 bg-gray-200/40 dark:bg-gray-700/40 backdrop-blur-sm">{s}</span>)}
            </div>
        </div>

        <div className="flex flex-row w-full flex-wrap">
            <a href="/resume" className="py-3 px-4 mt-10 mx-auto rounded border-2 border-gray-800 w-fit h-fit">See my Resume</a>
            <a href="/contact" className="py-3 px-4 mt-10 mx-auto rounded border-2 text-defaultText border-gray-800 w-fit h-fit">Contact Me</a>
            <img src={bsdevhero} className='w-[75%] my-10 mx-auto opacity-40'/>
        </div>
    </div>
}