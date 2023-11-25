import { useEffect, useState } from "react";
import SecretSantaForm from "../SecretSanta/SecretSantaForm";

export default function SecretSantaPage() {

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedPersonName, setSelectedPersonName] = useState(null);
    const [data, setData] = useState
    (
        {
            "Branson Smith":{
               "data":{
                  "done":false,
                  "favoriteStores":"Amazon, Lowes",
                  "favoriteRestaurants":"Sushi",
                  "notes":"Test"
               }
            },
            "Devon Smith":{
               "data":{
                  "done":false,
                  "favoriteStores":"Target, home goods, Amazon, Lowe’s ",
                  "favoriteRestaurants":"Starbucks (or any coffee shop), longhorn steakhouse, Chick-fil-A,chipotle ",
                  "hobbies":"Baking, family activities, Groupon dates ",
                  "smells":"None",
                  "allergies":"Lotions, candles, socks, mugs ",
                  "notes":"Decorations for the new house or gift cards to places like Kirklands or home goods. \n2+ player board games \n"
               }
            },
            "Melisa Smith": {
                "data": {
                  "favoriteStores": "Kohls, JC Penney, Ulta, Hobby Lobby, Sprouts, Lowes",
                  "favoriteRestaurants": "Chipotle, Five Guys, Lupe Tortilla",
                  "favoriteFoods": "Avocados, Sweet Potatoes, Water, Raw Unsalted Sun Flower Seeds, CocoJune Vanilla Yogurt, Granny Smith Apples, Fresh Okra",
                  "hobbies": "Gardening, cooking, music, board games, home decor, filing feet",
                  "favoriteBooksMoviesTVShows": "Joke books, riddles, Devotions, Game Shows, Call the Midwife, All Creatures Great and Small",
                  "smells": "Essential oils or soaps: Lime, Coconut, Peppermint. Lotions: No.7 Advanced, Cereve (fragrance-free), Feels: 100% cotton sweaters, long sleeve shirts, soft beige blanket",
                  "allergies": "Gluten, scented lotions, spicy foods, fruity candy",
                  "links": "100% cotton ladies' size large mock turtlenecks, tweezers, foot files, beige or white hot pads, beige or white small kitchen towels (washcloth size), 22x22 beige or ivory pillow covers",
                  "notes": "I love handwritten notes. I like plants, flowers, flower seeds. I always cherish our family time and look forward to seeing everyone and getting surprises!! :)",
                  "done": true
                }
            },
            "Carl Smith":{
               "data":{}
            },
            "Chandler Coplen": {
                "data": {
                  "favoriteStores": "Amazon, Hobby Lobby, Academy, Sephora, Ulta, Target",
                  "favoriteRestaurants": "Longhorn Steakhouse, Olive Garden, Panera Bread, Chick-fil-A, Chipotle, Whataburger",
                  "favoriteFoods": "Cheez-its, Jalapeño Chips, Fruit Snacks, Twizzlers",
                  "hobbies": "Circuit Crafting, Diamond Dot Art, Sewing, Painting Nails",
                  "favoriteBooksMoviesTVShows": "Mystery Books, Comedy TV Show or Movies",
                  "smells": "Vanilla, Mint/Peppermint, Coconut, Mahogany",
                  "allergies": "Tree Nut Allergy",
                  "notes": "Love craft supplies and winter accessories, no color preferences",
                  "done": true
                }
            },
            "Brad Coplen":{
               "data":{
                  
               }
            },
            "Mabry Smith":{
               "data":{
                  "favoriteStores":"Recycled Books (gift certificates are available on their site), Kroger, Aldi, Sprouts, HEB ",
                  "favoriteFoods":"Natures Bakery Brownies, cheddar Chex mix, H‑E‑B baked chips (original and sour cream & onion), basically anything crunchy/carby",
                  "hobbies":"Listening to records/Vinyl collecting, hiking, board games, sourdough baking",
                  "favoriteRestaurants":"Uber eats, Cava, Panda Express, canes, Chick-fil-A, Dominos, in-n-out",
                  "favoriteBooksMoviesTVShows":"Golden girls",
                  "smells":"Natural scents; citrus, peppermint, apple, lavender",
                  "allergies":"I don’t need anymore fuzzy socks, tea, or mugs",
                  "links":"https://www.amazon.com/hz/wishlist/ls/3PYA48U09PIYY?ref_=wl_share\n\n*** None of the items on my list are brand specific, so if you find a better deal on something similar go for it!!!\n\nTop wants \n- compost bins\n-tea kettle\n-water filter",
                  "notes":"I love a lot of local small Denton businesses so cash to support those is always appreciated. I’m a big fan of low waste/more sustainable choices when available.",
                  "done":true
               }
            },
            "Brinley Starrantino": {
                "data": {
                  "favoriteStores": "target, home goods, bath and body works, ulta",
                  "favoriteRestaurants": "chick fil a, canes, jersey mikes",
                  "favoriteFoods": "mexican, italian, popcorn",
                  "hobbies": "crafting, reading, winston",
                  "favoriteBooksMoviesTVShows": "n/a",
                  "smells": "vanilla, clean smells, cool textures"
                }
            },
            "Andrew Starrantino": {
                "data": {
                  "favoriteStores": "Home depot, harbor freight, bass pro shop",
                  "favoriteRestaurants": "Texas roadhouse, CFA",
                  "favoriteFoods": "Skittles",
                  "hobbies": "Woodworking",
                  "allergies": "N/a",
                  "smells": "Zamboni exhaust",
                  "favoriteBooksMoviesTVShows": "The office, Narcos, South park",
                  "done": true
                }
              },
            "Denny Kramer": {
                "data": {
                  "favoriteStores": "Buc-ee’s; Starbucks; Sam’s Club; Amazon; Kohl’s; Mission",
                  "favoriteRestaurants": "P.F. Changs; El Conquistador; Clem Mikeska’s; Pappasitos",
                  "favoriteFoods": "*No sugar* — Cheeses; hot sauces; fudge; vegetable chips; salsa; jerky — *No sugar*",
                  "hobbies": "New Mexico chile ristras; novel hot sauce bottles;",
                  "smells": "Neutrogena Hydro Boost body gel cream fragrance-free; Van Der Hagen Shave Butter; Cremo Cooling Shave Cream Refreshing Mint",
                  "favoriteBooksMoviesTVShows": "Rick Bayless Frontera; Rick Bayless Mexico One Plate at a Time",
                  "allergies": "Sweets; Sugary items",
                  "notes": "Thank you. ❤️",
                  "done": true
                }
            },
            "Deanne Kramer": {
                "data": {
                  "favoriteStores": "Hobby Lobby or Target",
                  "favoriteRestaurants": "Texas Roadhouse or Pappadeaux’s",
                  "favoriteFoods": "Popcorn (sea salt or lightly salted); Torani’s sugar-free peach syrup for drinks",
                  "hobbies": "Photography",
                  "smells": "Anything vanilla or cinnamon",
                  "allergies": "No candles; no allergies",
                  "favoriteBooksMoviesTVShows": "None",
                  "done": true
                }
            },
            "Emerson Kramer": {
                "data": {
                  "favoriteStores": "Kendra Scott, Ulta, Sephora, Target, Lululemon (in order)",
                  "favoriteRestaurants": "Texas Roadhouse, Olive Garden, Ninfas, Chuys",
                  "favoriteFoods": "Starbucks",
                  "hobbies": "TikTok, working out, crafting, watching phone/TV",
                  "favoriteBooksMoviesTVShows": "Hunger Games, Twilight, Harry Potter, Home Alone, Elf",
                  "smells": "Almond/Vanilla/Pistachio, Pumpkin Spice",
                  "allergies": "Food and Drinks, Fuzzy socks, body wash/scrubs/candles",
                  "notes": "I love gift cards and things from the heart!!",
                  "done": true
                }
              },
              "Grayson Kramer": {
                "data": {
                  "favoriteStores": "Barnes and Noble, Target, Ulta",
                  "favoriteRestaurants": "Texas Roadhouse, Pappadeaux, Ninfa’s, Olive Garden",
                  "favoriteFoods": "Starbucks",
                  "hobbies": "Reading, TikTok, working out",
                  "favoriteBooksMoviesTVShows": "Fantasy/Dystopian books, Gilmore girls, Glee, Anne with an E",
                  "smells": "Eucalyptus, peppermint, anything Bath and Body Works",
                  "allergies": "Food and Drinks, fuzzy socks, body scrubs/lotion, candles, blanket",
                  "links": "N/A",
                  "notes": "Barnes and Noble gift card ;)",
                  "done": true
                }
              },
              "Addison Kramer": {
                "data": {
                  "favoriteStores": "Sephora, Ulta, Target, Lulu Lemon",
                  "favoriteRestaurants": "Texas Roadhouse, Ninfas, Olive Garden",
                  "favoriteFoods": "Lindor Chocolate, Pocky’s, Takis, Gummies",
                  "hobbies": "Volleyball, Basketball, Track, Cheer",
                  "favoriteBooksMoviesTVShows": "Hunger Games, The Summer I Turned Pretty, Holiday Movies (I don’t like books😂)",
                  "smells": "Coconut, Vanilla, Warm Scents, Body Scrubs, Body Butters, Skin Care",
                  "allergies": "None",
                  "notes": "I like pink, girly stuff, comfy clothes/items, skincare, self-care, makeup, trending items, jewelry (gold and silver)"
                }
              },
            "James Seay":{
               "data":{}
            },
            "Margaret Kramer": {
                "data": {
                    "favoriteStores": "Amazon, HEB",
                    "favoriteRestaurants": "El Con, Casa de Castillo",
                    "favoriteFoods": "Almonds, popcorn, dark chocolate",
                    "hobbies": "Reading, word puzzles, Sudoku",
                    "favoriteBooksMoviesTVShows": "Grisham, legal thrillers/mysteries",
                    "smells": "Citrus, essential oils",
                    "allergies": "Rap music, slow jazz",
                    "links": "None",
                    "notes": "Photos of family. Car wash. Time w/family. Birdseed.postage stamps. Clear fingernail polish.",
                    "done": true
                }
            }
        }
    )

    const lambdaUrl = 'https://wzo2t2vx5l7mgbwdihia5p37hi0hikkz.lambda-url.us-east-2.on.aws/';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch(lambdaUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const resJson = await response.json();
                const newData = {}
                for (var personObj of resJson) {
                    newData[personObj["PersonName"]] = JSON.parse(personObj["questionData"])
                }
                setData(newData)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [showForm])

    function choosePerson(person, personName) {
        setSelectedPerson(person)
        setSelectedPersonName(personName)
        setShowForm(true)
    }
    function unselectPerson() {
        setSelectedPerson(null)
        setSelectedPersonName(null)
        setShowForm(false)
    }

    async function comeBackLater() {
        await updateDynamoData()
        setSelectedPerson(null)
        setSelectedPersonName(null)
        setShowForm(false)
    }

    function updateData(personName, personKey, personValue) {
        const updatedData = {...data}
        updatedData[personName]['data'][personKey] = personValue
        setData(updatedData)
    }

    async function updateDynamoData() {

        if (selectedPerson) {
            const payload = {
                'personToUpdate': selectedPersonName,
                'personData': {'data': data[selectedPersonName]['data']}
            }

            const forDynamo = JSON.stringify(payload);

            try {
                const response = await fetch(lambdaUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: forDynamo
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error updating data:', error.message);
            }
        }
    }

    const oddBorder = '#cc2222';
    const evenBorder = '#22cc22';
    function getBorder(i) {
        if (i % 2 === 0) return evenBorder;
        return oddBorder;
    }

    return <div className="text-white">
        <h1 className="border-b-2 border-red-500 text-3xl text-green-500" onClick={() => unselectPerson()}>Secret Santa 2023</h1>
        { loading && <div className="text-green-700">Loading most recent data...</div> }
        { showForm && selectedPerson
        ? <div className="w-full flex flex-row">
            <button className="border-2 border-black rounded-sm shadow-lg shadow-black py-3 fixed bottom-2 m-auto left-4" onClick={() => unselectPerson()}>Back to all people</button>
            <button className="border-2 border-black rounded-sm shadow-lg shadow-black py-3 fixed bottom-2 m-auto left-48 w-fit" onClick={() => comeBackLater()}>Save for later</button>
        </div>
        : <></>
        }
        { !showForm 
        ? <div> 
            <h3 className="my-4 mb-5">Who are you filling out preferences for?</h3>
            <p className="text-sm text-gray-500 my-2 p-0">Click on a name set secret santa preferences. <br/> Once everyone is done, matches will get sent out.</p>
            <ul>
                {Object.keys(data).sort().map((personName, i) => {
                    return <li key={i} style={{borderColor: getBorder(i) }} className="flex cursor-pointer hover:bg-green-900 flex-row py-2 px-4 w-64 rounded shadow-black bg-contentBg border-2 font-bold" onClick={() => choosePerson(data[personName], personName)}>
                        <div>{personName}</div>
                        { data[personName] && data[personName]['data'] && data[personName]['data']['done'] && 
                            <div className="text-gray-400 text-sm ml-3">(done)</div>
                        }
                        { data[personName] && data[personName]['data'] && !data[personName]['data']['done'] && Object.keys(data[personName]['data']).length > 0 && 
                            <div className="text-gray-400 text-sm ml-3">(in progress)</div>
                        }
                    </li>
                })}
            </ul>
        </div>
        : <></>}

        { showForm && selectedPerson && <SecretSantaForm name={selectedPersonName} data={data} updateDynamo={updateDynamoData} updateData={updateData} back={unselectPerson}/> }
    </div>

}
