import { useEffect, useState } from 'react';
import ObjectService from '../GingerbreadCompetition/Services/ObjectService';
import ParticipantList from '../GingerbreadCompetition/Components/ParticipantList';
import TeamsList from '../GingerbreadCompetition/Components/TeamsList';

export default function Gingerbreadshowtime() {

    const competitionStates = [
        'Set Up', 'Ready to Start', 
        'In Progress', 'Complete', 'Ready to Vote', 'Voting Complete'
    ] 
    const [competitionState, setCompetitionState] = useState(competitionStates[0]);
    const [allPeople, setAllPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showtime, setShowtime] = useState(null);
    const [message, setMessage] = useState(null);
    const [numTeams, setNumTeams] = useState(4);

// Big Picture Flow
// Only 1 GB_showtime object ever exists. id = 1.
// Reset Button | "Set Up" | all GB_Names set to participating: true, given colors, saved in GB_showtime object.
//                           participant.team set to null. showtime.teams list = []. showtime.startTime = null.
// In set up phase, participants can be toggled, and number of teams is specified.
// Assign Teams Button | "Assign Teams" | showtime.teams list is populated with team objects.
//                          participant.team is set to team object.
// Start Button | "Ready to Start" | showtime.startTime is set to current time.
    useEffect(() => {
        ObjectService.getAll('GB_Showtime').then((response) => {
            if (!response.data || response.data.length === 0) {
                console.error("no showtime found");
                setMessage("Competition has not started yet.");
                setLoading(false);
                return
            }
            setShowtime(response.data[0]);
            setAllPeople(response.data[0].participants);
            setLoading(false);
        }).catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);

    const assignTeams = async () => {
        var colors = [
            { name: 'Red',      primary: '#45131b', secondary: '#4b0a10' },
            { name: 'Green',    primary: '#0e2e0e', secondary: '#005404' },
            { name: 'Gold',     primary: '#edb76b', secondary: '#f7d89c' },
            { name: 'Silver',   primary: '#babab3', secondary: '#d7d7c3' },
            { name: 'Blue',     primary: '#3e9cfa', secondary: '#91beeb' },
            { name: 'Orange',   primary: '#B42D1A', secondary: '#de5440' },
            { name: 'Brown',    primary: '#422116', secondary: '#592f21' },
            { name: 'Purple',   primary: '#3b1a47', secondary: '#5a3780' },
        ]
        const participants = allPeople.filter(person => person.participating);
        const shuffledParticipants = participants.sort(() => Math.random() - 0.5);
        const teams = [];
        for (let i = 0; i < numTeams; i++) {
            const team = {
                id: i,
                members: [],
                colorName: colors[i].name,
                colorPrimary: colors[i].primary,
                colorSecondary: colors[i].secondary,
                vantages: [],
                notes: []
            }
            teams.push(team);
        }
        shuffledParticipants.forEach((person, index) => {
            const teamIndex = index % numTeams;
            const team = teams[teamIndex];
            person.team = team.id;
            team.members.push(person);
        });

        const newShowtimeObject = {
            ...showtime,
            teams: teams,
            competitionState: competitionStates[1]
        }
        ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
            setCompetitionState(competitionStates[1]);
            setShowtime(newShowtimeObject);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const resetCompetition = async () => {
        ObjectService.getAll('GB_Names').then((response) => {
            setCompetitionState(competitionStates[0]);
            const participatingPeople = response.data.map(person => {
                return { 
                    ...person, 
                    participating: true, 
                    background: getRandomChristmasGradient(),
                    team: null
                };
            });
            setAllPeople(participatingPeople);
            var newShowtimeObject = {
                id: '1',
                teams: [],
                startTime: null,
                participants: participatingPeople,
                competitionState: competitionStates[0]
            }
            setShowtime(newShowtimeObject);
            ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
                setLoading(false);
            }).catch((error) => {
                console.error('Error:', error);
                setLoading(false);
            });
        }).catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });

    }

    const toggleParticipation = (person) => {
        const updatedPerson = { ...person, participating: !person.participating };
        const updatedPeople = allPeople.map((p) => {
            if (p.id === person.id) {
                return updatedPerson;
            }
            return p;
        });
        setAllPeople(updatedPeople);
    }

    const getRandomChristmasGradient = () => {
        const christmasColors =[ 
            '#cca843', '#edb76b', '#f7d89c', 
            '#0e2e0e', '#003404', '#004404', '#025a0a', '#0e2e0e', '#003404', '#004404', '#025a0a',
            '#45131b', '#6b0a10', '#a00d0d', '#d40d0d', '#45131b', '#6b0a10', '#a00d0d', '#d40d0d',
            '#babab3', '#d0d0c0', '#e6e6d6', '#f7f7f0', '#ffffff'
        ];

        function randomChristmasColor() {
           return christmasColors[Math.floor(Math.random() * christmasColors.length)]
        }
        return `linear-gradient(45deg, ${randomChristmasColor()}, ${randomChristmasColor()})`;
    }

    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex flex-row">
                <h1>Gingerbread showtime</h1>
                <button className="bg-pokerRed h-fit w-fit ml-auto my-auto" onClick={resetCompetition}>Reset</button>
            </div>
            <h2>{competitionState}</h2>
            { competitionState === 'Set Up' && (

                <span>
                { showtime && showtime.participants &&
                    <span>
                        <ParticipantList people={allPeople} toggleParticipation={toggleParticipation} manageable={true} />
                        
                        <div className="flex flex-col w-full items-center">
                            <label className="mr-auto">Number of Teams</label>
                            <input className="mr-auto" type="number" value={numTeams} onChange={(e) => setNumTeams(e.target.value)} />
                        </div>

                        <button className="mt-8 mr-auto" onClick={assignTeams}>Assign Teams</button>
                    </span>
                }
                    
                </span>

            )}

            { competitionState === 'Ready to Start' && (

            <span>
            { showtime && showtime.teams &&
                <span>
                    <TeamsList teams={showtime.teams} />

                    <button className="mt-8 mr-auto" onClick={() => {}}>Start!</button>
                </span>
            }
                
            </span>

            )}
            { message && <p>{message}</p> }
        </div>
    );
}