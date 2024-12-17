
import { useEffect, useState } from 'react';
import  AddIcon  from '../icons/AddIcon';
import  RefreshIcon  from '../icons/RefreshIcon';
import  SaveIcon  from '../icons/SaveIcon';
import  TrashIcon  from '../icons/TrashIcon';


export default function ItemManager({ name, tableName, items, handleUpdate, handleDelete, handleCreate, handleRefresh, newItemName, setNewItemName }) {

    const ItemEntry = ({item}) => {

        const [itemEntryName, setItemEntryName] = useState(item.name);

        return <div className="flex flex-row w-full items-center gap-3 h-11 my-1">
            <input 
                type="text" 
                value={itemEntryName} 
                onChange={(e) => setItemEntryName(e.target.value)} 
                className="w-2/3 h-11 p-2 bg-contentBg text-neutral-400 mr-auto ml-0" 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUpdate(tableName, { name: itemEntryName, id: item.id });
                    }
                }}
            />
            <button onClick={() => handleUpdate(tableName, { name: itemEntryName, id: item.id })} className="w-fit h-fit ml-auto flex items-center">
                <SaveIcon className="m-auto cursor-pointer" width="16" height="16"/>
            </button>
            <button onClick={() => handleDelete(tableName, item)} className="w-fit h-fit ml-auto flex items-center space-x-2 bg-red-950">
                <TrashIcon className="m-auto cursor-pointer" width="16" height="16"/>
            </button>
        </div>
    }

    const handleNewItemNameChange = (e) => {
        setNewItemName(e.target.value);
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row w-full items-center mb-0">
                <h2 className="my-0">{name} Management</h2>
                
                <button onClick={() => handleRefresh(tableName)} className="w-fit h-fit ml-auto flex items-center space-x-2 text-neutral-400 ">
                    <RefreshIcon className="m-auto cursor-pointer" width="26" height="26"/>
                </button>
            </div>

            <div className="flex flex-col w-full mt-4">

                {items.length === 0 && 
                    <div className="flex flex-row w-full items-center">
                        <span>No {name} found</span>
                    </div>  
                }

                {items.map((item) => {
                    return <ItemEntry key={item.id} item={item} />
                })}
            </div>

            <div className="flex flex-row w-full mt-4 border border-gray-600 rounded-md py-2 px-1">

                <input 
                    type="text" 
                    placeholder={`New ${name.substring(0, name.length - 1)}`} 
                    onChange={handleNewItemNameChange} 
                    value={newItemName} 
                    className="w-2/3 p-2 bg-contentBg text-neutral-400 mr-auto ml-0" 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreate(tableName, newItemName);
                        }
                    }}
                />

                <button onClick={() => handleCreate(tableName, newItemName)} className="w-fit h-fit ml-auto flex items-center space-x-2 bg-accent-600 ">
                    <AddIcon className="m-auto cursor-pointer" width="52" height="52"/>
                    <span>Create</span>
                </button>
            </div>

        </div>
    );

}






