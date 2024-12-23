import { useEffect, useState } from 'react';
import PokerCard from './PokerCard';
import CardPicker from './CardPicker';

export default function BoardDisplay({ gameState, setGameState }) {

    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [showCardPicker, setShowCardPicker] = useState(false);

    const handleCardPicked = (card) => {
        const newBoard = [...gameState.board];
        newBoard[selectedCardIndex] = card;
        setGameState((prevState) => ({
            ...prevState,
            board: newBoard
        }));
        setShowCardPicker(false);
    };

    return <div className="flex flex-col w-full my-5 m-auto">
        <div className="text-sm font-bold mb-2">Board</div>
        <div className="text-sm text-gray-500 mb-2">
            Tap cards to set them up to the point to want to analyze.
        </div>
        <div className="flex flex-row w-fit gap-2 ml-2">
            {gameState.board.map((card, index) => (
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