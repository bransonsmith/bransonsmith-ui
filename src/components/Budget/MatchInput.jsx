import { useState } from 'react';


export default function MatchInput(props) {

    const [matches, setMatches] = useState(props.matches);
    const showLabel = props.showLabel || false;
    
    const handleMatchChange = (index, value) => {
        const newMatches = [...matches];
        newMatches[index] = value;
        setMatches(newMatches);
        props.setMatches(newMatches);
    };

    const handleAddMatch = () => {
        setMatches([...matches, '']);
        props.setMatches([...matches, '']);
    };

    const handleRemoveMatch = (index) => {
        const newMatches = matches.filter((_, i) => i !== index);
        setMatches(newMatches);
        props.setMatches(newMatches);
    };
    
    return (
        <div>
            { showLabel && <label>Matches</label> }
            {matches.map((match, index) => (
                <div key={index} className="flex items-center">
                    <input 
                        type="text" 
                        value={match} 
                        onChange={(event) => handleMatchChange(index, event.target.value)} 
                        className="mr-2"
                    />
                    <button 
                        type="button" 
                        onClick={() => handleRemoveMatch(index)} 
                        className="bg-red-500 text-white px-2 py-1"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button 
                type="button" 
                onClick={handleAddMatch} 
                className="mt-2 bg-blue-500 text-white px-2 py-1"
            >
                Add Match
            </button>
        </div>
    )
}