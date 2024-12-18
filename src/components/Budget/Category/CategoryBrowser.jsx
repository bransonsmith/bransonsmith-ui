import { useEffect, useState } from 'react';
import { makeRequestToApi } from '../../../Services/ApiService';
import Loading from '../../Loading';
import CategoryEntry from './CategoryEntry';
import CategoryAdder from './CategoryAdder';

export default function CategoryBrowser(props) {

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
                    { showAddForm ? <CategoryAdder RefreshEntities={RefreshEntities} Hide={HideAdder}/> : <button onClick={() => setShowAddForm(true)}>Add Category</button> }
                </div>
                { props.categories &&
                    <div className="w-full">
                        <h2>Categories</h2>
                        <ul>
                            { props.categories.map((category, index) => {
                                return (
                                    <li key={index} className="p-4 border-2 border-white w-full">
                                        <CategoryEntry category={category} RefreshEntities={RefreshEntities}/>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                }
                <button onClick={() => setShow(false)} className="my-12"> Hide Categories </button>
            </div>
        }
        { !show && <button onClick={() => setShow(true)} className="my-12"> Show Categories </button> }

        </>
    )
}
