import { useState } from "react";
import TeamPage from "./TeamsPage";

function TeamSelector() {
    const [teamCount, setTeamCount] = useState(0); // State to store selected number of teams
    const [selected, setSelected] = useState(null);

  const handleTeamSelect = (e) => {
      const value = Number(e.target.value);
      setTeamCount(value); // Update team count when a button is clicked
      setSelected(value);
  };
  const resetSelction = () => {
    setTeamCount(0);
    setSelected(null);
  };

  const renderTeams = () => {
    if (teamCount === 0) return null; // No teams selected yet

    return (
      <div className="team-grid">
        {Array.from({ length: teamCount }).map((_, index) => (
          <div key={index} className="team-card">
                <h2>Team {index + 1}</h2>
                <TeamPage value={index + 1} />
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
      <div className="flex-row bp-item">
        {[4, 5, 6].map((num) => (
          <button
            key={num}
            value={num}
            onClick={handleTeamSelect}
            disabled={selected === num}
                className={`flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-lg" 
                ${selected === num ? "bg-gray-400" : ""}`}
          >
            <span className="flex-col breath">{num}</span>
          </button>
        ))}
          </div>
          {teamCount > 0 && (
            <button
                className="flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-lg"
                onClick={resetSelction}>
            Reset
            </button>


      )}


      {renderTeams()}
    </div>
  );
}

export default TeamSelector;