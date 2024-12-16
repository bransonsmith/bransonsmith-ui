
import techbloghero from '../assets/techbloghero.png'

export default function PodcastPage() {

    return <div>

        <h1>Learn to Code Interviews Podcast</h1>

        <div>
            This podcast is a side project where I interview software engineers who are smarter than I am.
    <br/>
            I ask questions hoping to glean wisdom and knowledge from great developers.
        </div>

        <div className='flex flex-row w-full my-20'>
            <h4>Check it out <a href="https://open.spotify.com/show/3omkLx336g1VUCvEH0X7js">here on spotify</a></h4>
            <img src={techbloghero} className='w-[50%] mx-auto opacity-60 rounded-lg'/>
        </div>
    </div>
}

