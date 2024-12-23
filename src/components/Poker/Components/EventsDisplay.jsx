
import AddIcon from '../../../icons/AddIcon';

export default function EventsDisplay({gameState, setGameState}) { 

    const addEvent = (stage) => {
        const newEvent = {id: Math.random().toString(36).substring(7), actor: '', action: '', amount: 0, stage: stage};
        const newStreetEvents = gameState.events[stage]
        newStreetEvents.push(newEvent);

        const newEvents = {...gameState.events, [stage]: newStreetEvents};
        const newGameState = {...gameState};
        newGameState.events = newEvents;
        setGameState(newGameState);
    }

    return <details open className="flex flex-col w-full my-5 m-auto">
        <summary className="text-sm font-bold mb-2">Events</summary>
        <div className="flex flex-col w-full gap-1 ml-2 flex-wrap">
            <div className="text-sm text-gray-500 mt-2">Preflop</div>
            {gameState.events["preflop"].map((event, index) => (
                <div key={index} className="cursor-pointer">
                    <EventDisplay eventId={event.id} eventStreet='preflop' gameState={gameState} setGameState={setGameState} />
                </div>
            ))}
            <button className="text-accent-500 p-2 w-fit rounded-md text-xs mt-2 cursor-pointer flex flex-row gap-2" onClick={() => addEvent("preflop")}>
                <AddIcon />
                <div>Add Preflop Event</div>
            </button>
        </div>
        <div className="flex flex-col w-full gap-1 ml-2 flex-wrap">
            <div className="text-sm text-gray-500 mt-2">Flop</div>
            {gameState.events["flop"].map((event, index) => (
                <div key={index} className="cursor-pointer">
                    <EventDisplay eventId={event.id} eventStreet='flop' gameState={gameState} setGameState={setGameState} />
                </div>
            ))}
            <button className="text-accent-500 p-2 w-fit rounded-md text-xs mt-2 cursor-pointer flex flex-row gap-2" onClick={() => addEvent("flop")}>
                <AddIcon />
                <div>Add Flop Event</div>
            </button>
        </div>
        <div className="flex flex-col w-full gap-1 ml-2 flex-wrap">
            <div className="text-sm text-gray-500 mt-2">Turn</div>
            {gameState.events["turn"].map((event, index) => (
                <div key={index} className="cursor-pointer">
                    <EventDisplay eventId={event.id} eventStreet='turn' gameState={gameState} setGameState={setGameState} />
                </div>
            ))}
            <button className="text-accent-500 p-2 w-fit rounded-md text-xs mt-2 cursor-pointer flex flex-row gap-2" onClick={() => addEvent("turn")}>
                <AddIcon />
                <div>Add Turn Event</div>
            </button>
        </div>
        <div className="flex flex-col w-full gap-1 ml-2 flex-wrap">
            <div className="text-sm text-gray-500 mt-2">River</div>
            {gameState.events["river"].map((event, index) => (
                <div key={index} className="cursor-pointer">
                    <EventDisplay eventId={event.id} eventStreet='river' gameState={gameState} setGameState={setGameState} />
                </div>
            ))}
            <button className="text-accent-500 p-2 w-fit rounded-md text-xs mt-2 cursor-pointer flex flex-row gap-2" onClick={() => addEvent("river")}>
                <AddIcon />
                <div>Add River Event</div>
            </button>
        </div>


    </details>
}


function EventDisplay({eventId, eventStreet, gameState, setGameState}) {

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

    const usedPositions = () => {
        let used = []
        gameState.players.forEach(player => player.positions.forEach(pos => used.push(pos)));
        return used;
    }

    const unusedPositions = () => {
        return availablePositions().filter(pos => !(usedPositions().includes(pos)));
    }

    const listOfActors = () => {
        let playerActors = gameState.players.map(player => player.name);
        let allActors = playerActors
        allActors.push(...unusedPositions());
        return allActors
        
    }

    const selectEventActor = (actor) => {
        const newStreetEvents = gameState.events[eventStreet].map(e => e.id === eventId ? {...e, actor: actor} : e);
        const newEvents = {...gameState.events, [eventStreet]: newStreetEvents};
        setGameState({...gameState, events: newEvents});
    }

    const selectEventAction = (action) => {
        const newStreetEvents = gameState.events[eventStreet].map(e => e.id === eventId ? {...e, action: action} : e);
        const newEvents = {...gameState.events, [eventStreet]: newStreetEvents};
        setGameState({...gameState, events: newEvents});
    }

    const selectEventAmount = (amount) => {
        const newStreetEvents = gameState.events[eventStreet].map(e => e.id === eventId ? {...e, amount: amount} : e);
        const newEvents = {...gameState.events, [eventStreet]: newStreetEvents};
        setGameState({...gameState, events: newEvents});
    }

    return <div className="p-0 rounded-md w-full flex flex-row gap-1">

        <select 
            value={gameState.events[eventStreet].find(e => e.id === eventId).actor || ''}
            onChange={(e) => selectEventActor(e.target.value)}
            className="border p-1 rounded-md text-xs w-1/3"
        >
            <option value="">Actor</option>
            {listOfActors().map(actor => (
                <option key={actor} value={actor}>{actor}</option>
            ))}
        </select>

        <select
            value={gameState.events[eventStreet].find(e => e.id === eventId).action || ''}
            onChange={(e) => selectEventAction(e.target.value)}
            className="border p-1 rounded-md text-xs w-1/3"
        >
            <option value="">Action</option>
            <option value="fold">Folds</option>
            <option value="call">Calls</option>
            <option value="raise">Raises to</option>
            <option value="check">Checks</option>
        </select>

        {gameState.events[eventStreet].find(e => e.id === eventId).action === 'raise' &&
        <input
            type="number"
            value={gameState.events[eventStreet].find(e => e.id === eventId).amount || 0}
            onChange={(e) => selectEventAmount(e.target.value)}
            className="border p-1 rounded-md text-xs w-3/12"
        />}

    </div>
}