import {useEffect, useState} from 'react'
import Loading from '../components/Loading'
import PopUpWindow from '../components/Budget/PopUpWindow';

export default function FantasyBaseball({ }) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    return <div className="flex flex-col w-full min-h-32">
        <h1>Fantasy Baseball</h1>

        { error &&
            <PopUpWindow
                error={error}
                onClose={() => setError(null)}
            />
        }

        { loading 
        ? <div className="flex flex-col w-full mx-auto my-10"> 
            <div className="flex w-fit mr-auto"> 
                <Loading />
            </div> 
        </div>
        : <div className="flex flex-wol w-full">
            <p>Content</p>
        
        </div>
        }
        
        
        <button onClick={() => {setLoading(!loading)}}>Toggle Loading</button>    
        <button onClick={() => {setError('An error occurred!')}}>Set Error</button>
        
    </div>
} 