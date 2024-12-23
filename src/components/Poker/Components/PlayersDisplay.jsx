
import { useEffect, useState } from 'react';
import PlayerDisplay from './PlayerDisplay';

export default function PlayersDisplay({gameState, setGameState}) { 

    const AddPlayer = () => {
        const newPlayer = {
            "id": Math.random().toString(36).substring(7),
            "name": `Villain ${gameState.players.length}`,
            "positions": [ ],
            "stack": 100,
            "cards": [ 
                { "suit": null, "value": null }, 
                { "suit": null, "value": null } 
            ],
            "notes": ""
        }
        setGameState({...gameState, players: [...gameState.players, newPlayer]});
    }

    return <details open className="flex flex-col w-full my-5 m-auto">
        <summary className="text-sm font-bold mb-2">Players</summary>
        <div className="text-sm text-gray-500 mb-2">
            Add the players "relevant" to the hand.
            <br/>Click the 'v' icon to set a player's position.
            <br/>Set the known cards at the time you want to analyze.
        </div>
        <div className="flex flex-row w-full gap-4 ml-2 flex-wrap">
            {gameState.players.map((player, index) => (
                <div key={index} className="cursor-pointer">
                    <PlayerDisplay playerId={player.id} gameState={gameState} setGameState={setGameState} />
                </div>
            ))}
        </div>
        <button className="text-accent-500 p-2 w-fit rounded-md text-xs mt-2 cursor-pointer flex flex-row gap-2" 
            onClick={AddPlayer}> Add Player </button>
    </details>
}