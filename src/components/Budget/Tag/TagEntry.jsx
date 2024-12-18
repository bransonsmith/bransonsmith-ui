import { useState } from 'react';
import DeleteEntryButton from '../DeleteEntryButton';
import { makeRequestToApi } from '../../../Services/ApiService';
import PopUpWindow from '../PopUpWindow';
import EditIcon from '../../../icons/EditIcon';
import SaveIcon from '../../../icons/SaveIcon';

export default function TagEntry(props) {

    const [Tag, setTag] = useState(props.Tag);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState(null);

    const UpdateTag = async (Tag) => {
        const response = await makeRequestToApi('api/Tag/' + Tag.id, 'PUT', Tag);
        if (response.status === 200) {
            setTag(response.data);
            setEdit(false);
            await props.RefreshEntities();
        } else {
            console.error('Error updating Tag: ', response);
            setError('Error updating Tag: ' + response.data.detail);
        }
    }

    return (
        <div className="flex flex-row w-full">

            {error && <PopUpWindow
                error={error}
                onClose={() => setError(null)} />
            }

            <div className="w-1/4">
            { edit 
                ? <input className='w-full' type="text" id="name" onChange={(event) => setTag( 
                    { ...Tag, name: event.target.value })} value={Tag.name} />
                : <div className="">{Tag.name}</div>
            }
            </div>
            <div className="w-1/2">
            { edit 
                ? <input className='w-full' type="text" id="name" onChange={(event) => setTag( 
                    { ...Tag, description: event.target.value })} value={Tag.description} />
                : <div className="">{Tag.description}</div>
            }
            </div>
            <div className="ml-auto flex flex-row">
                { edit
                    ? <button className="ml-auto" onClick={() => {UpdateTag(Tag); }}>Save</button>
                    : <span onClick={() => setEdit(true)} className=" hover:text-white cursor-pointer">
                        <EditIcon className="m-auto cursor-pointer" width="26" height="26" />
                    </span>
                }
                <DeleteEntryButton entryType='Tag' entryId={Tag.id} entryName={Tag.name} RefreshEntities={props.RefreshEntities} />
            </div>

        </div>
    )
}
