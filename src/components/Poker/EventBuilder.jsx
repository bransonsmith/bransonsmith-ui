import React, { useState, useEffect } from 'react';

export default function EventBuilder({ players, addEvent, potBefore, preselectedPlayer, toCall }) {
    const [playerName, setPlayerName] = useState(preselectedPlayer || players[0]?.name || '');
    const [action, setAction] = useState(toCall === 0 ? 'check' : 'call');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (preselectedPlayer) {
            setPlayerName(preselectedPlayer);
        }
    }, [preselectedPlayer]);

    const handleAddEvent = () => {
        addEvent(playerName, action, amount, potBefore);
        setAmount('');
    };

    return (
        <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-row w-full gap-1">
                <div className="text-xs font-bold text-gray-500 w-1/3">
                    Player
                </div>
                <div className="text-xs font-bold text-gray-500 w-1/5">
                    Action
                </div>
                <div className="text-xs font-bold text-gray-500 w-1/5">
                    Amount
                </div>
                <div className="text-xs font-bold text-gray-500 w-1/5">
                    Pot Before
                </div>
            </div>
            <div className="flex flex-row w-full gap-1">
                <select
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="border p-1 rounded-md text-xs w-1/3"
                >
                    {players.map((player, index) => (
                        <option key={index} value={player.name}>
                            {player.name} ({player.positions.join(', ')})
                        </option>
                    ))}
                </select>
                <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="border p-1 rounded-md text-xs w-1/5"
                >
                    <option value="check">Check</option>
                    <option value="call">Call</option>
                    <option value="raise to">Raise To</option>
                    <option value="fold">Fold</option>
                </select>
                {(action === 'raise to' || action === 'call') ? (
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="(BB)"
                        className="border p-1 rounded-md text-xs w-1/5"
                    />
                ) : (
                    <div className="text-xs w-1/5 text-center">-</div>
                )}
                <div className="p-1 rounded-md text-xs w-1/5">
                    {potBefore}
                </div>
                <button
                    onClick={handleAddEvent}
                    className="bg-blue-500 text-white p-1 rounded-md text-xs w-1/12"
                >
                    +
                </button>
            </div>
        </div>
    );
}