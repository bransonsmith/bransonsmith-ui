import { useState } from "react";
import TeamPage from "./TeamsPage";
import { names } from "../Data/Names";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

// create random teams from names
// Add space between names
function createTeams(names, teamCount) {
    const shuffledNames = [...names];
    shuffleArray(shuffledNames);
    const teams = [];
    for (let i = 0; i < teamCount; i++) {
        //console.log(shuffledNames.slice(i * names.length / teamCount, (i + 1) * names.length / teamCount))
        teams.push(shuffledNames.slice(i * names.length / teamCount, (i + 1) * names.length / teamCount));
    }
    return teams;
  }


function TeamSelector() {
    const [teamCount, setTeamCount] = useState(0); // State to store selected number of teams
    const [selected, setSelected] = useState(null);
    const [availableNumbers, setAvailableNumbers] = useState([4, 5, 6]);

  const handleTeamSelect = (e) => {
      const value = Number(e.target.value);
      //console.log(e)
      setTeamCount(value); // Update team count when a button is clicked
      setSelected(value);
      setAvailableNumbers([value]);
  };
  const resetSelction = () => {
    setTeamCount(0);
      setSelected(null);
      setAvailableNumbers([4, 5, 6]);
  };


    
  const renderTeams = () => {
    if (teamCount === 0) return null; // No teams selected yet

    return (
      <div className="team-grid">
        {Array.from({ length: teamCount }).map((_, index) => (
          <div key={index} className="team-card">
                <h2>Team {index + 1}</h2>
                <TeamPage names={createTeams(names, teamCount)[index]} />
            {/* Add additional team card details here */}
          </div>
        ))}
      </div>
    );
  };

  return (
      <div>
          <p></p>
      <h3>Teams of:</h3>
      <div className="flex-row bp-item grid gap-2 grid-cols-3">
        {availableNumbers.map((num) => (
          <button
            key={num}
            value={num}
            onClick={handleTeamSelect}
            disabled={selected === num}
                className={`flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-lg" 
                ${selected === num ? "bg-red-400 border-white" : ""}`}
          >
            <span className="flex-col breath">{num}</span>
          </button>
        ))}
          </div>
          {teamCount > 0 && (
            <button
                className="flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-sm"
                onClick={resetSelction}>
            Reset
            </button>


      )}


      {renderTeams()}
    </div>
  );
}

export default TeamSelector;