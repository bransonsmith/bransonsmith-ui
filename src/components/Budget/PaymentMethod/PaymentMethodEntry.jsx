import { useState } from 'react';
import DeleteEntryButton from '../DeleteEntryButton';
import { makeRequestToApi } from '../../../Services/ApiService';
import PopUpWindow from '../PopUpWindow';
import EditIcon from '../../../icons/EditIcon';
import SaveIcon from '../../../icons/SaveIcon';
import MatchInput from '../MatchInput';

export default function PaymentMethodEntry(props) {

    const [PaymentMethod, setPaymentMethod] = useState(props.PaymentMethod);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState(null);

    const UpdatePaymentMethod = async (PaymentMethod) => {
        const response = await makeRequestToApi('api/PaymentMethod/' + PaymentMethod.id, 'PUT', PaymentMethod);
        if (response.status === 200) {
            setPaymentMethod(response.data);
            setEdit(false);
            await props.RefreshEntities();
        } else {
            console.error('Error updating PaymentMethod: ', response);
            setError('Error updating PaymentMethod: ' + response.data.detail);
        }
    }

    const setMatches = (matches) => {
        setPaymentMethod({ ...PaymentMethod, matches: matches });
    }

    const CancelEdit = () => {
        setPaymentMethod(props.PaymentMethod);
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
                ? <input className='w-full' type="text" id="name" onChange={(event) => setPaymentMethod( 
                    { ...PaymentMethod, name: event.target.value })} value={PaymentMethod.name} />
                : <div className="">{PaymentMethod.name}</div>
            }
            </div>
            <div className="w-1/2 m-auto">
            { edit 
                ? <input className='w-full' type="text" id="name" onChange={(event) => setPaymentMethod( 
                    { ...PaymentMethod, description: event.target.value })} value={PaymentMethod.description} />
                : <div className="">{PaymentMethod.description}</div>
            }
            </div>
            
            { edit
            ? <div className="w-full">
                <MatchInput matches={PaymentMethod.matches} setMatches={setMatches} updateView={true}/> 
              </div>
            : <div className="w-1/4">
                <div className=""> {PaymentMethod.matches.join(', ')}</div>
              </div>
            }
            <div className="ml-auto flex flex-row">
            { edit
                    ? <>
                        <button className="ml-auto h-fit" onClick={() => {UpdatePaymentMethod(PaymentMethod); }}>Save</button>
                        <button className="ml-auto h-fit" onClick={CancelEdit}>Cancel</button>
                    </>
                    : <span onClick={() => setEdit(true)} className=" hover:text-white cursor-pointer">
                        <EditIcon className="m-auto cursor-pointer" width="26" height="26" />
                    </span>
                }
                <DeleteEntryButton entryType='PaymentMethod' entryId={PaymentMethod.id} entryName={PaymentMethod.name} RefreshEntities={props.RefreshEntities} />
            </div>

        </div>
    )
}
