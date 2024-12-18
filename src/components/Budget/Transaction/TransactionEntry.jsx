import { useState } from 'react';
import DeleteEntryButton from '../DeleteEntryButton';
import { makeRequestToApi } from '../../../Services/ApiService';
import PopUpWindow from '../PopUpWindow';
import EditIcon from '../../../icons/EditIcon';
import SaveIcon from '../../../icons/SaveIcon';

export default function TransactionEntry(props) {

    const [Transaction, setTransaction] = useState(props.Transaction);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState(null);

    const getCategoryName = (categoryId) => {
        const category = props.categories.find((category) => category.id === categoryId);
        return category ? category.name : '';
    }
    
    const getPlaceName = (id) => {
        const e = props.places.find((e) => e.id === id);
        return e ? e.name : '';
    }

    const UpdateTransaction = async (Transaction) => {
        Transaction.amount = parseFloat(Transaction.amount);
        Transaction.transactionDate = new Date(Transaction.transactionDate);
        Transaction.placeId = parseInt(Transaction.placeId);
        Transaction.categoryId = parseInt(Transaction.categoryId);
        const response = await makeRequestToApi('api/Transaction/' + Transaction.id, 'PUT', Transaction);
        if (response.status === 200) {
            setTransaction(response.data);
            setEdit(false);
            await props.RefreshEntities();
        } else {
            console.error('Error updating Transaction: ', response);
            setError('Error updating Transaction: ' + response.data.detail);
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
                ? <input className='w-full' type="text" id="date" onChange={(event) => setTransaction( 
                    { ...Transaction, transactionDate: event.target.value })} value={Transaction.transactionDate} />
                : <div className="">{Transaction.transactionDate}</div>
            }
            </div>
            <div className="w-1/4">
            { edit 
                ? <input className='w-full' type="text" id="amount" onChange={(event) => setTransaction( 
                    { ...Transaction, amount: event.target.value })} value={Transaction.amount} />
                : <div className="">{Transaction.amount}</div>
            }
            </div>
            
            <div className="w-1/2">
            {edit
                ? <select className='w-full' id="place" onChange={(event) => setTransaction(
                    { ...Transaction, placeId: event.target.value })} value={Transaction.placeId}>
                    <option value=''>Select Place</option>
                    {props.places.map((place, index) => {
                        return <option key={index} value={place.id}>{place.name}</option>
                    })}
                </select>
                : <div className="">Place: {getPlaceName(Transaction.placeId)}</div>
            }
            <div className="w-1/2">
            {edit
                ? <select className='w-full' id="category" onChange={(event) => setTransaction(
                    { ...Transaction, categoryId: event.target.value })} value={Transaction.categoryId}>
                    <option value=''>Select Category</option>
                    {props.categories.map((category, index) => {
                        return <option key={index} value={category.id}>{category.name}</option>
                    })}
                </select>
                : <div className="">Category: {getCategoryName(Transaction.categoryId)}</div>
            }
            </div>
            </div>
            <div className="w-1/2">
            { edit 
                ? <input className='w-full' type="text" id="name" onChange={(event) => setTransaction( 
                    { ...Transaction, description: event.target.value })} value={Transaction.description} />
                : <div className="">{Transaction.description}</div>
            }
            </div>
            <div className="ml-auto flex flex-row">
                { edit
                    ? <button className="ml-auto" onClick={() => {UpdateTransaction(Transaction); }}>Save</button>
                    : <span onClick={() => setEdit(true)} className=" hover:text-white cursor-pointer">
                        <EditIcon className="m-auto cursor-pointer" width="26" height="26" />
                    </span>
                }
                <DeleteEntryButton entryType='Transaction' entryId={Transaction.id} entryName={Transaction.description} RefreshEntities={props.RefreshEntities} />
            </div>

        </div>
    )
}
