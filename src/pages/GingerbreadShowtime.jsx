import { useEffect, useState } from 'react';
import ObjectService from '../GingerbreadCompetition/Services/ObjectService';
import ParticipantList from '../GingerbreadCompetition/Components/ParticipantList';
import TeamsList from '../GingerbreadCompetition/Components/TeamsList';
import VotingResults from '../GingerbreadCompetition/Components/VotingResults';

export default function Gingerbreadshowtime() {

    const competitionStates = [
        'Set Up', 'Ready to Start', 'In Progress', 'Building Complete', 'Voting is Open', 'Voting Complete', 'Voting Published'
    ] 
    const [allPeople, setAllPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showtime, setShowtime] = useState(null);
    const [message, setMessage] = useState(null);
    const [numTeams, setNumTeams] = useState(4);

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

    const publishResults = async () => {
        const newShowtimeObject = {
            ...showtime,
            competitionState: 'Voting Published'
        }
        ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
            setShowtime(newShowtimeObject);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const closeVoting = async () => { 
        const newShowtimeObject = {
            ...showtime,
            competitionState: 'Voting Complete'
        }
        ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
            setShowtime(newShowtimeObject);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const openUpVoting = async () => {
        const newShowtimeObject = {
            ...showtime,
            competitionState: 'Voting is Open'
        }
        ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
            setShowtime(newShowtimeObject);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const completeCompetition = async () => {
        const newShowtimeObject = {
            ...showtime,
            competitionState: 'Building Complete'
        }
        ObjectService.update('GB_Showtime', newShowtimeObject).then((response) => {
            setShowtime(newShowtimeObject);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const startCompetition = async () => {
        const newShowtimeObject = {
            ...showtime,
            startTime: new Date().toISOString(),
            competitionState: 'In Progress'
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
                    { showAtMinute: 10, type: 'Style', name: shuffledStyles[styleIndex].name },
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

    const manualOverrideCompetitionState = async (newState) => {
        const newShowtimeObject = {
            ...showtime,
            competitionState: newState
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
            <h2>Phase: { (showtime && showtime.competitionState) ? showtime.competitionState : 'Set Up'}</h2>
            { !showtime || !showtime.competitionState || showtime.competitionState === 'Set Up' && (

                <span>
                    <div className="text-sm">Make sure everyone is on this list. To add, edit, remove people, go to <a href="/gbadmin">/gbadmin</a>.</div>
                    <div className="text-sm">  Then hit the "reset" button at the top of this page, to pull in the latest data.</div>
                    <div className="text-sm ">   Finally, let participants know to refresh their page to see updated list of names.</div>

                    <div className="w-full flex flex-row gap-2 mb-5">                            
                        <div className="flex flex-col w-5/12 items-center mr-auto">
                            <label className="mr-auto">Number of Teams</label>
                            <input className="mr-auto" type="number" value={numTeams} onChange={(e) => setNumTeams(e.target.value)} />
                        </div>
                        <button className="mt-8 ml-auto border-2 border-defaultText text-white w-1/3" onClick={assignTeams}>Assign Teams</button>
                    </div>

                    <span className="mt-4">
                    { showtime && showtime.participants &&
                        <span>
                            <ParticipantList people={allPeople} toggleParticipation={toggleParticipation} manageable={true} />

                        </span>
                    }
                        </span>
                </span>

            )}

            { showtime && showtime.competitionState === 'Ready to Start' && (

            <div className="w-full flex flex-col">
                
                <div className="w-full flex flex-row mb-4 gap-2">
                    <div className="text-sm">Teams have been assigned! Tell people to refresh their page to see them. Click the green button to start!</div>
                    <button className="mt-0 ml-auto mr-0 border-2 border-defaultText bg-green-900 m-auto py-4 px-8" onClick={startCompetition}>Start!</button>
                </div>
                { showtime && showtime.teams &&
                    <span>
                        <TeamsList teams={showtime.teams} showtime={showtime} />
                    </span>
                }
                
            </div>

            )}

            { showtime && showtime.competitionState === 'In Progress' && (

            <span>
                {showtime && showtime.showChallenges && 
                <div className="flex flex-col w-full mb-6">

                    <div className="flex flex-row w-full gap-2 mb-6">
                        <div className="text-sm">Competition is in Progress! Reveal challenges with checks below. When it's time to stop building hit the big yellow button!</div>
                        <button className="ml-auto mr-0 bg-yellow-300 text-red-900 border-2 border-red-950" onClick={completeCompetition}>Complete Competition!</button>
                    </div>

                    <div className="text-lg">Display Challenges: </div>
                    <div className="text-sm text-gray-500">Click these boxes to hide/reveal challenges for the teams. If the box is checked, they can refresh their page to see that challenge.</div>
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
                    </span>
                }
                
            </span>

            )}

            { showtime && showtime.competitionState === 'Building Complete' && (

                <span>
                    <div className="flex flex-row w-full gap-2 mb-6">
                        <div className="text-sm w-7/12">No more building. Take a deep breath. Explain how voting works, then hit the big blue button to open up the ballot box!</div>
                        <button className="ml-auto mr-0 bg-blue-300 text-neutral-100 border-2 border-neutral-300 w-1/3" onClick={openUpVoting}>Open up Voting!</button>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">Participants will be able to vote by clicking a button on the Gingerbread Competition page. They will have to refresh their page once you open up voting!</div>
                    { showtime && showtime.teams &&
                        <span>
                            <TeamsList teams={showtime.teams} showtime={showtime} />
                        </span>
                    }
                    
                </span>
    
            )}

            { showtime && showtime.competitionState === 'Voting is Open' && (

                <span>
                    <div className="flex flex-row w-full gap-2 mb-6">
                        <div className="text-sm w-7/12 text-gray-500">Participants can access a ballot at <a href="/gbballot">/gbballot</a> by clicking a button on the Gingerbread Competition page. They will have to refresh their page once you open up voting! When everyone has voted, click the big black button to close voting and see results!</div>
                        <button className="ml-auto mr-0 bg-black text-neutral-500 border-2 border-neutral-700 w-1/3" onClick={closeVoting}>Close Voting</button>
                    </div>
                    { showtime && showtime.teams &&
                        <span>
                            <TeamsList teams={showtime.teams} showtime={showtime} />
                        </span>
                    }
                    
                </span>
    
            )}

            { showtime && showtime.competitionState === 'Voting Complete' && (

                <span>
                    <div>The results are in...</div>
                    <div className="flex flex-row w-full gap-2 mb-6">
                        <div className="text-sm w-7/12 text-gray-500">Only you can see the results for now! You have immense power in this moment. Use it to build tension. Announce as you wish! Then when you're done, publish all results to all participants by clicking the pink button.</div>
                        <button className="ml-auto mr-0 bg-pink-800 text-pink-100 border-2 border-pink-500 w-1/3" onClick={publishResults}>Publish Voting Results</button>
                    </div>

                   <VotingResults />
                    { showtime && showtime.teams &&
                        <span>
                            <TeamsList teams={showtime.teams} showtime={showtime} />
                        </span>
                    }
                    
                </span>
    
            )}

            { showtime && showtime.competitionState === 'Voting Published' && (

                <span>
                    <div>Everyone can now refresh their page to see all results.</div>

                   <VotingResults />
                    { showtime && showtime.teams &&
                        <span>
                            <TeamsList teams={showtime.teams} showtime={showtime} />
                        </span>
                    }
                    
                </span>
    
            )}

            { message && <p>{message}</p> }


            <div className="flex w-full flex-col border-t-2 border-gray-600 mt-64">

                <div className="flex flex-row w-full gap-2 text-sm text-gray-600">
                    Use this to go back in time in case of emergency.
                    It's not really tested... but should be fine...
                </div>

                <label>Manually Set Competition State (use with caution)</label>
                <select className="w-full" value={showtime && showtime.competitionState || ''} onChange={(e) => {
                    manualOverrideCompetitionState(e.target.value);
                }}>
                    {competitionStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}