import { useState, useEffect } from 'react';
import CardPicker from './CardPicker';
import PokerCard from './PokerCard';
import PositionMarker from './PositionMarker';

export default function PlayerEditor({ player, availablePositions, onSave }) {
    const [name, setName] = useState(player.name || '');
    const [cards, setCards] = useState(player.cards || [{}, {}]);
    const [stack, setStack] = useState(player['stack (BB)'] || 100);
    const [positions, setPositions] = useState(player.positions || []);
    const [notes, setNotes] = useState(player.notes || '');
    const [showCardPicker, setShowCardPicker] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        onSave({ name, cards, 'stack (BB)': stack, positions, notes });
    }, [name, cards, stack, positions, notes]);

    const handleCardPicked = (card) => {
        const newCards = [...cards];
        newCards[selectedCardIndex] = card;
        setCards(newCards);
        setShowCardPicker(false);
    };

    const handlePositionChange = (position) => {
        setPositions((prevPositions) =>
            prevPositions.includes(position)
                ? prevPositions.filter((pos) => pos !== position)
                : [...prevPositions, position]
        );
    };

    return (
        <div className="p-2 py-4 bg-contentBg rounded-md w-full m-auto flex flex-col">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-xs ml-auto">
                {isCollapsed ? '▼' : '▲'}
            </button>
            {!isCollapsed && (
                <>
                <div className="flex justify-between items-center">
                    <div className="flex flex-row w-full mt-0">
                        <div className="flex flex-col w-1/2 mt-0">
                            <label className="mb-1 text-xs mt-0">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-1 rounded-md w-full text-xs"
                                disabled={isCollapsed}
                            />
                        </div>
                        <div className="flex flex-col w-3/12 ml-4">
                            <label className="mb-1 text-xs mt-0">Stack (BB)</label>
                            <input
                                type="number"
                                value={stack}
                                onChange={(e) => setStack(e.target.value)}
                                className="border p-1 rounded-md w-full text-xs"
                                disabled={isCollapsed}
                            />
                        </div>
                    </div>
                </div>
                    <div className="flex flex-row w-full mt-0">
                        <div className="mb-2 w-full">
                            <label className="mb-1 text-xs">Positions</label>
                            <div className="flex flex-row flex-wrap gap-1 w-full">
                                {availablePositions.map((position) => (
                                    <PositionMarker
                                        key={position}
                                        position={position}
                                        isSelected={positions.includes(position)}
                                        onClick={() => handlePositionChange(position)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mb-2 w-full">
                            <label className="mb-1 text-xs">Cards</label>
                            <div className="flex gap-1 w-1/2">
                                {cards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setSelectedCardIndex(index);
                                            setShowCardPicker(true);
                                        }}
                                    >
                                        <PokerCard suit={card.suit} value={card.value} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mb-2">
                        <label className="mb-1 text-xs mt-0">Notes</label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="border p-1 rounded-md w-full text-xs"
                        />
                    </div>
                    {showCardPicker && <CardPicker onCardPicked={handleCardPicked} onClose={() => setShowCardPicker(false)} />}
                </>
            )}
            {isCollapsed && (
                <div className="flex flex-row w-full mt-0">
                    <div className="w-7/12 flex flex-col">
                        <div className="flex flex-col w-full mt-0">
                            <span className="text-md font-bold">{name}</span>
                        </div>
                        
                        <div className="flex flex-row w-full gap-2">
                            <span className="text-md">{stack} BB</span>
                            <div className="flex flex-col w-1/2 mt-0">
                                <div className="flex flex-row flex-wrap gap-1">
                                    {positions.map((position, index) => (
                                        <PositionMarker key={index} position={position} isSelected={true} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col w-1/2 mt-0">
                        <div className="flex gap-1">
                            {cards.map((card, index) => (
                                <PokerCard key={index} suit={card.suit} value={card.value} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}