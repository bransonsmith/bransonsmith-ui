import { useEffect, useState } from "react";
import SecretSantaForm from "../SecretSanta/SecretSantaForm";

export default function SecretSantaPage() {

    const [showForm, setShowForm] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedPersonName, setSelectedPersonName] = useState(null);
    const [data, setData] = useState(
        {
            "Branson Smith": { "data": {} },
            "Devon Smith": { "data": {} },
            "Melisa Smith": { "data": {} },
            "Carl Smith": { "data": {} },
            "Chandler Coplen": { "data": {} },
            "Brad Coplen": { "data": {} },
            "Mabry Smith": { "data": {} },
            "Brinley Starrantino": { "data": {} },
            "Andrew Starrantino": { "data": {} },
            "Denny Kramer": { "data": {} },
            "Deanne Kramer": { "data": {} },
            "Emerson Kramer": { "data": {} },
            "Grayson Kramer": { "data": {} },
            "Addison Kramer": { "data": {} },
            "James Seay": { "data": {} },
            "Margaret Kramer": { "data": {} }
          }
        );
    const lambdaUrl = 'https://wzo2t2vx5l7mgbwdihia5p37hi0hikkz.lambda-url.us-east-2.on.aws/';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(lambdaUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const resJson = await response.json();

                const secretSantaData = JSON.parse(resJson.dataValue);
                setData(secretSantaData)
            } catch (error) {
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
        const forDynamo = JSON.stringify(data);
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
        console.log('update dynamo')
    }

    const oddBorder = '#cc2222';
    const evenBorder = '#22cc22';
    function getBorder(i) {
        if (i % 2 === 0) return evenBorder;
        return oddBorder;
    }

    return <div className="text-white">
        <h1 className="border-b-2 border-red-500 text-3xl text-green-500" onClick={() => unselectPerson()}>Secret Santa 2023</h1>
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
                    return <li key={i} style={{borderColor: getBorder(i) }} className="flex flex-row py-2 px-4 w-64 rounded shadow-black bg-contentBg border-2 font-bold" onClick={() => choosePerson(data[personName], personName)}>
                        <div>{personName}</div>
                        { data[personName] && data[personName]['data'] && data[personName]['data']['done'] && 
                            <div className="text-gray-400 text-sm ml-3">(done)</div>
                        }
                    </li>
                })}
            </ul>
        </div>
        : <></>}

        { showForm && selectedPerson && <SecretSantaForm name={selectedPersonName} data={data} updateDynamo={updateDynamoData} updateData={updateData} back={unselectPerson}/> }
    </div>

}
