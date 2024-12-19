import React, { useEffect, useState } from 'react';
import ObjectService from '../GingerbreadCompetition/Services/ObjectService';

const GbBallotPage = () => {
    const [loading, setLoading] = useState(true);
    const [showtime, setShowtime] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState('');
    const [votes, setVotes] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        ObjectService.getAll('GB_Showtime').then((response) => {
            if (!response.data || response.data.length === 0) {
                console.error("no showtime found");
                setMessage("Voting has not started.");
                setLoading(false);
                return;
            }
            setShowtime(response.data[0]);
            setLoading(false);
        }).catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);

    const handleVoteChange = (categoryId, categoryName, teamName) => {
        const existingVote = votes.find((vote) => vote.categoryId === categoryId);
        if (existingVote) {
            setVotes(votes.map((vote) => {
                if (vote.categoryId === categoryId) {
                    return {
                        categoryId,
                        categoryName,
                        teamName
                    };
                }
                return vote;
            }));
        }
        else {
            setVotes([...votes, { categoryId, categoryName, teamName }]);
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowForm(false);
        setLoading(true);
        const ballot = {
            id: selectedParticipant,
            votes: votes
        };

        ObjectService.create('GB_Votes', ballot).then(() => {
            setToastMessage({ message: 'Ballot submitted!', error: false });
            setSelectedParticipant('');
            setVotes([]);
            setLoading(false);
            setSubmitted(true);
            // setTimeout(() => {
            //     window.location.href = '/GingerBreadCompetition'
            // }, 5000);
        }).catch((error) => {
            console.error('Error:', error);
            setToastMessage({ message: `Error submitting ballot. Tell Branson, and prepare to vote on paper like the Luddite you are. || ${error}`, error: true });
        });

    };

    function createId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    if (loading) {
        <h1 className="title">Gingerbread Competition Voting</h1>
        return <div>Loading...</div>;
    }

    if (!showtime) {
        
        <h1 className="title">Gingerbread Competition Voting</h1>
        return <div>{message}</div>;
    }

    if (showtime && showtime.competitionState === 'Voting is Open' && showForm) {
        return (
            <div>
                <h1 className="title">Gingerbread Competition Voting</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="participant">Who are you?</label>
                        <select
                            id="participant"
                            value={selectedParticipant}
                            onChange={(e) => setSelectedParticipant(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select your name</option>
                            {showtime.participants.sort((a, b) => a.name.localeCompare(b.name)).map((participant) => (
                                <option key={participant.id} value={participant.name}>
                                    {participant.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {showtime.categories.map((category) => (
                        <div key={category.id}>
                            <label>{category.name}</label>
                            <select
                                id={category.id}
                                value={votes.find(v => v.categoryId === category.id)?.teamName || ''}
                                onChange={(e) => handleVoteChange(category.id, category.name, e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select a team</option>
                                {showtime.teams.map((team) => (
                                    <option key={team.id} value={team.colorName} style={{ background: team.colorPrimary, color: 'white' }}>
                                        {team.colorName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                        Submit Ballot
                    </button>
                </form>
                {toastMessage &&
                    <span className="w-11/12 fixed bottom-4 ml-1 cursor-pointer" onClick={() => setToastMessage(null)}>
                        {toastMessage.error 
                            ? <div className="w-full bg-red-950 text-red-600 p-4 flex flex-row border border-red-600">
                                <div className="mr-auto ml-1">{toastMessage.message}</div> 
                                <div className="font-bold text-2xl ml-auto mr-1">X</div> 
                            </div> 
                            : <div className="w-full bg-accent-900 text-accent-400 p-4 flex flex-row border border-accent-400">
                                <div className="mr-auto ml-1">{toastMessage.message}</div> 
                                <div className="font-bold text-2xl ml-auto mr-1">X</div> 
                            </div> 
                        }
                    </span>
                }
            </div>
        );
    }

    if (showtime.competitionState === 'Voting Complete') {
        
        <h1 className="title">Gingerbread Competition Voting</h1>
        return <div>Voting has completed.</div>;
    }

    
    return <span>
        <h1 className="title">Gingerbread Competition Voting</h1>
        { submitted ? <div>Ballot submitted. Thank you!</div>
            :<div>Can't vote right nwo.</div>
        }
        
    </span>
};

export default GbBallotPage;