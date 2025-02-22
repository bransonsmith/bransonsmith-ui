import { useState } from "react";

export default function SecretSantaForm(props) {
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [autoSaving, setAutoSaving] = useState(false);
    const [changed, setChanged]= useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormValue('done', true)
        await props.updateDynamo();
        props.back()
    };

    const undone = async (e) => {
        setFormValue('done', false)
        await props.updateDynamo();
        props.back()
    };

    function setFormValue(key, value) {
        props.updateData(props.name, key, value);
        setChanged(true);
    }

    const handleFieldSwitch = async () => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdate;
        if (changed && timeSinceLastUpdate > 10000) {
            setAutoSaving(true)
            setLastUpdate(now);
            setAutoSaving(false)
            await props.updateDynamo();
            setChanged(false);
        }
    };

    return <div>

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
            { autoSaving && <div className="fixed bottom-2 right-2 text-sm text-gray-400">saving...</div>}

            <div className="flex flex-row w-full mr-auto">
                <div className="text-white font-bold text-2xl border-b-2 border-red-700 w-fit px-1 mr-auto ml-0 pl-0 my-6">{props.name}</div>
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="favoriteStores">Favorite Stores:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-green-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    rows="6"
                    id="favoriteStores"
                    value={props.data[props.name]['data']['favoriteStores'] || ''}
                    onChange={(e) => setFormValue('favoriteStores', e.target.value)}
                    onBlur={handleFieldSwitch}
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="favoriteRestaurants">Favorite Restaurants:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-green-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    rows="6"
                    id="favoriteRestaurants"
                    value={props.data[props.name]['data']['favoriteRestaurants'] || ''}
                    onChange={(e) => setFormValue('favoriteRestaurants', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="favoriteFoods">Favorite Foods/Snacks:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-green-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    rows="6"
                    id="favoriteFoods"
                    value={props.data[props.name]['data']['favoriteFoods'] || ''}
                    onChange={(e) => setFormValue('favoriteFoods', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <br/>
            <br/>
            <br/>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="hobbies">Hobbies/Activities:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-red-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    rows="6"
                    id="hobbies"
                    value={props.data[props.name]['data']['hobbies'] || ''}
                    onChange={(e) => setFormValue('hobbies', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>


            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="favoriteBooksMoviesTVShows">Books, Movies, TV Shows:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-red-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    rows="6"
                    id="favoriteBooksMoviesTVShows"
                    value={props.data[props.name]['data']['favoriteBooksMoviesTVShows'] || ''}
                    onChange={(e) => setFormValue('favoriteBooksMoviesTVShows', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="smells">Smells, Feels, Lotions, etc.:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-red-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    rows="6"
                    id="smells"
                    value={props.data[props.name]['data']['smells'] || ''}
                    onChange={(e) => setFormValue('smells', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <br/>
            <br/>
            <br/>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="allergies">Allergies/Dislikes:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-green-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    rows="6"
                    id="allergies"
                    value={props.data[props.name]['data']['allergies'] || ''}
                    onChange={(e) => setFormValue('allergies', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="links">Links to wishlists or products you like:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-green-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    rows="6"
                    id="links"
                    value={props.data[props.name]['data']['links'] || ''}
                    rows="6"
                    onChange={(e) => setFormValue('links', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-[96%] mx-auto mt-3 mb-1 " htmlFor="notes">Other Notes:</label>
                <textarea
                    className="w-[96%] mt-1 mb-2 border-2 border-green-600 text-[16px] font-normal h-auto mx-auto overflow-y-hidden"
                    id="notes"
                    rows="6"
                    value={props.data[props.name]['data']['notes'] || ''}
                    onChange={(e) => setFormValue('notes', e.target.value)}
                    onBlur={handleFieldSwitch}
                ></textarea>
            </div>
            { props.data[props.name]['data']['done'] && props.data[props.name]['data']['done'] === true && <div className="mt-10 border-2 border-gray-700 text-gray-300 px-4 py-2 rounded w-fit" onClick={() => undone()}>Don't mark me as done yet</div> }
            <button type="submit" className="bg-red-600 text-white text-xl border-4 border-red-600 my-10">Submit</button>
      </form>
        
    </div>

}
