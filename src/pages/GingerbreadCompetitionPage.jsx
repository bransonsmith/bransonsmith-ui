import { Helmet } from 'react-helmet';
import TeamSelector from "../GingerbreadCompetition/Components/TeamSelector";
import { useEffect, useState } from 'react';
import ObjectService from '../GingerbreadCompetition/Services/ObjectService';
import ParticipantList from '../GingerbreadCompetition/Components/ParticipantList';

export default function GingerbreadCompetitionPage() {

    const [loading, setLoading] = useState(true);
    const [showtime, setShowtime] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        ObjectService.getAll('GB_Showtime').then((response) => {
            if (!response.data || response.data.length === 0) {
                console.error("no showtime found");
                setMessage("Competition has not started yet.");
                setLoading(false);
                return
            }
            setShowtime(response.data[0]);
            setLoading(false);
        }).catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);

    return (
        <div className="GingerbreadCompetitionPage">
        <Helmet>
            <title> Gingerbread Competition</title>
        </Helmet>
        <h1 className="title">Gingerbread Competition</h1>
            <div className="description">
                {/* <InputNames teamList={teamList} setTeamList={setTeamList} /> */}
                {/* <TeamSelector names={teamList}/> */}
                { showtime && showtime.participants &&
                    <ParticipantList people={showtime.participants} toggleParticipation={() => {}} /> 
                }
                { 
                    message && <p>{message}</p>
                }
            </div>
        </div>
    )

}


   

