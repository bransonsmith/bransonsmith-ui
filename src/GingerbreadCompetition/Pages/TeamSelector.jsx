import { useState } from "react";
import TeamPage from "./TeamsPage";
import { names } from "../Data/Names";


//create a spot to input names for teams

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  
    return array;
  }

function createTeams(names, teamCount) {
    if (teamCount <= 0 || teamCount > names.length) { throw new Error("Invalid team count, Check to see if the team count is between 1 and the number of names"); }
    const shuffledNames = shuffleArray([...names]);
    const teams = Array.from({ length: teamCount }, () => []);
    shuffledNames.forEach((name, index) => {
        const teamIndex = index % teamCount;
        teams[teamIndex].push(name);
    })
    return teams;
  }


function TeamSelector({ names }) {
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
    const teams = createTeams(names, teamCount);
    return (
        <div className="team-grid">
            {teams.map((team, index) => (
                <div key={index} className="team-card">
                    <h2>Team {index + 1}</h2>
                    <TeamPage names={team} />
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