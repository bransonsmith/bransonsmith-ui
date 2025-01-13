
import GameStateInput from './GameStateInput';

export default function GameInfoForm({ gameState, setGameState }) {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGameState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return <details open className="flex flex-col w-full">
        <summary className="font-bold text-sm">Game Info</summary>
        <div className="flex flex-row gap-4 w-full flex-wrap">
            <GameStateInput label="# Players" value={gameState.playersAtTable} name="playersAtTable" type="number" onChange={handleInputChange} />
            <GameStateInput label="Game Type" value={gameState.gameType} name="gameType" type="select" options={["Cash", "MTTournament", "Sit n Go"]} onChange={handleInputChange} />
            {/* <GameStateInput label="BB" value={gameState.bigBlind} name="bigBlind" type="number" onChange={handleInputChange} />
            <GameStateInput label="SB" value={gameState.smallBlind} name="smallBlind" type="number" onChange={handleInputChange} /> */}
            {/* <GameStateInput label="Ante" value={gameState.ante} name="ante" type="number" onChange={handleInputChange} /> */}
            <GameStateInput label="Notes" value={gameState.notes} name="notes" type="text" onChange={handleInputChange} wide={true}/>
        </div>
    </details>
}