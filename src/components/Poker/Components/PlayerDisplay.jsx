import { useState } from 'react'
import PositionMarker from './PositionMarker'
import PokerCard from './PokerCard'
import PositionsPicker from './PositionsPicker'
import CardPicker from './CardPicker';

export default function PlayerDisplay({playerId, gameState, setGameState}) {

    const player = gameState.players.find(player => player.id === playerId);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [showCardPicker, setShowCardPicker] = useState(false);

    const handleCardPicked = (card) => {
        const newCards = [...player.cards];
        newCards[selectedCardIndex] = card;
        const newPlayers = gameState.players.map(p => p.id === playerId ? {...p, cards: newCards} : p);
        setGameState({...gameState, players: newPlayers});
        setShowCardPicker(false);
    }

    const updateName = (name) => {
        const newPlayers = gameState.players.map(p => p.id === playerId ? {...p, name: name} : p);
        setGameState({...gameState, players: newPlayers});
    }

    return <div className="border p-2 rounded-md w-40 flex flex-col mx-auto">

        <div className="flex flex-col w-full flex-wrap gap-3">
            <div className="flex flex-row w-full flex-wrap gap-0">
                {player.name && 
                    <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updateName(e.target.value)}
                        className="border p-1 rounded-md w-8/12 text-xs"
                    />
                }
                {player.stack && (
                    <input
                        type="number"
                        value={player.stack}
                        onChange={(e) => setGameState({...gameState, players: gameState.players.map(p => p.id === playerId ? {...p, stack: e.target.value} : p)})}
                        className="border p-1 rounded-md ml-auto w-4/12 text-xs"
                    />
                )}
            </div>
            
            <div className="flex flex-row w-full gap-1 mr-auto">
                <PositionsPicker playerId={player.id} gameState={gameState} setGameState={setGameState} />
            </div>
        </div>

        {/* <div className="mt-2">
            <div className="bg-gray-700 flex flex-row gap-1 text-gray-300 font-bold rounded-xl px-2 py-1 w-24 mx-auto h-fit text-center content-center">
                <div className="mx-auto h-6">{player.status && player.status}</div>
                {player.bet > 0 && <div className="mx-auto">{player.bet}</div>}
            </div>
        </div> */}

        <div className="flex flex-row gap-2 mt-2 mx-auto">
            {player.cards.map((card, index) => (
                <div key={index} className="cursor-pointer" onClick={() => {
                    setSelectedCardIndex(index);
                    setShowCardPicker(true);
                }}>
                    <PokerCard suit={card.suit} value={card.value} />
                </div>
            ))}
            {showCardPicker &&
                <CardPicker onCardPicked={handleCardPicked} onClose={() => setShowCardPicker(false)} />
            }
        </div>

    </div>

}