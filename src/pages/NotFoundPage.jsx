
import searchLizard from '../Assets/wondering-lizard-transparent.png'

export default function NotFoundPage() {
    return  <>
        <h1>Page Not Found</h1>
        <h3> Uh oh, No page was found for the given url! Check for typos. </h3>
        
        <img className="h-[60vw] max-h-[300px]  rounded my-auto mx-auto " src={searchLizard}/>

        <a href="/" className="text-accent">Home Page</a>
    </>
}