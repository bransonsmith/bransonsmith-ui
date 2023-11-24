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
            "Chandler Copland": { "data": {} },
            "Mabry Smith": { "data": {} },
            "Brinley Starrantino": { "data": {} },
            "Andrew Starrantino": { "data": {} },
            "Brad Copland": { "data": {} },
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
    }

    return <div>
        <h1>Secret Santa 2023</h1>
        { showForm && selectedPerson
        ? <button className="border-2 border-defaultText fixed bottom-2" onClick={() => unselectPerson()}>Back to all people</button>
        : <></>
        }


        { !showForm 
        ? <div> 
            <h3>Who are you filling out preferences for? </h3>
            <ul>
                {Object.keys(data).map((personName, i) => {
                    return <li key={i} className="flex flex-row py-2 px-4 w-64 rounded shadow-black bg-contentBg border-2 border-gray-800" onClick={() => choosePerson(data[personName], personName)}>
                        <div>{personName}</div>
                        { data[personName] && data[personName]['done'] && <div className="text-gray-400 text-sm ml-3">(done)</div>}
                    </li>
                })}
            </ul>
        </div>
        : <></>}

        { showForm && selectedPerson && <SecretSantaForm name={selectedPersonName} data={selectedPerson.data} updateDynamo={updateDynamoData} /> }
    </div>

}
