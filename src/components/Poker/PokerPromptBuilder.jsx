
import { useEffect, useState } from 'react';
import GameStateInput from './Components/GameStateInput';
import GameInfoForm from './Components/GameInfoForm';
import BoardDisplay from './Components/BoardDisplay';
import PlayersDisplay from './Components/PlayersDisplay';
import EventsDisplay from './Components/EventsDisplay';
import Loading from '../Loading';

export default function PokerPromptBuilder() {

    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [gameState, setGameState] = useState({
        "playersAtTable": 9,
        "gameType": "Cash",
        "bigBlind": 1,
        "smallBlind": 0.5,
        "ante": 0,
        "pot": 0,
        "currentBet": 0,
        "notes": "",
        "players": [
            {
                "id": "1111111111",
                "name": "Hero",
                "positions": [ "D" ],
                "stack": 100,
                "cards": [ 
                    { "suit": null, "value": null }, 
                    { "suit": null, "value": null } 
                ],
                "notes": ""
            },
            {
                "id": "2222222222",
                "name": "Villain",
                "positions": [ "BB" ],
                "stack": 100,
                "cards": [ 
                    { "suit": null, "value": null }, 
                    { "suit": null, "value": null } 
                ],
                "notes": ""
            }
        ],
        "board": [
            { "suit": null, "value": null },
            { "suit": null, "value": null },
            { "suit": null, "value": null },
            { "suit": null, "value": null },
            { "suit": null, "value": null }
        ],
        "events": {
            "preflop": [],
            "flop": [],
            "turn": [],
            "river": []
        }
    });

    const cardValueString = (value) => {
        switch (value) {
            case '10': return "T";
            case '11': return "J";
            case '12': return "Q";
            case '13': return "K";
            case '14': return "A";
            case '1': return "A";
            case 10: return "T";
            case 11: return "J";
            case 12: return "Q";
            case 13: return "K";
            case 14: return "A";
            case 1: return "A";
            case null: return "?";
            default: return value;
        }
    }

    useEffect(() => {
        if (toastMessage && !toastMessage.error) {
            const originalMessage = toastMessage.message;
            const timer = setTimeout(() => {
                if (toastMessage && !toastMessage.error && toastMessage.message === originalMessage) {
                    setToastMessage(null);
                }
            }, 5000);
        }
    }, [toastMessage]);

    const generatePromptFromJson = () => {
        let prompt = `Analyze this ${gameState.gameType} game hand:\n`;
        prompt += `${gameState.playersAtTable} players, ${gameState.bigBlind}BB/${gameState.smallBlind}SB`;
        if (gameState.ante > 0) prompt += `, ${gameState.ante} ante`;
        
        // Add player info
        const players = gameState.players.map(p => {
            const cards = p.cards.every(c => c.value && c.suit) 
                ? `${p.cards.map(c => `${cardValueString(c.value)}${c.suit}`).join(' ')}`
                : '??';
            return `${p.name} (${p.positions.join('/')}), stack:${p.stack}, hand: ${cards}`.trim();
        }).join('\n');
        prompt += `\n${players}`;
    
        // Add board cards if any exist
        const boardCards = gameState.board
            .filter(c => c.value && c.suit)
            .map(c => `${cardValueString(c.value)}${c.suit}`)
            .join(' ');
        if (boardCards) prompt += `\nBoard: ${boardCards}`;
    
        // Add betting action by street
        const streets = ['preflop', 'flop', 'turn', 'river'];
        streets.forEach(street => {
            if (gameState.events[street].length > 0) {
                prompt += `\n\n${street.charAt(0).toUpperCase() + street.slice(1)}:`;
                gameState.events[street].forEach(event => {
                    let action = `\n${event.actor} ${event.action}`;
                    if (event.action === 'raise') action += ` ${event.amount}BB`;
                    prompt += action;
                });
            }
        });
    
        // Add any notes
        if (gameState.notes) prompt += `\n\nNotes: ${gameState.notes}`;
    
        prompt += '\n\n---\n';
        prompt += '\nProvide a concise analysis focused on key decision points and strategic considerations.';
        prompt += '\nPlease point out the origin of a mistake, like if something went wrong preflop, that should be the focus of advice rather than flop.';
        prompt += '\nConsider the actions of previous streets when analyzing a later street.';
        prompt += '\nAnalysis should be focused on the hand in question, not general poker strategy.';
        prompt += '\nYour response should be to the point, and only up to about 300 words.';
        prompt += '\nYour response should trigger thoughtful questions in the players mind to be self-critical in a productive way.';
        prompt += '\nYour response should open with a summary sentence, followed by an expected range for opponent with simple reasoning and similar for what opponents think about the Hero.';
        prompt += '\nAfter that, provide the rest of the analysis as described previously.';
        prompt += '\nConclude response with relevant odds related to decision-making in this spot.';
        
        return prompt;
    }

    const analyzeHand = async () => {
        const lambdaFunctionUrl = 'https://c4f7w5etspyvfhf72p74b3dnuu0jyqrp.lambda-url.us-east-1.on.aws/';
        setLoading(true);
        const prompt = generatePromptFromJson();
        console.log('prompt',prompt)
        try {
            const response = await fetch(lambdaFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "prompt": prompt,
                    "password": password
                })
            });
            if (!response.ok) {
                setLoading(false);
                const data = await response.json();

                var message = `status: ${response.status}, message: ${data.message || '?'}`;
                setToastMessage({ message: `Error analyzing hand. Tell Branson. ${message}`, error: true });
                return;
            } 
            const data = await response.json();
            console.log(data);
            setAnalysis(data.anthropicResponse);
            setLoading(false);
            setToastMessage({message: 'Analysis complete!', error: false});
        }
        catch (error) {
            console.error(error);
            setLoading(false);
            setToastMessage({ message: `Error analyzing hand. Tell Branson. ${error}`, error: true });
        }
    }
    
    return <div className="w-full flex flex-col ">

        <h1>Hand Analyzer</h1>
        
        <div className="text-sm text-gray-500 mb-6">
            Set up a hand-state for analysis.
            Enter players and events up to any point in the hand.
            Click <span className="text-accent-400">"Analyze"</span> button at the bottom when you're ready.
            <br/><span className="text-gray-400">Example:</span> analyze a tough decision on the flop: 
            <br/> - set the first 3 cards on the board
            <br/> - set up the preflop events
            <br/> - set up flop events up until the hard decision
            <br/> - <span className="text-accent-400">Click "Analyze"</span>
        </div>

        <GameInfoForm gameState={gameState} setGameState={setGameState} />
        <BoardDisplay gameState={gameState} setGameState={setGameState} />
        <PlayersDisplay gameState={gameState} setGameState={setGameState} />
        <EventsDisplay gameState={gameState} setGameState={setGameState} />

        <div className="mt-12">
            <label className="text-sm text-gray-500">Password</label>
            <input type="password" className="w-full p-2 border border-neutral-400 rounded-md" onChange={(e) => setPassword(e.target.value)} />
        </div>

        { (!password || password.length < 8) &&
            <button disabled className="mt-1 bg-neutral-700 border-2 border-neutral-500 text-neutral-400 text-lg"> Analyze (password required first ^)</button>
        }
        { loading &&
            <div className="flex flex-row w-fit p-3 bg-gray-900 text-lg rounded-lg font-bold text-gray-400 gap-4">
                <Loading />
                <div className="mx-6">
                    Analyzing... 
                </div>
            </div>
        }

        { password && password.length > 8 && !loading &&
        <button className="mt-1 bg-accent-400 text-defaultText text-lg border-2 border-defaultText"
            onClick={analyzeHand}> 
            Analyze 
        </button>
        }
        

        { analysis && <div className="mt-6 w-11/12 p-2">
            <h2>Analysis</h2>
            <div className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }}></div>
        </div>}

        { toastMessage &&
            <span className="w-11/12 fixed bottom-4 ml-1 cursor-pointer" onClick={() => setToastMessage(null)}>
            { toastMessage.error 
                ? <div className="w-full bg-red-950 text-red-600 p-4 flex flex-row border border-red-600">
                    <div className="mr-auto ml-1">{toastMessage.message}</div> 
                    <div className="font-bold text-2xl ml-auto mr-1">X</div> 
                </div> 
                : <div className="w-full bg-accent-900 text-accent-400 p-4 flex flex-row border border-accent-400">
                    <div className="mr-auto ml-1">{toastMessage.message}</div> 
                    <div className="font-bold text-2xl ml-auto mr-1">X</div> 
                </div> 
            }
            </span>
        }
    </div>
}
