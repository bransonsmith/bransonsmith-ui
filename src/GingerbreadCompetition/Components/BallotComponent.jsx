import { useState } from 'react';

const BallotComponent = ({ showtime }) => {
    const [selectedParticipant, setSelectedParticipant] = useState('');
    const [votes, setVotes] = useState({});
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    const handleVoteChange = (categoryId, categoryName, teamName) => {
        setVotes({
            ...votes,
            [categoryId]: { categoryId, categoryName, teamName }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const ballot = {
            id: createId(),
            name: selectedParticipant,
            votes: Object.values(votes)
        };
        // console.log(JSON.stringify(ballot, null, 2));
    };

    function createId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    return (<span>
        { loading
            ? <div className="w-full flex">
                <Loading />
                <div className="text-gray-500 font-bold m-auto"> Loading Items </div>
            </div>
            : <span> 
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
                    {showtime.participants.map((participant) => (
                        <option key={participant.id} value={participant.name}>
                            {participant.name}
                        </option>
                    ))}
                </select>
            </div>

            {showtime.categories.map((category) => (
                <div key={category.id}>
                    <label htmlFor={`category-${category.id}`}>{category.name}</label>
                    <select
                        id={`category-${category.id}`}
                        value={votes[category.id]?.teamName || ''}
                        onChange={(e) => handleVoteChange(category.id, category.name, e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select a team</option>
                        {showtime.teams.map((team) => (
                            <option key={team.id} value={team.name}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                Submit Ballot
            </button>
        </form>
        </span>}
        { toastMessage &&
            <span className="w-11/12 fixed bottom-4 ml-1 cursor-pointer" onClick={() => setToastMessage(null)}>
            { toastMessage.error 
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
        </span>
    );
};

export default BallotComponent;