import { useEffect, useState } from 'react';
import { makeRequestToApi } from '../../../Services/ApiService';
import Loading from '../../Loading';
import PlaceEntry from './PlaceEntry';
import PlaceAdder from './PlaceAdder';

export default function PlaceBrowser(props) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const RefreshEntities = async () => {
        setLoading(true);
        await props.RefreshEntities();
        setLoading(false);
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
                <div className="mt-8">
                    { showAddForm ? <PlaceAdder RefreshEntities={RefreshEntities} Hide={HideAdder} categories={props.categories}/> : <button onClick={() => setShowAddForm(true)}>Add Place</button> }
                </div>
                { props.places &&
                    <div className="w-full">
                        <h2>Places</h2>
                        <ul>
                            { props.places.map((Place, index) => {
                                return (
                                    <li key={index} className="p-4 border-2 border-white w-full">
                                        <PlaceEntry Place={Place} RefreshEntities={RefreshEntities} categories={props.categories}/>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                }
                <button onClick={() => setShow(false)} className="my-12"> Hide Places </button>
            </div>
        }
        { !show && <button onClick={() => setShow(true)} className="my-12"> Show Places </button> }

        </>
    )
}
