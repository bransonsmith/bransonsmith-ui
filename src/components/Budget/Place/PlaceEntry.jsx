import { useState } from 'react';
import DeleteEntryButton from '../DeleteEntryButton';
import { makeRequestToApi } from '../../../Services/ApiService';
import PopUpWindow from '../PopUpWindow';
import EditIcon from '../../../icons/EditIcon';
import SaveIcon from '../../../icons/SaveIcon';
import MatchInput from '../MatchInput';

export default function PlaceEntry(props) {

    const [Place, setPlace] = useState(props.Place);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState(null);

    const getCategoryName = (categoryId) => {
        const category = props.categories.find((category) => category.id === categoryId);
        return category ? category.name : '';
    }

    const UpdatePlace = async (Place) => {
        console.log('Updating Place: ', Place);
        const response = await makeRequestToApi('api/Place/' + Place.id, 'PUT', Place);
        if (response.status === 200) {
            setPlace(response.data);
            setEdit(false);
            await props.RefreshEntities();
        } else {
            console.error('Error updating Place: ', response);
            setError('Error updating Place: ' + response.data.detail);
        }
    }

    const setMatches = (matches) => {
        setPlace({ ...Place, matches: matches });
    }

    return (
        <div className="flex flex-row w-full">

            {error && <PopUpWindow
                error={error}
                onClose={() => setError(null)} />
            }

            <div className="w-1/4">
            { edit 
                ? <input className='w-full' type="text" id="name" onChange={(event) => setPlace( 
                    { ...Place, name: event.target.value })} value={Place.name} />
                : <div className="">{Place.name}</div>
            }
            </div>
            <div className="w-1/2">
            { edit 
                ? <input className='w-full' type="text" id="name" onChange={(event) => setPlace( 
                    { ...Place, description: event.target.value })} value={Place.description} />
                : <div className="">{Place.description}</div>
            }
            </div>
            <div className="w-1/2">
            {edit
                ? <select className='w-full' id="category" onChange={(event) => setPlace(
                    { ...Place, categoryId: event.target.value })} value={Place.categoryId}>
                    <option value=''>Select Category</option>
                    {props.categories.map((category, index) => {
                        return <option key={index} value={category.id}>{category.name}</option>
                    })}
                </select>
                : <div className="">{getCategoryName(Place.categoryId)}</div>
            }
            </div>
            <div className="w-1/4">
                { edit
                    ? <MatchInput matches={Place.matches} setMatches={setMatches} />
                    : <div className=""> {Place.matches.join(', ')}</div>
                }
            </div>
            <div className="ml-auto flex flex-row">
                { edit
                    ? <button className="ml-auto" onClick={() => {UpdatePlace(Place); }}>Save</button>
                    : <span onClick={() => setEdit(true)} className=" hover:text-white cursor-pointer">
                        <EditIcon className="m-auto cursor-pointer" width="26" height="26" />
                    </span>
                }
                <DeleteEntryButton entryType='Place' entryId={Place.id} entryName={Place.name} RefreshEntities={props.RefreshEntities} />
            </div>

        </div>
    )
}
