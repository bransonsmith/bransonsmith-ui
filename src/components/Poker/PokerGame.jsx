import { useState } from 'react';
import InitializeGameForm from './InitializeGameForm';
import PlayerEditor from './PlayerEditor';
import CardPicker from './CardPicker';
import PokerCard from './PokerCard';
import EventBuilder from './EventBuilder';

export default function PokerGame() {
    const [nextEvent, setNextEvent] = useState('Start Hand');
    const [currentEvent, setCurrentEvent] = useState('Set Up Hand');
    const [eventLog, setEventLog] = useState([]);
    const [eventStore, setEventStore] = useState([
        { name: 'Flop Dealt', order: 0, nameOnly: true },
        { name: 'Turn Dealt', order: 1, nameOnly: true },
        { name: 'River Dealt', order: 2, nameOnly: true }
    ]);
    const [showCardPicker, setShowCardPicker] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [editingEventIndex, setEditingEventIndex] = useState(null);

    const availablePositions = ['SB', 'BB', 'D', 'CO', '+5', '+4', '+3', '+2', '+1', 'UTG'];

    const [players, setPlayers] = useState([
        { 'name': 'Hero', 'cards': [{}, {}], 'stack (BB)': 100, 'positions': ['D'], 'notes': '' },
        { 'name': 'Villain', 'cards': [{}, {}], 'stack (BB)': 100, 'positions': ['BB'], 'notes': '' }
    ]);

    const [pot, setPot] = useState(1.5);
    const [gameNotes, setGameNotes] = useState('');
    const [playersAtTable, setPlayersAtTable] = useState(9);
    const [gameType, setGameType] = useState('Cash'); // Sit-n-go, MTTournament (for tournaments other players, stacks, and player count become relevant to analysis)
    const [board, setBoard] = useState(Array(5).fill({ suit: null, value: null }));

    const handleSave = (index, updatedPlayer) => {
        const newPlayers = [...players];
        newPlayers[index] = updatedPlayer;
        setPlayers(newPlayers);
    };

    const addNewPlayer = () => {
        const newPlayer = { 'name': '', 'cards': [{}, {}], 'stack (BB)': 100, 'positions': [], 'notes': '' };
        setPlayers([...players, newPlayer]);
    };

    const removePlayer = (index) => {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
    };

    const addEvent = (playerName, action, amount, potBefore) => {
        const newEvent = { playerName, action, amount, stage: 'Build Hand', potBefore, order: eventStore.length };
        if (editingEventIndex !== null) {
            const newEventStore = [...eventStore];
            newEventStore[editingEventIndex] = newEvent;
            setEventStore(newEventStore);
            setEditingEventIndex(null);
        } else {
            setEventStore([...eventStore, newEvent]);
        }
        if (amount) {
            const updatedPlayers = players.map(player => {
                if (player.name === playerName) {
                    return { ...player, 'stack (BB)': player['stack (BB)'] - parseFloat(amount) };
                }
                return player;
            });
            setPlayers(updatedPlayers);
            setPot(pot + parseFloat(amount));
        }
    };

    const handleCardPicked = (card) => {
        const newBoard = [...board];
        newBoard[selectedCardIndex] = card;
        setBoard(newBoard);
        setShowCardPicker(false);
    };

    const addNextStreetEvent = () => {
        setEventStore([...eventStore, { playerName: 'System', action: 'Next Street', amount: '', stage: 'Build Hand', potBefore: pot, order: eventStore.length }]);
    };

    const editEvent = (index) => {
        setEditingEventIndex(index);
    };

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="p-2 bg-contentBg h-fit w-full rounded-md">
                Hand Builder
            </div>

            <div className="p-2 bg-contentBg h-fit w-full flex flex-col gap-3 rounded-md">
                <InitializeGameForm
                    playersAtTable={playersAtTable}
                    setPlayersAtTable={setPlayersAtTable}
                    gameType={gameType}
                    setGameType={setGameType}
                    gameNotes={gameNotes}
                    setGameNotes={setGameNotes}
                    players={players}
                    availablePositions={availablePositions}
                    handleSave={handleSave}
                    addNewPlayer={addNewPlayer}
                />

                <div className="flex flex-wrap gap-2">
                    {players.map((player, index) => (
                        <div key={index} className="border p-2 rounded-md w-5/6 flex flex-col">
                            <div className="font-bold">{player.name}</div>
                            <div>Stack: {player['stack (BB)']} BB</div>
                            <div>Positions: {player.positions.join(', ')}</div>
                            <div className="flex gap-1">
                                {player.cards.map((card, cardIndex) => (
                                    <PokerCard key={cardIndex} suit={card.suit} value={card.value} />
                                ))}
                            </div>
                            <button onClick={() => removePlayer(index)} className="bg-red-500 text-white p-1 rounded-md text-xs mt-2">
                                Remove Player
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-1 mt-4">
                    {board.map((card, index) => (
                        <div key={index} className="cursor-pointer" onClick={() => {
                            setSelectedCardIndex(index);
                            setShowCardPicker(true);
                        }}>
                            <PokerCard suit={card.suit} value={card.value} />
                        </div>
                    ))}
                </div>

                {showCardPicker && (
                    <CardPicker
                        onCardPicked={handleCardPicked}
                        onClose={() => setShowCardPicker(false)}
                    />
                )}

                <div className="flex flex-col gap-2 mt-4">
                    <h4>Events</h4>
                    {eventStore.map((event, index) => (
                        <div key={index} className="flex flex-row gap-2 border p-2 rounded-md mb-2">
                            <span className="w-1/3">{event.nameOnly ? event.name : event.playerName}</span>
                            {!event.nameOnly && (
                                <>
                                    <span className="w-1/5">{event.action}</span>
                                    <span className="w-1/5">{event.amount}</span>
                                    <span className="w-1/5">{event.potBefore}</span>
                                    <button onClick={() => editEvent(index)} className="bg-yellow-500 text-white p-1 rounded-md text-xs">
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <EventBuilder
                    players={players}
                    addEvent={addEvent}
                    potBefore={pot}
                    preselectedPlayer={editingEventIndex !== null ? eventStore[editingEventIndex].playerName : undefined}
                    toCall={0} // Adjust this value as needed
                />

                <button onClick={addNextStreetEvent} className="bg-blue-500 text-white p-1 rounded-md text-xs mt-2">
                    Next Street
                </button>
            </div>
        </div>
    );
}