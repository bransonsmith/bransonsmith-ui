import { useEffect, useState } from 'react';
import ObjectService from '../GingerbreadCompetition/Services/ObjectService';
import ParticipantList from '../GingerbreadCompetition/Components/ParticipantList';
import TeamsList from '../GingerbreadCompetition/Components/TeamsList';

export default function Gingerbreadshowtime() {

    const competitionStates = [
        'Set Up', 'Ready to Start', 
        'In Progress', 'Complete', 'Ready to Vote', 'Voting Complete'
    ] 
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
            // console.log(response.data[0]);
            setAllPeople(response.data[0].participants);
            setLoading(false);
        }).catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });

    }, []);

    const startCompetition = async () => {
        const newShowtimeObject = {
            ...showtime,
            startTime: new Date().toISOString(),
            competitionState: competitionStates[2]
        }
        ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
            setShowtime(newShowtimeObject);
            window.scrollTo(0, 0);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const assignTeams = async () => {
        var colors = [
            { name: 'Red',      primary: '#45131b', secondary: '#8b0a10' },
            { name: 'Green',    primary: '#0e2e0e', secondary: '#006404' },
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

        const shuffledStyles = showtime.styles.sort(() => Math.random() - 0.5);
        const shuffledVantages = showtime.vantages.sort(() => Math.random() - 0.5);
        const shuffledItems = showtime.items.sort(() => Math.random() - 0.5);
        const shuffledFeatures = showtime.features.sort(() => Math.random() - 0.5);

        for (let i = 0; i < numTeams; i++) {

            const styleIndex = i % showtime.styles.length;
            const vantageIndex = i % showtime.vantages.length;
            const itemIndex = i % showtime.items.length;
            const featureIndex = i % showtime.features.length;

            const team = {
                id: i,
                members: [],
                colorName: colors[i].name,
                colorPrimary: colors[i].primary,
                colorSecondary: colors[i].secondary,
                challenges: [
                    { showAtMinute: 10,  type: 'Style', name: shuffledStyles[styleIndex].name },
                    { showAtMinute: 25, type: '(dis?)Advantage', name: shuffledVantages[vantageIndex].name },
                    { showAtMinute: 40, type: 'Item', name: shuffledItems[itemIndex].name },
                    { showAtMinute: 55, type: 'Feature', name: shuffledFeatures[featureIndex].name }
                ],
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
        // console.log(newShowtimeObject);
        ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
            setShowtime(newShowtimeObject);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const resetCompetition = async () => {
        
        ObjectService.getAll('GB_Categories').then((categoriesResponse) => {
        ObjectService.getAll('GB_Features').then((featuresResponse) => {
        ObjectService.getAll('GB_Items').then((itemsResponse) => {
        ObjectService.getAll('GB_Vantages').then((vantagesResponse) => {
        ObjectService.getAll('GB_Styles').then((stylesResponse) => {
            ObjectService.getAll('GB_Names').then((namesResponse) => {
                const participatingPeople = namesResponse.data.map(person => {
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
                    competitionState: competitionStates[0],
                    categories: categoriesResponse.data,
                    features: featuresResponse.data,
                    items: itemsResponse.data,
                    vantages: vantagesResponse.data,
                    styles: stylesResponse.data,
                    ballots: [],
                    showChallenges: {
                        'Style': false,
                        '(dis?)Advantage': false,
                        'Item': false,
                        'Feature': false,
                    }
                }
                setShowtime(newShowtimeObject);
                ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
                    setLoading(false);
                }).catch((error) => {
                    console.error('Error:', error);
                    setLoading(false);
                });
            }).catch((error) => { console.error('Error:', error); setLoading(false); });
        }).catch((error) => { console.error('Error:', error); setLoading(false);})
        }).catch((error) => { console.error('Error:', error); setLoading(false);})
        }).catch((error) => { console.error('Error:', error); setLoading(false);})
        }).catch((error) => { console.error('Error:', error); setLoading(false);})
        }).catch((error) => { console.error('Error:', error); setLoading(false);})

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

    const updateShowChallenge = async (challengeType) => {
        
        const newShowChallenges = {
            ...showtime.showChallenges,
            [challengeType]: !showtime.showChallenges[challengeType]
        }
        const newShowtimeObject = {
            ...showtime,
            showChallenges: newShowChallenges
        }
        ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
            setShowtime(newShowtimeObject);
        }).catch((error) => {
            console.error('Error:', error);
        });

    }

    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex flex-row">
                <h1>Gingerbread showtime</h1>
                <button className="bg-pokerRed h-fit w-fit ml-auto my-auto" onClick={resetCompetition}>Reset</button>
            </div>
            <h2>{ (showtime && showtime.competitionState) ? showtime.competitionState : 'Set Up'}</h2>
            { !showtime || !showtime.competitionState || showtime.competitionState === 'Set Up' && (

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

            { showtime && showtime.competitionState === 'Ready to Start' && (

            <span>
            { showtime && showtime.teams &&
                <span>
                    <TeamsList teams={showtime.teams} showtime={showtime} />

                    <button className="mt-8 mr-auto bg-green-900 m-auto py-4 px-8" onClick={startCompetition}>Start!</button>
                </span>
            }
                
            </span>

            )}

            { showtime && showtime.competitionState === 'In Progress' && (

            <span>
                {showtime && showtime.showChallenges && 
                <div className="flex flex-col w-full my-6">
                    <div>Display Challenges: </div>
                    {Object.keys(showtime.showChallenges).map((key) => (
                        <span key={key}>
                            <input type="checkbox" className="bg-contentBg" checked={showtime.showChallenges[key]} onChange={() => {updateShowChallenge(key)}} />
                            <label className="mx-2 font-bold text-lg">{key}</label>
                        </span>
                    ))}

                </div>
                }

                { showtime && showtime.teams &&
                    <span>
                        <TeamsList teams={showtime.teams} showtime={showtime} />

                        <button className="mt-8 mr-auto" onClick={() => {}}>Start!</button>
                    </span>
                }
                
            </span>

            )}

            { message && <p>{message}</p> }
        </div>
    );
}