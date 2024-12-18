import { useState } from 'react';
import { makeRequestToApi } from '../../../Services/ApiService';
import Loading from '../../Loading';
import PopUpWindow from '../PopUpWindow';

export default function TagAdder(props) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addTag = async () => {
        setLoading(true);
        try {
            const body = {
                name: name,
                description: description,
                Places: [],
                Transactions: []
            }
            const response = await makeRequestToApi('api/Tag', 'POST', body);
            if (response.status === 200) {
                setLoading(false);
                setError(null);
                setName('');
                setDescription('');
                await props.RefreshEntities();
            } else {
                console.error('Error creating Tag: ', response);
                setLoading(false);
                setError('Error creating Tag: ' + response.data.detail);
            }
        } catch (error) {
            console.error('Exception creating Tag: ', error);
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
                    <div className="mt-8 flex flex-row">
                        <button className="m-auto" onClick={addTag}>Add Payment Method</button>
                        <button className="m-auto" onClick={props.Hide}>Hide</button>
                    </div>
                </>
            }
        </div>
    )

}
