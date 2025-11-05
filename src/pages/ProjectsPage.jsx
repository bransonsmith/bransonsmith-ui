

export default function ProjectsPage() {

    const projects = [
        {
            name: 'RL Predict',
            link: 'https://rlpredict.com/',
            content: <div className="p-0 mr-auto my-0 w-80">
                        <p className='text-defaultText font-normal text-sm p-0 m-0 mt-0'>
                            Global site for predicting Rocket League esports match outcomes, and collecting community Player and Team Power Rankings. Built with React + DynamoDb + Lambda, integrated with AWS Cognito.
                        </p>
                        <button className="my-5 mx-auto border-2 border-gray-700 bg-contentBg hover:shadow-black hover:shadow-md hover:border-black">RL Predict</button>
                    </div>,
            image: <div className="rl-predict-box h-52 w-80 mb-auto shadow-md shadow-black"/>
        },
        {
            name: 'Poker Pilot',
            link: 'https://pokerpilot.net/',
            content: <div className="p-0 mr-auto my-0 w-80">
                        <p className='text-defaultText font-normal text-sm p-0 m-0 mt-0'>
                            Tool to organize and run a poker tournament. React + .NET Web API + DynamoDb + Lambda, integrated with Auth0 and Stripe.
                        </p>
                        <button className="my-5 mx-auto border-2 border-gray-700 bg-contentBg hover:shadow-black hover:shadow-md hover:border-black">Poker Pilot</button>
                    </div>,
            image: <div className="poker-pilot-box h-52 w-80 mb-auto shadow-md shadow-black"/>
        },
        { name: 'Church Lunch', 
            link: 'https://master.d2nn0kevvgeq5s.amplifyapp.com/',
            content: <div className="p-0 mr-auto my-0 w-80">
                        <p className='text-defaultText font-normal text-sm p-0 m-0 mt-0'>
                            This serverless app pairs up church members to meet up and grab lunch together on Sundays.
                        </p>
                    
                        <p className='text-defaultText font-normal text-sm p-0 m-0 my-5'>
                            By taking advantage of <b>DynamoDb</b>, <b>Lambda</b>, and <b>Aws Amplify</b>, this entire application is always live, but only costs less than 1 penny a month (which predominately goes to Twilio/Sms Costs), and is prepared to scale on demand.
                        </p>
                        <button className="my-5 mx-auto border-2 border-gray-700 bg-contentBg hover:shadow-black hover:shadow-md hover:border-black">Check out Church Lunch</button>
                    </div>,
            image: <div className="church-lunch-box h-52 w-80 mb-auto shadow-md shadow-black"/>
        },
        { name: 'Smoke', 
            link: 'https://master.d2tddv8x1fnka4.amplifyapp.com/',
            content: <div className="p-0 mr-auto my-0 w-80">
                        <p className='text-defaultText font-normal text-sm p-0 m-0 mt-0'>
                            This subscription web app provides stock analysis to users. It's a react app in front of Django (Python) + PostgreSQL, utilizing Stripe subscriptions. This link is to a dev-preview version, while the owning-company awaits launch.
                        </p>
                        <button className="my-5 mx-auto border-2 border-gray-700 bg-contentBg hover:shadow-black hover:shadow-md hover:border-black">Check out Smoke Preview</button>
                    </div>,
            image: <div className="smoke-box h-52 w-80 mb-auto shadow-md shadow-black"/>
        }
        // { name: 'Fantasy Baseball Luck Analysis', 
        //     content: <div className="p-0 mr-auto my-0 w-80">
        //                 <p className='text-defaultText font-normal text-sm p-0 m-0 mt-0'>
        //                     Basic page to scrape and analyze my fantasy baseball league each day, to see how lucky people are getting with their weekly matchups.
        //                 </p>
        //                 <button className="my-5 mx-auto border-2 border-gray-700 bg-contentBg hover:shadow-black hover:shadow-md hover:border-black">Check out Fantasy Baseball</button>
        //             </div>,
        //     image: <div className="baseball-box h-52 w-80 mb-auto shadow-md shadow-black"/>
        // }
    ]

    return <div className="flex flex-col w-full"> 
        <h1>Projects Outside of Work</h1>

        { projects.map(project => {
            return <a key={project.name} rel='external' target='_blank' href={project.link} className=" w-full cursor-pointer flex flex-col mb-5 p-0 mt-0">
                <h2 className='text-accent-300 underline text-md'>{ project.name }</h2>
                <div className="w-full cursor-pointer flex flex-row flex-wrap-reverse mb-5 p-0 mt-0">
                    { project.content }
                    { project.image }
                </div> 
            </a>
        })}

        
        

        
    </div>
}
