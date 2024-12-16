import saaBadge from '../assets/Badge-Credly-SAA.png';

export default function ResumePage(props) {

    return <>
        
            <div className="flex flex-row w-full"> 
                <div className='flex flex-col'>
                    <h1 className='mr-auto my-3'>Branson Smith</h1>
                    <h3 className="mr-auto">Software and Cloud Engineer - Texas, USA</h3>
                    <a href = "mailto:bransonsmith22@gmail.com" className="mr-auto">
                        <h5 className="mr-auto"> bransonsmith22@gmail.com</h5>
                    </a>
                    
                </div>
                <a rel='external' target='_blank' className='m-auto mr-5' href="https://www.credly.com/badges/31fdb7e4-1c49-4513-81c3-49bb29222ee7/public_url">
                    <img src={saaBadge} alt="" className='max-w-[100px] h-[100px] w-[100px]'/>
                </a>
            </div>

            <h2 >Work Experience</h2>
            <h3>
                <a rel='external' target='_blank' href="https://wearedoubleline.com/" >Software Engineer - Double Line, Inc.</a>
                
            </h3>
            <div>April 2023–Present</div>

            <li>
                Implement full stack web applications for State Education agencies using .Net and React.
            </li>
            <li>
                Design and deploy infrastructure to AWS, Azure Dev Ops, and Google Cloud environments.
            </li>

            <h3>
                <a rel='external' target='_blank' href="https://www.spglobal.com/en/" >Software Engineer - S&P Global</a>
                
            </h3>
            <div>June 2018–April 2023</div>

            <li>
                Modernized existing .Net features by rewriting business logic formerly in a VB and C# monolith into separate .Net Core C# containers running in AWS Fargate.
            </li>

            <li>
                Decoupled large SQL Transactions into asynchronous microservice (C#, AWS Fargate, AWS Lambda, SQLServer, Amazon MQ + RabbitMQ, Terraform, Docker).
            </li>

            <li>
                Designed and created CI/CD deployment and automated test pipelines including work with Terraform, Python + Lambda, Specflow, XUnit, Docker, and Azure Dev Ops Pipelines to build and test environments in an automated fashion.
            </li>

            <li>Extended REST APIs for existing C# monolith</li>

            <li>
                Designed and created Serverless Lambda Application from the ground up which fully automated business bottleneck by processing emails with (Python + Pandas) and hitting internal APIs. 
            </li>

            <h3 className="text-accent-300">
                Full Stack Web Developer Contractor 
            </h3>
            <div>June 2021-October 2021</div>

            <li>
                Created a subscription website for a start up company. Documented their needs and delivered a Dockerized application which includes:  React Frontend, Django (python) API, and Postgresql Database. 
            </li>

            <h2>Education, Certifications, Awards</h2>
            
            <li>
                AWS Cloud Architect Associate (2023)
            </li>
            <li>
                AWS Cloud Practitioner Certification (2021)
            </li>  
            <li>
                Essential Excellence Team Award Honorable Mention (2022) Internal company award for driving excellence that adheres to S&P Global company strategy
            </li>
            <li>
                B.A. in Computer Science from Baylor University
            </li>

    </>
}
