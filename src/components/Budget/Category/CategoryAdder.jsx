import { useState } from 'react';
import { makeRequestToApi } from '../../../Services/ApiService';
import Loading from '../../Loading';
import PopUpWindow from '../PopUpWindow';
import MatchInput from '../MatchInput';

export default function CategoryAdder(props) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addCategory = async () => {
        setLoading(true);
        try {
            const body = {
                name: name,
                description: description,
                matches: matches,
                Places: [],
                Transactions: []
            }
            const response = await makeRequestToApi('api/Category', 'POST', body);
            if (response.status === 200) {
                setLoading(false);
                setError(null);
                setName('');
                setDescription('');
                await props.RefreshEntities();
            } else {
                console.error('Error creating category: ', response);
                setLoading(false);
                setError('Error creating category: ' + response.data.detail);
            }
        } catch (error) {
            console.error('Exception creating category: ', error);
            setLoading(false);
            setError(error);
        }
    }

    return (
        <div className="shadow-sm shadow-black p-8">
            { loading && <Loading /> }
            { error &&
                <PopUpWindow
                    error={error}
                    onClose={() => setError(null)}
                />
            }
            { !loading && <>
                    <div className='w-full flex flex-row h-10'>
                        <label className='w-1/4 h-5/6 my-auto mx-0'>Name</label>
                        <input className='w-3/4 h-5/6' 
                            type="text" 
                            id="name"
                            value={name} 
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className='w-full flex flex-row h-10'>
                        <label className='w-1/4 h-5/6 my-auto mx-0'>Description</label>
                        <input className='w-3/4 h-5/6' 
                            type="text" 
                            id="description" 
                            value={description} 
                            onChange={(event) => setDescription(event.target.value)} 
                        />
                    </div>
                    <MatchInput matches={matches} setMatches={setMatches} showLabel={true}/>
                    <div className="mt-8 flex flex-row">
                        <button className="m-auto" onClick={addCategory}>Add Category</button>
                        <button className="m-auto" onClick={props.Hide}>Hide</button>
                    </div>
                </>
            }
        </div>
    )

}
