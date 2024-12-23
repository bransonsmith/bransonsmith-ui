import { useState } from 'react';
import PositionMarker from './PositionMarker';
import EditIcon from '../../../icons/EditIcon';
import SaveIcon from '../../../icons/SaveIcon';

export default function PositionsPicker({ playerId, gameState, setGameState }) {

    const [showOptions, setShowOptions] = useState(false);

    const togglePosition = (position) => {
        const player = gameState.players.find(player => player.id === playerId);
        
        const newPositions = [...player.positions];
        if (player.positions.includes(position)) {
            newPositions.splice(newPositions.indexOf(position), 1);
        } else {
            newPositions.push(position);
        }
        
        const newPlayer = {...player};
        newPlayer.positions = newPositions;

        const newPlayers = gameState.players.map(p => p.id === playerId ? newPlayer : p);
        setGameState({...gameState, players: newPlayers});
    }

    const availablePositions = () => {
        let pos = [ "SB", "BB", "D" ];
        let remainingPositions = gameState.playersAtTable - 2;
        for (let i = 0; i < remainingPositions; i++) {
            if (i === 0) {
                pos.push("UTG");
            } else if (i === remainingPositions - 1) {
                pos.push("CO");
            }
            else {
                pos.push("UTG+ " + i);
            }
        }
        return pos
    }

    return <div className="flex flex-row w-full gap-1">
       
        { showOptions 
        ? <div className="flex flex-row gap-1 flex-wrap">
            <div className="cursor-pointer rounded-full px-[8px] py-[0px] border-2 border-neutral-400 text-neutral-400" 
                onClick={() => setShowOptions(!showOptions)}>
                ^
            </div>
            { availablePositions().map((position, index) => (
                <PositionMarker key={index} position={position} 
                    isSelected={gameState.players.find(p => p.id === playerId).positions.includes(position)} 
                    onClick={() => togglePosition(position)}
                />
            ))}
        </div>
        : <div className="flex flex-row gap-1 flex-wrap">
            <div className="cursor-pointer rounded-full px-[8px] py-[0px] border-2 border-neutral-400 text-neutral-400" 
                onClick={() => setShowOptions(!showOptions)}>
                v
            </div>
            {gameState.players.find(p => p.id === playerId).positions.map((position, index) => (
                <PositionMarker key={index} position={position} 
                    isSelected={gameState.players.find(p => p.id === playerId).positions.includes(position)}
                    onClick={() => togglePosition(position)}
                />
            ))}
        </div>
        }
    </div>

}
