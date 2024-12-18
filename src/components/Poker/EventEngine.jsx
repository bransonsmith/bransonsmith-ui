import React, { useState, useEffect } from 'react';
import EventBuilder from './EventBuilder';

export default function EventEngine({ players, gameState, eventStore, addEvent, pot, currentBet }) {
    const [nextPlayer, setNextPlayer] = useState('');

    useEffect(() => {
        determineNextPlayer();
    }, [eventStore, gameState]);

    const determineNextPlayer = () => {
        const positionsOrder = gameState === 'Pre-Flop'
            ? ['UTG', '+1', '+2', '+3', '+4', '+5', 'CO', 'D', 'SB', 'BB']
            : ['SB', 'BB', 'UTG', '+1', '+2', '+3', '+4', '+5', 'CO', 'D'];

        for (const position of positionsOrder) {
            const player = players.find(p => p.positions.includes(position));
            if (player && !eventStore.some(event => event.playerName === player.name && event.stage === gameState)) {
                setNextPlayer(player.name);
                return;
            }
        }

        setNextPlayer('');
    };

    return (
        <div>
            <h3>{gameState} Events</h3>
            <div className="flex flex-col gap-2 w-full">
                {eventStore
                    .filter(event => event.stage === gameState)
                    .map((event, index) => (
                        <div key={index} className="flex flex-row gap-2">
                            <span className="w-1/3">{event.playerName}</span>
                            <span className="w-1/5">{event.action}</span>
                            <span className="w-1/5">{event.amount}</span>
                            <span className="w-1/5">{event.potBefore}</span>
                        </div>
                    ))}
            </div>
            {nextPlayer && (
                <EventBuilder
                    players={players}
                    addEvent={addEvent}
                    potBefore={pot}
                    toCall={currentBet}
                    preselectedPlayer={nextPlayer}
                />
            )}
        </div>
    );
}