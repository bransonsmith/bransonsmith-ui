import { useState } from "react";

export default function SecretSantaForm(props) {

    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [autoSaving, setAutoSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormValue('done', true)
        await props.updateDynamo();
    };

    function setFormValue(key, value) {
        props.updateData(props.name, key, value);
    }

    const handleFieldSwitch = async () => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdate;
        if (timeSinceLastUpdate > 10000) {
            setAutoSaving(true)
            await props.updateDynamo();
            setLastUpdate(now);
            setAutoSaving(false)
        }
    };

    return <div>

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
            { autoSaving && <div className="fixed bottom-2 right-2 text-sm text-gray-400">saving...</div>}

            <div className="flex flex-row w-full mr-auto">
                <div className="text-green-700 font-bold text-3xl border-b-2 border-red-700 w-fit px-1 mr-auto ml-0 pl-0">{props.name}</div>
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="email">Email:</label>
                <input className="w-full mt-1 mb-2" 
                    type="email"
                    id="email"
                    value={props.data[props.name]['data']['email'] || ''}
                    onChange={(e) => setFormValue('email', e.target.value)}
                    onBlur={handleFieldSwitch}
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="favoriteStores">Favorite Stores:</label>
                <input
                    className="w-full mt-1 mb-2"
                    type="text"
                    id="favoriteStores"
                    value={props.data[props.name]['data']['favoriteStores'] || ''}
                    onChange={(e) => setFormValue('favoriteStores', e.target.value)}
                    onBlur={handleFieldSwitch}
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="favoriteRestaurants">Favorite Restaurants:</label>
                <input
                    className="w-full mt-1 mb-2"
                    type="text"
                    id="favoriteRestaurants"
                    value={props.data[props.name]['data']['favoriteRestaurants'] || ''}
                    onChange={(e) => setFormValue('favoriteRestaurants', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="favoriteFoods">Favorite Foods/Snacks:</label>
                <input
                    className="w-full mt-1 mb-2"
                    type="text"
                    id="favoriteFoods"
                    value={props.data[props.name]['data']['favoriteFoods'] || ''}
                    onChange={(e) => setFormValue('favoriteFoods', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="hobbies">Hobbies:</label>
                <input
                    className="w-full mt-1 mb-2"
                    type="text"
                    id="hobbies"
                    value={props.data[props.name]['data']['hobbies'] || ''}
                    onChange={(e) => setFormValue('hobbies', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="allergies">Allergies/Dislikes:</label>
                <input
                    className="w-full mt-1 mb-2"
                    type="text"
                    id="allergies"
                    value={props.data[props.name]['data']['allergies'] || ''}
                    onChange={(e) => setFormValue('allergies', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="favoriteBooksMoviesTVShows">Favorite Books/Movies/TV Shows:</label>
                <input
                    className="w-full mt-1 mb-2"
                    type="text"
                    id="favoriteBooksMoviesTVShows"
                    value={props.data[props.name]['data']['favoriteBooksMoviesTVShows'] || ''}
                    onChange={(e) => setFormValue('favoriteBooksMoviesTVShows', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="smells">Favorite Smells, Soaps, Lotions, etc.:</label>
                <input
                    className="w-full mt-1 mb-2"
                    type="text"
                    id="smells"
                    value={props.data[props.name]['data']['favoriteBooksMoviesTVShows'] || ''}
                    onChange={(e) => setFormValue('smells', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="links">Links to wishlists (e.g. Amazon Wishlist or products you like):</label>
                <textarea
                    className="w-full mt-1 mb-2"
                    type="text"
                    id="links"
                    value={props.data[props.name]['data']['links'] || ''}
                    rows="4"
                    onChange={(e) => setFormValue('links', e.target.value)}
                    onBlur={handleFieldSwitch}
                    
                />
            </div>

            <div className="flex flex-col w-full mr-auto">
                <label className="w-full mr-auto mt-3 mb-1" htmlFor="notes">Other Notes:</label>
                <textarea
                    className="w-full mt-1 mb-2"
                    id="notes"
                    rows="4"
                    value={props.data[props.name]['data']['notes'] || ''}
                    onChange={(e) => setFormValue('notes', e.target.value)}
                    onBlur={handleFieldSwitch}
                ></textarea>
            </div>

            <button type="submit" className="bg-contentBg border-2 border-accent-300">Submit</button>
      </form>
        
    </div>

}
