import { useState } from 'react';
import DeleteEntryButton from '../DeleteEntryButton';
import { makeRequestToApi } from '../../../Services/ApiService';
import PopUpWindow from '../PopUpWindow';
import EditIcon from '../../../icons/EditIcon';
import MatchInput from '../MatchInput';

export default function EntityEntry(props) {

    const [entity, setEntity] = useState(props.entity);
    const [entityType, setEntityType] = useState(props.entityType);
    const [edit, setEdit] = useState(false);
    const [hasMatches, setHasMatches] = useState(props.hasMatches);
    const [error, setError] = useState(null);

    const UpdateEntity = async (entity) => {
        const response = await makeRequestToApi(`api/${entityType}/${entity.id}`, 'PUT', entity);
        if (response.status === 200) {
            setEntity(response.data);
            setEdit(false);
            await props.RefreshEntities();
        } else {
            console.error(`Error updating ${entityType}: `, response);
            setError(`Error updating ${entityType}: ` + response.data.detail);
        }
    }

    const setMatches = (matches) => {
        setEntity({ ...entity, matches: matches });
    }

    const CancelEdit = () => {
        setEntity(props.entity);
        setEdit(false);
    }

    return (
        <div className="flex flex-row w-full flex-wrap">

            {error && <PopUpWindow
                error={error}
                onClose={() => setError(null)} />
            }

            <div className="w-1/4 m-auto">
            { edit 
                ? <input className='w-full' type="text" id="name" onChange={(event) => setEntity( 
                    { ...category, name: event.target.value })} value={category.name} />
                : <div className="">{category.name}</div>
            }
            </div>
            <div className="w-1/2 m-auto    ">
            { edit 
                ? <input className='w-full' type="text" id="name" onChange={(event) => setEntity( 
                    { ...category, description: event.target.value })} value={category.description} />
                : <div className="">{category.description}</div>
            }
            </div>

            { edit
            ? <div className="w-full"><MatchInput matches={category.matches} setMatches={setMatches} updateView={true}/> </div>
            : <div className="w-1/4">
                <div className=""> {category.matches.join(', ')}</div>
              </div>
            }
            <div className="ml-auto flex flex-row">
                { edit
                    ? <>
                        <button className="ml-auto h-fit" onClick={() => {UpdateCategory(category); }}>Save</button>
                        <button className="ml-auto h-fit" onClick={CancelEdit}>Cancel</button>
                    
                    </>
                    : <span onClick={() => setEdit(true)} className=" hover:text-white cursor-pointer">
                        <EditIcon className="m-auto cursor-pointer" width="26" height="26" />
                    </span>
                }
                <DeleteEntryButton entryType='Category' entryId={category.id} entryName={category.name} RefreshEntities={props.RefreshEntities} />
            </div>
        </div>
    )
}
