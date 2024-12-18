import ItemManager from '../GingerBreadAdmin/ItemManager';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';

export default function GingerBreadAdmin() {

    const functionBaseUrl = "https://q2555xh4l7ppkwldozgnavh3ce0aweeq.lambda-url.us-east-1.on.aws/";
    const itemTypes = [
        {name: "Styles", tableName: "GB_Styles"},
        {name: "Vantages", tableName: "GB_Vantages"},
        {name: "Names", tableName: "GB_Names"},
        {name: "Items", tableName: "GB_Items"},
        {name: "Features", tableName: "GB_Features"},
    ];

    const [selectedItemType, setSelectedItemType] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [styles, setStyles] = useState(null);
    const [vantages, setVantages] = useState(null);
    const [names, setNames] = useState(null);
    const [items, setItems] = useState(null);
    const [features, setFeatures] = useState(null);

    const [newItemName, setNewItemName] = useState("");

    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        if (toastMessage && !toastMessage.error) {
            const originalMessage = toastMessage.message;
            const timer = setTimeout(() => {
                if (toastMessage && !toastMessage.error && toastMessage.message === originalMessage) {
                    setToastMessage(null);
                }
            }, 5000);
        }
    }, [toastMessage]);

    useEffect(() => {
        async function getDynamoItems(tableName, itemSetterFunction) {
            try {
                const response = await fetch(`${functionBaseUrl}?table=${tableName}`);
                const responseBody = await response.json();
                if (!response.ok) {
                    const errorMessage = `Failed to load. Tell Branson, or try again later. Table: ${tableName}. ${response.status}. ${responseBody.message}`
                    setToastMessage({message: errorMessage, error: true});
                    console.error(errorMessage);
                    setLoading(false);
                }
                if (response.ok) {
                    itemSetterFunction(responseBody);
                }
            }
            catch (error) {
                const errorMessage = `Failed to load. Tell Branson, or try again later. Table: ${tableName}. ${error.message}`
                setToastMessage({message: errorMessage, error: true});
                console.error(errorMessage);
                setLoading(false);
            }
        }

        getDynamoItems("GB_Styles", setStyles);
        getDynamoItems("GB_Vantages", setVantages);
        getDynamoItems("GB_Names", setNames);
        getDynamoItems("GB_Items", setItems);
        getDynamoItems("GB_Features", setFeatures);

    }, []);

    useEffect(() => {
        if (styles !== null && vantages !== null && names !== null && items !== null && features !== null) {
    
            handleItemTypeSelection(itemTypes[0]);
        }
    }, [styles, vantages, names, items, features]);

    const handleItemTypeSelection = (itemType) => {
        setSelectedItemType(itemType);
        switch (itemType.name) {
            case "Styles": setSelectedItems(styles); break;
            case "Vantages": setSelectedItems(vantages); break;
            case "Names": setSelectedItems(names); break;
            case "Items": setSelectedItems(items); break;
            case "Features": setSelectedItems(features); break
            default: break;
        }
        if (selectedItems) {
            setLoading(false);
        }
    }

    const handleRefresh = async (tableName) => { 
        try {
            const response = await fetch(`${functionBaseUrl}?table=${tableName}`);
            const responseBody = await response.json();
        
            if (!response.ok) {
                const errorMessage = `Error refreshing ${tableName}. ${response.status}. ${responseBody.message}`
                setToastMessage({message: errorMessage, error: true});
                console.error(errorMessage);
            }
            if (response.ok) {
                setSelectedItems(responseBody);
                switch (tableName) {
                    case "GB_Styles": setStyles(selectedItems); setToastMessage({message: `Refreshed styles.`}); break;
                    case "GB_Vantages": setVantages(selectedItems); setToastMessage({message: `Refreshed styles.`}); break;
                    case "GB_Names": setNames(selectedItems); setToastMessage({message: `Refreshed styles.`}); break;
                    case "GB_Items": setItems(selectedItems); setToastMessage({message: `Refreshed styles.`}); break;
                    case "GB_Features": setFeatures(selectedItems);  setToastMessage({message: `Refreshed styles.`}); break;
                    default: break;
                }
                setNewItemName("");
            }
        } 
        catch (error) {
            const errorMessage = `Error refreshing ${tableName}. ${error.message}`
            setToastMessage({message: errorMessage, error: true});
            console.error(errorMessage);
        }
    }

    const handleCreate = async (tableName, newItemName) => { 
        if (newItemName)
        {
            function createId() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                  const r = Math.random() * 16 | 0;
                  const v = c === 'x' ? r : (r & 0x3 | 0x8);
                  return v.toString(16);
                });
            }
            const newItem = { id: createId(), name: newItemName };

            const forDynamo = JSON.stringify(newItem);
            try {
                const response = await fetch(`${functionBaseUrl}?table=${tableName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: forDynamo
                })
                if (!response.ok) {
                    const errorMessage = `Error creating ${tableName}. ${response.status}. ${responseBody.message}`
                    setToastMessage({message: errorMessage, error: true});
                    console.error(errorMessage);
                }
                if (response.ok) {
                    selectedItems.push(newItem);
                    switch (tableName) {
                        case "GB_Styles": setStyles(selectedItems); setToastMessage({message: `${newItem.name} style created.`}); break;
                        case "GB_Vantages": setVantages(selectedItems); setToastMessage({message: `${newItem.name} vantage created.`}); break;
                        case "GB_Names": setNames(selectedItems); setToastMessage({message: `${newItem.name} name created.`}); break;
                        case "GB_Items": setItems(selectedItems); setToastMessage({message: `${newItem.name} item created.`}); break;
                        case "GB_Features": setFeatures(selectedItems); setToastMessage({message: `${newItem.name} feature created.`}); break;
                        default: break;
                    }
                    setNewItemName("");
                }
            } catch (error) {
                const errorMessage = `Error creating ${tableName}. ${error.message}`
                setToastMessage({message: errorMessage, error: true});
                console.error(errorMessage);
            }
        }
        else {
            const errorMessage = `Error creating ${tableName}. Item must have a name property.`;
            setToastMessage({message: errorMessage, error: true});
            console.error(errorMessage);
        }
    }

    const handleUpdate = async (tableName, item) => { 
        if (item.name && item.id) {
            try {
                const forDynamo = JSON.stringify(item);
                const response = await fetch(`${functionBaseUrl}?table=${tableName}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: forDynamo
                })
                const responseBody = response.json();
                if (!response.ok) {
                    const errorMessage = `Error updating ${tableName}. ${response.status}. ${responseBody.message}`
                    setToastMessage({message: errorMessage, error: true});
                    console.error(errorMessage);
                }
                if (response.ok) {
                    const updatedItem = selectedItems.find(i => i.id === item.id);
                    updatedItem.name = item.name;
                    setSelectedItems([...selectedItems]);
                    switch (tableName) {
                        case "GB_Styles": setStyles(selectedItems); setToastMessage({message: `${item.name} style updated.`}); break;
                        case "GB_Vantages": setVantages(selectedItems); setToastMessage({message: `${item.name} vantage updated.`}); break;
                        case "GB_Names": setNames(selectedItems); setToastMessage({message: `${item.name} name updated.`}); break;
                        case "GB_Items": setItems(selectedItems); setToastMessage({message: `${item.name} item updated.`}); break;
                        case "GB_Features": setFeatures(selectedItems); setToastMessage({message: `${item.name} feature updated.`}); break;
                        default: break;
                    }
                }
            }
            catch (error) {
                const errorMessage = `Error updating ${tableName}. ${error.message}`
                setToastMessage({message: errorMessage, error: true});
                console.error(errorMessage);
            }
        } 
        else {
            const errorMessage = `Error updating ${tableName}. Item must have an id and a name.`;
            setToastMessage({message: errorMessage, error: true});
            console.error(errorMessage);
        }
    }

    const handleDelete = async (tableName, item) => { 
        if (item.id) {
            try {
                const response = await fetch(`${functionBaseUrl}?table=${tableName}&itemId=${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const responseBody = response.json();
                if (!response.ok) {
                    const errorMessage = `Error deleting ${tableName}. ${response.status}. ${responseBody.message}`
                    setToastMessage({message: errorMessage, error: true});
                    console.error(errorMessage);
                }
                if (response.ok) {
                    const updatedItems = selectedItems.filter(i => i.name !== item.name);
                    setSelectedItems(updatedItems);
                    switch (tableName) {
                        case "GB_Styles": setStyles(updatedItems); setToastMessage({message: `${item.name} style deleted.`}); break;
                        case "GB_Vantages": setVantages(updatedItems); setToastMessage({message: `${item.name} vantage deleted.`}); break;
                        case "GB_Names": setNames(updatedItems); setToastMessage({message: `${item.name} name deleted.`}); break;
                        case "GB_Items": setItems(updatedItems); setToastMessage({message: `${item.name} item deleted.`}); break;
                        case "GB_Features": setFeatures(updatedItems); setToastMessage({message: `${item.name} feature deleted.`}); break;
                        default: break;
                    }
                }
            }
            catch (error) {
                const errorMessage = `Error deleting ${tableName}. ${error.message}`
                setToastMessage({message: errorMessage, error: true});
                console.error(errorMessage);
            }
        }
        else {
            const errorMessage = `Error deleting ${tableName}. Item must have an id property.`;
            setToastMessage({message: errorMessage, error: true});
            console.error(errorMessage);
        }
    }

    return <div className="w-full flex flex-col">
        <h1>Gingerbread Admin</h1>

        <div className="w-full flex flex-col bg-contentBg p-2 rounded-lg">
            { loading
            ? <div className="w-full flex">
                <Loading />
                <div className="text-gray-500 font-bold m-auto"> Loading Items </div>
            </div>
            : <span> 
                <div className="flex flex-row w-full flex-wrap rounded  mt-4 mb-6">
                    {itemTypes.map((itemType) => {
                        return <div key={itemType.name} className="w-fit p-0  cursor-pointer">{ selectedItemType !== null && itemType.name === selectedItemType.name
                            ? <div className="py-1 px-3 font-bold bg-slate-700 border-2 border-accent-500">{itemType.name}</div>
                            : <div className="py-1 px-3  border-2 bg-slate-800 border-contentBg" onClick={() => handleItemTypeSelection(itemType)}>{itemType.name}</div>
                        }</div>
                    })}
                </div>
                { selectedItemType &&
                    <ItemManager 
                        name={selectedItemType.name} 
                        tableName ={selectedItemType.tableName} 
                        items={selectedItems} 
                        handleRefresh={handleRefresh} 
                        handleCreate={handleCreate}
                        handleUpdate={handleUpdate}
                        handleDelete={handleDelete}
                        newItemName={newItemName}
                        setNewItemName={setNewItemName}
                    /> 
                }
            </span>}
        </div>
    

        { toastMessage &&
            <span className="w-11/12 fixed bottom-4 ml-1 cursor-pointer" onClick={() => setToastMessage(null)}>
            { toastMessage.error 
                ? <div className="w-full bg-red-950 text-red-600 p-4 flex flex-row border border-red-600">
                    <div className="mr-auto ml-1">{toastMessage.message}</div> 
                    <div className="font-bold text-2xl ml-auto mr-1">X</div> 
                </div> 
                : <div className="w-full bg-accent-900 text-accent-400 p-4 flex flex-row border border-accent-400">
                    <div className="mr-auto ml-1">{toastMessage.message}</div> 
                    <div className="font-bold text-2xl ml-auto mr-1">X</div> 
                </div> 
            }
            </span>
        }
    </div>

}