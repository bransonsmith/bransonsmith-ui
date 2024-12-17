import React from 'react';
import PlayerEditor from './PlayerEditor';

export default function InitializeGameForm({
    playersAtTable,
    setPlayersAtTable,
    gameType,
    setGameType,
    gameNotes,
    setGameNotes,
    players,
    availablePositions,
    handleSave,
    addNewPlayer
}) {
    return (
        <>
            <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col gap-2 w-1/6">
                    <label className="text-xs m-0"># Players:</label>
                    <input
                        type="number"
                        value={playersAtTable}
                        onChange={(e) => setPlayersAtTable(parseInt(e.target.value))}
                        className="border p-1 rounded-md text-xs"
                    />
                </div>
                <div className="flex flex-col gap-2 w-1/5">
                    <label className="text-xs m-0">Game Type:</label>
                    <select
                        value={gameType}
                        onChange={(e) => setGameType(e.target.value)}
                        className="border p-1 rounded-md text-xs"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Sit-n-go">Sit-n-go</option>
                        <option value="MTTournament">MTTournament</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2 w-7/12">
                    <label className="text-xs m-0">Game Notes:</label>
                    <input
                        type="text"
                        value={gameNotes}
                        onChange={(e) => setGameNotes(e.target.value)}
                        className="border p-1 rounded-md text-xs"
                    />
                </div>
            </div>

            {players.map((player, index) => (
                <PlayerEditor
                    key={index}
                    player={player}
                    availablePositions={availablePositions}
                    onSave={(updatedPlayer) => handleSave(index, updatedPlayer)}
                />
            ))}

            <button onClick={addNewPlayer} className="flex flex-row w-fit font-bold">+ Add Player To Hand</button>
        </>
    );
}