import { Helmet } from 'react-helmet';
import TeamSelector from "../GingerbreadCompetition/Pages/TeamSelector";
import { useState } from 'react';

function InputNames({teamList, setTeamList}) {
    const [names, setNames] = useState("");
    

    const handleNames = () => {
        if (names.trim() === "") return
        setTeamList([...teamList, names]);
        setNames("");
    }
    return (
        <div>
            <input type="text" placeholder="Name"
                value={names} onChange={(e) => setNames(e.target.value)}/>
            <button onClick={handleNames} className="mr-auto p-2 w-36 my-10 rounded">Submit</button>
            <div>
                <h3>Name List:</h3>
                <ul className="name-list grid grid-cols-6">
                {teamList.map((name, index) => (
                    <li key={index}>{name}</li>
                ))}
                </ul>

            </div>
                
        </div>
    )
}

export default function GingerbreadCompetitionPage() {
    const resetNameList = () => {
        setTeamList([]);
    }


    const [teamList, setTeamList] = useState([]);
        return (
            <div className="GingerbreadCompetitionPage">
            <Helmet>
            <title> Gingerbread Competition</title>
            </Helmet>
            <h1 className="title">Gingerbread Competition</h1>
                <div className="description">
                    <InputNames teamList={teamList} setTeamList={setTeamList} />
                    <button onClick={resetNameList} className="mr-auto p-2 w-36 my-10 rounded bg-red-400 text-white" >Reset Name</button>
                    <TeamSelector names={teamList}/>
                </div>
            
        </div>
    )

}


   

