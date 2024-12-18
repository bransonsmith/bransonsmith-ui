import React, { useState, useEffect } from 'react';
import CardPicker from './CardPicker';
import PokerCard from './PokerCard';

export default function StreetCardsForm({ street, addStreetCards, numCards }) {
    const [showCardPicker, setShowCardPicker] = useState(false);
    const [selectedCards, setSelectedCards] = useState(Array(numCards).fill({ suit: null, value: null }));

    useEffect(() => {
        setSelectedCards(Array(numCards).fill({ suit: null, value: null }));
    }, [numCards]);

    const handleCardPicked = (card, index) => {
        const newCards = [...selectedCards];
        newCards[index] = card;
        setSelectedCards(newCards);
        setShowCardPicker(false);
    };

    const handleAddStreetCards = () => {
        addStreetCards(street, selectedCards);
        setSelectedCards(Array(numCards).fill({ suit: null, value: null }));
    };

    return (
        <div className="flex flex-col gap-2 mt-4">
            <h4>{street} Cards</h4>
            <div className="flex gap-1">
                {selectedCards.map((card, index) => (
                    <div key={index} className="cursor-pointer" onClick={() => setShowCardPicker(index)}>
                        <PokerCard suit={card.suit} value={card.value} />
                    </div>
                ))}
            </div>
            {selectedCards.every(card => card.suit && card.value) && (
                <button
                    onClick={handleAddStreetCards}
                    className="bg-green-500 text-white p-1 rounded-md text-xs mt-2"
                >
                    Add {street} Cards
                </button>
            )}
            {showCardPicker !== false && (
                <CardPicker
                    onCardPicked={(card) => handleCardPicked(card, showCardPicker)}
                    onClose={() => setShowCardPicker(false)}
                />
            )}
        </div>
    );
}