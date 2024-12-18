import { useEffect, useState } from 'react';
import { makeRequestToApi } from '../../../Services/ApiService';
import Loading from '../../Loading';
import TagEntry from './TagEntry';
import TagAdder from './TagAdder';

export default function TagBrowser() {

    const [Tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const getTags = async () => {
            try {
                const response = await makeRequestToApi('api/Tag', 'GET', null);
                if (response.status === 200) {
                    setTags(response.data);
                    setLoading(false);
                    setError(null);
                } else {
                    console.error('Error getting Tags: ', response);
                    setTags([]);
                    setLoading(false);
                    setError(response);
                }
            } catch (error) {
                console.error('Exception getting Tags: ', error);
                setTags([]);
                setLoading(false);
                setError(error);
            }
        }
        getTags()
    }, []);

    const RefreshEntities = async () => {
        const getTags = async () => {
            try {
                const response = await makeRequestToApi('api/Tag', 'GET', null);
                if (response.status === 200) {
                    setTags(response.data);
                    setLoading(false);
                    setError(null);
                } else {
                    console.error('Error getting Tags: ', response);
                    setTags([]);
                    setLoading(false);
                    setError(response);
                }
            } catch (error) {
                console.error('Exception getting Tags: ', error);
                setTags([]);
                setLoading(false);
                setError(error);
            }
        }
        getTags();
    }

    const HideAdder = () => {
        setShowAddForm(false);
    }

    return (
        <>
        { show && 
            <div className='p-10 shadow-md shadow-black w-full'>
                { loading && <Loading /> }
                { error && <div className="text-error-800">Error: {error}</div> }
                { Tags &&
                    <div className="w-full">
                        <h2>Tags</h2>
                        <ul>
                            { Tags.map((Tag, index) => {
                                return (
                                    <li key={index} className="p-4 border-2 border-white w-full">
                                        <TagEntry Tag={Tag} RefreshEntities={RefreshEntities}/>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="mt-8">
                            { showAddForm ? <TagAdder RefreshEntities={RefreshEntities} Hide={HideAdder}/> : <button onClick={() => setShowAddForm(true)}>Add Tag</button> }
                        </div>
                    </div>
                }
                <button onClick={() => setShow(false)} className="my-12"> Hide Tags </button>
            </div>
        }
        { !show && <button onClick={() => setShow(true)} className="my-12"> Show Tags </button> }

        </>
    )
}
