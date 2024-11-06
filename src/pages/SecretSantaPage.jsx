import { useEffect, useState } from "react";
import SecretSantaForm from "../SecretSanta/SecretSantaForm";
import { Helmet } from 'react-helmet';
import '../SecretSanta/SecretSanta.css';

export default function SecretSantaPage() {

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedPersonName, setSelectedPersonName] = useState(null);
    const [lambdaUrl] = useState('https://kuk65anqkyw74n2a3jkl3qvtdu0jhsnw.lambda-url.us-east-1.on.aws/');

    const [data, setData] = useState([])
    // ([
    //     {"id": "1",  "name": "Branson",  "status": "new", "favoriteStores":"Amazon, Lowes","favoriteRestaurants":"Sushi, chick fil a, subway, jersey mikes","notes":"FitKicks, hoodies, I collect lizard decorations to hang on the wall","favoriteFoods":"Sparkling Water, Coffee, Sushi","smells":"Eucalyptus, menthol, mint ","hobbies":"Programming, rocket league, grilling, teaching, board games with dev, outside toys with Lewis","favoriteBooksMoviesTVShows":"Non fiction, biographies, (also interested in your book recommendations) "},
    //     {"id": "2",  "name": "Margaret", "status": "new", "favoriteStores":"Amazon, HEB","favoriteRestaurants":"El Con, Casa de Castillo","favoriteFoods":"Almonds, popcorn, dark chocolate","hobbies":"Reading, word puzzles, Sudoku","favoriteBooksMoviesTVShows":"Grisham, legal thrillers/mysteries","smells":"Citrus, essential oils","allergies":"Rap music, slow jazz","links":"None","notes":"Photos of family. Car wash. Time w/family. Birdseed.postage stamps. Clear fingernail polish."},
    //     {"id": "3",  "name": "Mabry",    "status": "new", "favoriteStores":"Recycled Books (gift certificates are available on their site), Kroger, Aldi, Sprouts, HEB ","favoriteFoods":"Natures Bakery Brownies, cheddar Chex mix, H‑E‑B baked chips (original and sour cream & onion), basically anything crunchy/carby","hobbies":"Listening to records/Vinyl collecting, hiking, board games, sourdough baking","favoriteRestaurants":"Uber eats, Cava, Panda Express, canes, Chick-fil-A, Dominos, in-n-out","favoriteBooksMoviesTVShows":"Golden girls","smells":"Natural scents; citrus, peppermint, apple, lavender","allergies":"I don’t need anymore fuzzy socks, tea, or mugs","links":"https://www.amazon.com/hz/wishlist/ls/3PYA48U09PIYY?ref_=wl_share\n\n*** None of the items on my list are brand specific, so if you find a better deal on something similar go for it!!!\n\nTop wants \n- compost bins\n-tea kettle\n-water filter","notes":"I love a lot of local small Denton businesses so cash to support those is always appreciated. I’m a big fan of low waste/more sustainable choices when available."},
    //     {"id": "4",  "name": "Devon",    "status": "new", "favoriteStores":"Target,madewell, Kirklands, home goods, Amazon, Lowe’s ","favoriteRestaurants":"Black rifle coffee, Starbucks, shogun, longhorn, newks, cfa","hobbies":"Baking, family activities, Groupon dates ","smells":"None","allergies":"Dislike Lotions, candles, socks, mugs ","notes":"Board games (2 player)\nDecorations or gift cards for new house\nTeacher supplies - erasable red pen, expo markers, binder clips ","favoriteFoods":"Chocolate covered almonds, Coffee pods,  kind breakfast bars, healthy snacks ","favoriteBooksMoviesTVShows":"New morning mercies - I lost my copy :(","links":"https://www.amazon.com/hz/wishlist/ls/1AJ65ZJQT1W5Y?ref_=wl_share"},
    //     {"id": "5",  "name": "Deanne",   "status": "new", "favoriteStores":"Hobby Lobby or Target","favoriteRestaurants":"Texas Roadhouse or Pappadeaux’s","favoriteFoods":"Popcorn (sea salt or lightly salted); Torani’s sugar-free peach syrup for drinks","hobbies":"Photography","smells":"Anything vanilla or cinnamon","allergies":"No candles; no allergies","favoriteBooksMoviesTVShows":"None"},
    //     {"id": "6",  "name": "Denny",    "status": "new", "favoriteStores":"Buc-ee’s; Starbucks; Sam’s Club; Amazon; Kohl’s; Mission","favoriteRestaurants":"P.F. Changs; El Conquistador; Clem Mikeska’s; Pappasitos","favoriteFoods":"*No sugar* — Cheeses; hot sauces; fudge; vegetable chips; salsa; jerky — *No sugar*","hobbies":"New Mexico chile ristras; novel hot sauce bottles;","smells":"Neutrogena Hydro Boost body gel cream fragrance-free; Van Der Hagen Shave Butter; Cremo Cooling Shave Cream Refreshing Mint","favoriteBooksMoviesTVShows":"Rick Bayless Frontera; Rick Bayless Mexico One Plate at a Time","allergies":"Sweets; Sugary items","notes":"Thank you. ❤️"},
    //     {"id": "7",  "name": "Chandler", "status": "new", "favoriteStores":"Amazon, Hobby Lobby, Academy, Sephora, Ulta, Target","favoriteRestaurants":"Longhorn Steakhouse, Olive Garden, Panera Bread, Chick-fil-A, Chipotle, Whataburger","favoriteFoods":"Cheez-its, Jalapeño Chips, Fruit Snacks, Twizzlers","hobbies":"Circuit Crafting, Diamond Dot Art, Sewing, Painting Nails","favoriteBooksMoviesTVShows":"Mystery Books, Comedy TV Show or Movies","smells":"Vanilla, Mint/Peppermint, Coconut, Mahogany","allergies":"Tree Nut Allergy","notes":"Love craft supplies and winter accessories, no color preferences"},
    //     {"id": "8",  "name": "Melisa",   "status": "new", "favoriteStores":"Kohls, JC Penney, Ulta, Hobby Lobby, Sprouts, Lowes","favoriteRestaurants":"Chipotle, Five Guys, Lupe Tortilla","favoriteFoods":"Avocados, Sweet Potatoes, Water, Raw Unsalted Sun Flower Seeds, CocoJune Vanilla Yogurt, Granny Smith Apples, Fresh Okra","hobbies":"Gardening, cooking, music, board games, home decor, filing feet","favoriteBooksMoviesTVShows":"Joke books, riddles, Devotions, Game Shows, Call the Midwife, All Creatures Great and Small","smells":"Essential oils or soaps: Lime, Coconut, Peppermint. Lotions: No.7 Advanced, Cereve (fragrance-free), Feels: 100% cotton sweaters, long sleeve shirts, soft beige blanket","allergies":"Gluten, scented lotions, spicy foods, fruity candy","links":"100% cotton ladies' size large mock turtlenecks, tweezers, foot files, beige or white hot pads, beige or white small kitchen towels (washcloth size), 22x22 beige or ivory pillow covers","notes":"I love handwritten notes. I like plants, flowers, flower seeds. I always cherish our family time and look forward to seeing everyone and getting surprises!! :)"},
    //     {"id": "9",  "name": "Brinley",  "status": "new", "favoriteStores":"target, home goods, bath and body works, ulta","favoriteRestaurants":"chick fil a, canes, jersey mikes","favoriteFoods":"mexican, italian, popcorn","hobbies":"crafting, reading, winston","favoriteBooksMoviesTVShows":"n/a","smells":"vanilla, clean smells, cool textures"},
    //     {"id": "10", "name": "Brad",     "status": "new", "favoriteStores":"Academy, Lowes, Home Depot","favoriteRestaurants":"Longhorn, Texas Roadhouse, Olive Garden","favoriteFoods":"Cookies, Jalapeno Chips, Mixed Nuts","hobbies":"Hunting, Sports, Concerts","favoriteBooksMoviesTVShows":"Sci-Fi, Non-Fiction novels. Comedies for TV/movies","smells":"Whatever Chandler would like.","allergies":"No allergies. Indifferent on likes/dislikes."},
    //     {"id": "11", "name": "Carl",     "status": "new", "favoriteStores":"Wild birds unlimited\nLowes\nHEB\nWild Fork","favoriteRestaurants":"Chipotle \nSteak ","favoriteFoods":"Any non-chocolate candy\nNuts\nFruits\nSparkling waters","hobbies":"Cars\nGardening \nBirds","allergies":"Chocolate candy \nRaisins","notes":"I will be thankful for any gifts!","favoriteBooksMoviesTVShows":""},
    //     {"id": "12", "name": "Addison",  "status": "new", "favoriteStores":"Sephora, Ulta, Target, Lulu Lemon","favoriteRestaurants":"Texas Roadhouse, Ninfas, Olive Garden","favoriteFoods":"Lindor Chocolate, Pocky’s, Takis, Gummies","hobbies":"Volleyball, Basketball, Track, Cheer","favoriteBooksMoviesTVShows":"Hunger Games, The Summer I Turned Pretty, Holiday Movies (I don’t like books😂)","smells":"Coconut, Vanilla, Warm Scents, Eucalyptus, Body Scrubs, Body Butters, Skin Care","allergies":"None","notes":"I like pink, girly stuff, comfy clothes/fuzzy socks, skincare, self-care, makeup, trending items, jewelry (gold and silver)","links":"N/A"},
    //     {"id": "13", "name": "Grayson",  "status": "new", "favoriteStores":"Barnes and Noble, Target, Ulta","favoriteRestaurants":"Texas Roadhouse, Pappadeaux, Ninfa’s, Olive Garden","favoriteFoods":"Starbucks","hobbies":"Reading, TikTok, working out","favoriteBooksMoviesTVShows":"Fantasy/Dystopian books, Gilmore girls, Glee, Anne with an E","smells":"Eucalyptus, peppermint, anything Bath and Body Works","allergies":"Food and Drinks, fuzzy socks, body scrubs/lotion, candles, blanket","links":"N/A","notes":"Barnes and Noble gift card ;)"},
    //     {"id": "14", "name": "Emerson",  "status": "new", "favoriteStores":"Kendra Scott, Ulta, Sephora, Target, Lululemon (in order)","favoriteRestaurants":"Texas Roadhouse, Olive Garden, Ninfas, Chuys","favoriteFoods":"Starbucks","hobbies":"TikTok, working out, crafting, watching phone/TV","favoriteBooksMoviesTVShows":"Hunger Games, Twilight, Harry Potter, Home Alone, Elf","smells":"Almond/Vanilla/Pistachio, Pumpkin Spice","allergies":"Food and Drinks, Fuzzy socks, body wash/scrubs/candles","notes":"I love gift cards and things from the heart!!"},
    //     {"id": "15", "name": "James",    "status": "new", "favoriteStores":"Brookshires, Academy","favoriteRestaurants":"El Conquistador ","favoriteFoods":"Hickory Farms sausage and cheese "},
    //     {"id": "16", "name": "Andrew",   "status": "new", "favoriteStores":"Home depot, harbor freight, bass pro shop","favoriteRestaurants":"Texas roadhouse, CFA","favoriteFoods":"Skittles","hobbies":"Woodworking","allergies":"N/a","smells":"Zamboni exhaust","favoriteBooksMoviesTVShows":"The office, Narcos, South park"}
    // ])

    // const [data, setData] = useState
    // ({
    //     "Branson":{"data":{"done":true,"favoriteStores":"Amazon, Lowes","favoriteRestaurants":"Sushi, chick fil a, subway, jersey mikes","notes":"FitKicks, hoodies, I collect lizard decorations to hang on the wall","favoriteFoods":"Sparkling Water, Coffee, Sushi","smells":"Eucalyptus, menthol, mint ","hobbies":"Programming, rocket league, grilling, teaching, board games with dev, outside toys with Lewis","favoriteBooksMoviesTVShows":"Non fiction, biographies, (also interested in your book recommendations) "}},
    //     "Margaret":{"data":{"favoriteStores":"Amazon, HEB","favoriteRestaurants":"El Con, Casa de Castillo","favoriteFoods":"Almonds, popcorn, dark chocolate","hobbies":"Reading, word puzzles, Sudoku","favoriteBooksMoviesTVShows":"Grisham, legal thrillers/mysteries","smells":"Citrus, essential oils","allergies":"Rap music, slow jazz","links":"None","notes":"Photos of family. Car wash. Time w/family. Birdseed.postage stamps. Clear fingernail polish.","done":true}},
    //     "Mabry":{"data":{"favoriteStores":"Recycled Books (gift certificates are available on their site), Kroger, Aldi, Sprouts, HEB ","favoriteFoods":"Natures Bakery Brownies, cheddar Chex mix, H‑E‑B baked chips (original and sour cream & onion), basically anything crunchy/carby","hobbies":"Listening to records/Vinyl collecting, hiking, board games, sourdough baking","favoriteRestaurants":"Uber eats, Cava, Panda Express, canes, Chick-fil-A, Dominos, in-n-out","favoriteBooksMoviesTVShows":"Golden girls","smells":"Natural scents; citrus, peppermint, apple, lavender","allergies":"I don’t need anymore fuzzy socks, tea, or mugs","links":"https://www.amazon.com/hz/wishlist/ls/3PYA48U09PIYY?ref_=wl_share\n\n*** None of the items on my list are brand specific, so if you find a better deal on something similar go for it!!!\n\nTop wants \n- compost bins\n-tea kettle\n-water filter","notes":"I love a lot of local small Denton businesses so cash to support those is always appreciated. I’m a big fan of low waste/more sustainable choices when available.","done":true}},
    //     "Devon":{"data":{"done":true,"favoriteStores":"Target,madewell, Kirklands, home goods, Amazon, Lowe’s ","favoriteRestaurants":"Black rifle coffee, Starbucks, shogun, longhorn, newks, cfa","hobbies":"Baking, family activities, Groupon dates ","smells":"None","allergies":"Dislike Lotions, candles, socks, mugs ","notes":"Board games (2 player)\nDecorations or gift cards for new house\nTeacher supplies - erasable red pen, expo markers, binder clips ","favoriteFoods":"Chocolate covered almonds, Coffee pods,  kind breakfast bars, healthy snacks ","favoriteBooksMoviesTVShows":"New morning mercies - I lost my copy :(","links":"https://www.amazon.com/hz/wishlist/ls/1AJ65ZJQT1W5Y?ref_=wl_share"}},
    //     "Deanne":{"data":{"favoriteStores":"Hobby Lobby or Target","favoriteRestaurants":"Texas Roadhouse or Pappadeaux’s","favoriteFoods":"Popcorn (sea salt or lightly salted); Torani’s sugar-free peach syrup for drinks","hobbies":"Photography","smells":"Anything vanilla or cinnamon","allergies":"No candles; no allergies","favoriteBooksMoviesTVShows":"None","done":true}},
    //     "Denny":{"data":{"favoriteStores":"Buc-ee’s; Starbucks; Sam’s Club; Amazon; Kohl’s; Mission","favoriteRestaurants":"P.F. Changs; El Conquistador; Clem Mikeska’s; Pappasitos","favoriteFoods":"*No sugar* — Cheeses; hot sauces; fudge; vegetable chips; salsa; jerky — *No sugar*","hobbies":"New Mexico chile ristras; novel hot sauce bottles;","smells":"Neutrogena Hydro Boost body gel cream fragrance-free; Van Der Hagen Shave Butter; Cremo Cooling Shave Cream Refreshing Mint","favoriteBooksMoviesTVShows":"Rick Bayless Frontera; Rick Bayless Mexico One Plate at a Time","allergies":"Sweets; Sugary items","notes":"Thank you. ❤️","done":true}},
    //     "Chandler":{"data":{"favoriteStores":"Amazon, Hobby Lobby, Academy, Sephora, Ulta, Target","favoriteRestaurants":"Longhorn Steakhouse, Olive Garden, Panera Bread, Chick-fil-A, Chipotle, Whataburger","favoriteFoods":"Cheez-its, Jalapeño Chips, Fruit Snacks, Twizzlers","hobbies":"Circuit Crafting, Diamond Dot Art, Sewing, Painting Nails","favoriteBooksMoviesTVShows":"Mystery Books, Comedy TV Show or Movies","smells":"Vanilla, Mint/Peppermint, Coconut, Mahogany","allergies":"Tree Nut Allergy","notes":"Love craft supplies and winter accessories, no color preferences","done":true}},
    //     "Melisa":{"data":{"favoriteStores":"Kohls, JC Penney, Ulta, Hobby Lobby, Sprouts, Lowes","favoriteRestaurants":"Chipotle, Five Guys, Lupe Tortilla","favoriteFoods":"Avocados, Sweet Potatoes, Water, Raw Unsalted Sun Flower Seeds, CocoJune Vanilla Yogurt, Granny Smith Apples, Fresh Okra","hobbies":"Gardening, cooking, music, board games, home decor, filing feet","favoriteBooksMoviesTVShows":"Joke books, riddles, Devotions, Game Shows, Call the Midwife, All Creatures Great and Small","smells":"Essential oils or soaps: Lime, Coconut, Peppermint. Lotions: No.7 Advanced, Cereve (fragrance-free), Feels: 100% cotton sweaters, long sleeve shirts, soft beige blanket","allergies":"Gluten, scented lotions, spicy foods, fruity candy","links":"100% cotton ladies' size large mock turtlenecks, tweezers, foot files, beige or white hot pads, beige or white small kitchen towels (washcloth size), 22x22 beige or ivory pillow covers","notes":"I love handwritten notes. I like plants, flowers, flower seeds. I always cherish our family time and look forward to seeing everyone and getting surprises!! :)","done":true}},
    //     "Brinley":{"data":{"favoriteStores":"target, home goods, bath and body works, ulta","favoriteRestaurants":"chick fil a, canes, jersey mikes","favoriteFoods":"mexican, italian, popcorn","hobbies":"crafting, reading, winston","favoriteBooksMoviesTVShows":"n/a","smells":"vanilla, clean smells, cool textures","done":true}},
    //     "Brad":{"data":{"favoriteStores":"Academy, Lowes, Home Depot","favoriteRestaurants":"Longhorn, Texas Roadhouse, Olive Garden","favoriteFoods":"Cookies, Jalapeno Chips, Mixed Nuts","hobbies":"Hunting, Sports, Concerts","favoriteBooksMoviesTVShows":"Sci-Fi, Non-Fiction novels. Comedies for TV/movies","smells":"Whatever Chandler would like.","allergies":"No allergies. Indifferent on likes/dislikes.","done":true}},
    //     "Carl":{"data":{"favoriteStores":"Wild birds unlimited\nLowes\nHEB\nWild Fork","favoriteRestaurants":"Chipotle \nSteak ","favoriteFoods":"Any non-chocolate candy\nNuts\nFruits\nSparkling waters","hobbies":"Cars\nGardening \nBirds","allergies":"Chocolate candy \nRaisins","notes":"I will be thankful for any gifts!","favoriteBooksMoviesTVShows":"","done":true}},
    //     "Addison":{"data":{"favoriteStores":"Sephora, Ulta, Target, Lulu Lemon","favoriteRestaurants":"Texas Roadhouse, Ninfas, Olive Garden","favoriteFoods":"Lindor Chocolate, Pocky’s, Takis, Gummies","hobbies":"Volleyball, Basketball, Track, Cheer","favoriteBooksMoviesTVShows":"Hunger Games, The Summer I Turned Pretty, Holiday Movies (I don’t like books😂)","smells":"Coconut, Vanilla, Warm Scents, Eucalyptus, Body Scrubs, Body Butters, Skin Care","allergies":"None","notes":"I like pink, girly stuff, comfy clothes/fuzzy socks, skincare, self-care, makeup, trending items, jewelry (gold and silver)","links":"N/A","done":true}},
    //     "Grayson":{"data":{"favoriteStores":"Barnes and Noble, Target, Ulta","favoriteRestaurants":"Texas Roadhouse, Pappadeaux, Ninfa’s, Olive Garden","favoriteFoods":"Starbucks","hobbies":"Reading, TikTok, working out","favoriteBooksMoviesTVShows":"Fantasy/Dystopian books, Gilmore girls, Glee, Anne with an E","smells":"Eucalyptus, peppermint, anything Bath and Body Works","allergies":"Food and Drinks, fuzzy socks, body scrubs/lotion, candles, blanket","links":"N/A","notes":"Barnes and Noble gift card ;)","done":true}},
    //     "Emerson":{"data":{"favoriteStores":"Kendra Scott, Ulta, Sephora, Target, Lululemon (in order)","favoriteRestaurants":"Texas Roadhouse, Olive Garden, Ninfas, Chuys","favoriteFoods":"Starbucks","hobbies":"TikTok, working out, crafting, watching phone/TV","favoriteBooksMoviesTVShows":"Hunger Games, Twilight, Harry Potter, Home Alone, Elf","smells":"Almond/Vanilla/Pistachio, Pumpkin Spice","allergies":"Food and Drinks, Fuzzy socks, body wash/scrubs/candles","notes":"I love gift cards and things from the heart!!","done":true}},
    //     "James":{"data":{"favoriteStores":"Brookshires, Academy","favoriteRestaurants":"El Conquistador ","favoriteFoods":"Hickory Farms sausage and cheese ","done":true}},
    //     "Andrew":{"data":{"favoriteStores":"Home depot, harbor freight, bass pro shop","favoriteRestaurants":"Texas roadhouse, CFA","favoriteFoods":"Skittles","hobbies":"Woodworking","allergies":"N/a","smells":"Zamboni exhaust","favoriteBooksMoviesTVShows":"The office, Narcos, South park","done":true}}
    // })

    useEffect(() => {
        window.scrollTo(0, 0);
            // const retrieveDynamoData = async () => {
            //     setLoading(true)
            //     try {
            //         const response = await fetch(lambdaUrl, {
            //             method: 'GET',
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             }
            //         })
            //         if (!response.ok) {
            //             throw new Error(`HTTP error! Status: ${response.status}`);
            //         }
            //         const dynamoData = await response.json();
            //         setData(dynamoData)
            //         setLoading(false)
            //     } catch (error) {
            //         console.error('Error retrieving data:', error.message);
            //     }
            // }
            // retrieveDynamoData()
    }, [showForm])

    async function updateDynamoData() {
        console.log('updating data...')
        console.log(selectedPersonName)
        const forDynamo = JSON.stringify(data);
        try {
            const response = await fetch(lambdaUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'person': selectedPersonName
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

    const oddBorder = '#cc2222';
    const evenBorder = '#22cc22';
    function getBorder(i) {
        if (i % 2 === 0) return evenBorder;
        return oddBorder;
    }

    return <div className="text-white">
        <Helmet>
            <title>Christmas Lists</title>
            <meta name="description" content="Family Christmas Lists 2024." />
            <link rel="canonical" href={`https://www.bransonsmith.dev/santa`} />
        </Helmet>
        <h1 className="border-b-2 border-red-500 text-3xl text-green-500" onClick={() => unselectPerson()}>Christmas Lists 2024</h1>
        { loading && <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> }
        { showForm && selectedPerson
        ? <div className="w-full flex flex-row">
            <button className="border-2 shadow-lg shadow-black py-4 fixed bottom-2 m-auto left-[10vw] text-lg bg-green-900 rounded-lg text-red-600 text-bold border-white w-[80vw]" onClick={() => unselectPerson()}>Back to all people</button>
        </div>
        : <></>
        }
        { !showForm 
        ? <div> 
            <h3 className="my-4 mb-5">Who are you shopping for?</h3>
            <p className="text-sm text-gray-500 my-2 p-0">Click on a name view secret santa preferences.</p>
            <ul>
                {Object.keys(data).sort().map((personName, i) => {
                    return <li key={i} style={{borderColor: getBorder(i) }} className="flex cursor-pointer hover:bg-green-900 flex-row py-2 px-4 w-[90%] my-2 rounded shadow-black bg-contentBg border-2 font-bold" onClick={() => choosePerson(data[personName], personName)}>
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
        {/* { showForm && selectedPerson && <SecretSantaForm name={selectedPersonName} data={data} updateData={updateData} back={unselectPerson}/> } */}
    </div>

}
