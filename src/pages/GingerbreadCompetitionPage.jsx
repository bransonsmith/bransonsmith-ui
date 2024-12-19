import { Helmet } from 'react-helmet';
import TeamSelector from "../GingerbreadCompetition/Components/TeamSelector";
import { useEffect, useState } from 'react';
import ObjectService from '../GingerbreadCompetition/Services/ObjectService';
import ParticipantList from '../GingerbreadCompetition/Components/ParticipantList';
import TeamsList from '../GingerbreadCompetition/Components/TeamsList';
import VotingResults from '../GingerbreadCompetition/Components/VotingResults';


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

    const navigateToBallotPage = () => {
        window.location.href = '/gbballot';
    }

    return (
        <div className="GingerbreadCompetitionPage">
        <Helmet>
            <title> Gingerbread Competition</title>
        </Helmet>
        <h1 className="title">Gingerbread Competition</h1>
            <div className="description">
                {/* <InputNames teamList={teamList} setTeamList={setTeamList} /> */}
                {/* <TeamSelector names={teamList}/> */}
                {showtime && showtime.competitionState &&
                    <h2>Phase: {showtime.competitionState}</h2>
                }
                {showtime && showtime.competitionState === 'Set Up' &&
                    <h4 className="mb-4">Hang tight, and make sure you're on the list! If not, tell Aughtney, Preston, or Branson.</h4>
                }
                {showtime && showtime.competitionState === 'Ready to Start' &&
                    <h4 className="mb-4">Teams have been assigned! Listen to Aughtney/Preston for instructions</h4>
                }
                {showtime && showtime.competitionState === 'In Progress' &&
                    <h4 className="mb-4">Get building!</h4>
                }
                {showtime && showtime.competitionState === 'Building Complete' &&
                    <h4 className="mb-4">Building has completed! Voting will start soon!</h4>
                }

                { showtime && showtime.participants && showtime.competitionState === 'Set Up' &&
                    <ParticipantList people={showtime.participants} toggleParticipation={() => {}} /> 
                }

                { showtime && showtime.participants && showtime.competitionState === 'Voting is Open' &&
                    <button className="w-full bg-red-950 text-green-900 text-lg border-2 border-green-700 my-5" onClick={navigateToBallotPage}>Click here to cast your votes!</button>
                }

                { showtime && showtime.participants && showtime.competitionState === 'Voting Complete' &&
                    <div className="text-gray-500">Voting has completed. The results are in. Waiting for competition organizer to share...</div>
                }

                { showtime && showtime.participants && showtime.competitionState === 'Voting Published' &&
                    <div>
                        <VotingResults />
                    </div>
                }

                { showtime && showtime.teams && showtime.competitionState !== 'Voting is Open' && showtime.competitionState !== 'Voting Complete' &&
                    <TeamsList teams={showtime.teams} showtime={showtime} />
                }

                { 
                    message && <p>{message}</p>
                }
                
            </div>
        </div>
    )

}


   

