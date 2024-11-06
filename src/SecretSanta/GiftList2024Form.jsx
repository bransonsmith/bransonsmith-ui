import { useEffect, useState } from "react";
import GiftListInput from './GiftListInput';

export default function GiftList2024Form({ giftLists, giftListId, handleUpdateObject, updateDynamoGiftList, unselectGiftList }) {

    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [saving, setSaving] = useState(false);
    const [changed, setChanged]= useState(false);

    const [selectedList, setSelectedList] = useState(giftLists.find(list => list.id === giftListId));

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSelectedList({ ...selectedList, [id]: value });
        setChanged(true);
    };

    const handleSubmit = async () => {
        handleUpdateObject(selectedList, 'done')
        setSaving(false)
        setChanged(false);
        unselectGiftList('done');
    };

    const handleUnsubmit = async (e) => {
        handleUpdateObject(selectedList, 'in progress')
        setSaving(false)
        setChanged(false);
        unselectGiftList('in progress');
    }

    const handleSaveForLater = async (e) => {
        handleUpdateObject(selectedList, 'in progress')
        setSaving(false)
        setChanged(false);
        unselectGiftList('in progress');
    }

    const handleFieldSwitch = async () => {
        handleUpdateObject(selectedList, 'in progress')
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdate;
        if (changed && timeSinceLastUpdate > 10000) {
            setSaving(true)
            await updateDynamoGiftList(selectedList, 'in progress')
            setLastUpdate(now);
            setSaving(false)
            setChanged(false);
        }
    };

    return <div>
        <div className="flex flex-col w-full">
            { saving && <div className="fixed bottom-2 right-2 text-sm text-gray-400">saving...</div>}

            <div className="flex flex-row w-full mr-auto">
                <div className="text-white font-bold text-2xl border-b-2 border-red-700 w-fit px-1 mr-auto ml-0 pl-0 my-6">
                    {selectedList.name}
                </div>
            </div>

            <GiftListInput
                label="Favorite Stores:"
                id="favoriteStores"
                value={selectedList.favoriteStores || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />
            <GiftListInput
                label="Favorite Restaurants:"
                id="favoriteRestaurants"
                value={selectedList.favoriteRestaurants || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />
            <GiftListInput
                label="Favorite Foods/Snacks:"
                id="favoriteFoods"
                value={selectedList.favoriteFoods || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />

            <br/>
            <br/>
            <br/>

            <GiftListInput
                label="Hobbies/Activities:"
                id="hobbies"
                value={selectedList.hobbies || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />
            <GiftListInput
                label="Books, Movies, TV Shows:"
                id="favoriteBooksMoviesTVShows"
                value={selectedList.favoriteBooksMoviesTVShows || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />
            <GiftListInput
                label="Smells, Feels, Lotions, etc.:"
                id="smells"
                value={selectedList.smells || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />

            <br/>
            <br/>
            <br/>

            <GiftListInput
                label="Allergies/Dislikes:"
                id="allergies"
                value={selectedList.allergies || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />
            <GiftListInput
                label="Links to wishlists or products you like:"
                id="links"
                value={selectedList.links || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />
            <GiftListInput
                label="Other Notes:"
                id="notes"
                value={selectedList.notes || ''}
                onChange={(e) => handleChange(e)}
                onBlur={handleFieldSwitch}
            />

            { selectedList.status === 'done' && 
                <div className="mt-10 border-2 border-gray-700 text-gray-300 px-4 py-2 rounded w-fit" 
                    onClick={handleUnsubmit}
                    >
                        Unsubmit (mark list as 'in progress')
                </div> 
            }

            { selectedList.status !== 'done' &&
                <button className="bg-red-600 text-white text-xl border-4 border-red-600 my-10" 
                     onClick={handleSubmit}
                    >
                    Submit (mark list as 'done')
                </button>
            }

            { selectedList.status !== 'done' && 
                <button className="bg-gray-900 text-gray-300 text-lg border-4 border-gray-700 my-10" 
                    onClick={handleSaveForLater}
                    >
                    Save for later (mark list as 'in progress')
                </button>
            }
      </div>
    </div>
}