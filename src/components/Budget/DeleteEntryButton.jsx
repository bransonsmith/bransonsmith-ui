import { useState } from 'react';
import { makeRequestToApi } from '../../Services/ApiService';
import Loading from '../Loading';
import TrashIcon from '../../icons/TrashIcon';
import PopUpWindow from './PopUpWindow';

export default function DeleteEntryButton(props) {

    const [entryType, setEntryType] = useState(props.entryType);
    const [entryId, setEntryId] = useState(props.entryId);
    const [entryName, setEntryName] = useState(props.entryName);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const deleteEntry = async () => {

        const response = await makeRequestToApi(`api/${entryType}/${entryId}`, 'DELETE', null);
        if (response.status === 200) {
            setShowConfirm(false);
            await props.RefreshEntities();
        } else {
            console.error('Error deleting entry: ', response);
        }
    }

    return (
        <div>
            { loading && <Loading /> }
            {!loading && <div>
                {showConfirm 
                ? <PopUpWindow
                    onClose={() => setShowConfirm(false)}
                    message={``}
                >
                    <div className="flex flex-row flex-wrap">Are you sure you want to delete 
                        <div>{entryType} : <span className="font-bold">'{entryName}'</span></div>
                    ?
                    </div>
                    <div className="flex flex-row w-full mt-4">
                        <button className="m-auto" onClick={deleteEntry}>Yes, Delete</button>
                        <button className="m-auto" onClick={() => setShowConfirm(false)}>Cancel</button>
                    </div>
                </PopUpWindow>
                : <span onClick={() => setShowConfirm(true)} className="text-error-800 hover:text-error-200 cursor-pointer">
                    <TrashIcon width="26" height="26"/>
                </span>
                }
            </div>
            }
        </div>
    )

}