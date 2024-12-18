import { useState } from 'react';
import { makeRequestToApi } from '../../../Services/ApiService';
import Loading from '../../Loading';
import PopUpWindow from '../PopUpWindow';
import MatchInput from '../MatchInput';

export default function PlaceAdder(props) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [matches, setMatches] = useState([]);

    const addPlace = async () => {
        setLoading(true);
        try {
            const body = {
                name: name,
                description: description,
                categoryId: categoryId,
                matches: matches,
                Transactions: []
            }
            const response = await makeRequestToApi('api/Place', 'POST', body);
            if (response.status === 200) {
                setLoading(false);
                setError(null);
                setName('');
                setDescription('');
                await props.RefreshEntities();
            } else {
                console.error('Error creating Place: ', response);
                setLoading(false);
                setError('Error creating Place: ' + response.data.detail);
            }
        } catch (error) {
            console.error('Exception creating Place: ', error);
            setLoading(false);
            setError(error.toString());
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
                    <div className='w-full flex flex-row h-10'>
                    <select className='w-full' id="category" onChange={(event) => setCategoryId(event.target.value)} value={categoryId}>
                        <option value=''>Select Category</option>
                        {props.categories.map((category, index) => {
                            return <option key={index} value={category.id}>{category.name}</option>
                        })}
                    </select>
                    </div>
                    <MatchInput matches={matches} setMatches={setMatches} />
                    <div className="mt-8 flex flex-row">
                        <button className="m-auto" onClick={addPlace}>Add Place</button>
                        <button className="m-auto" onClick={props.Hide}>Hide</button>
                    </div>
                </>
            }
        </div>
    )

}
