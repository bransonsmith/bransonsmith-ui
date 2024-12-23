import { useState } from 'react';
import PokerCard from './PokerCard';

const allCards = [
    { suit: null, value: null },
    { suit: 's', value: '1' }, { suit: 's', value: '2' }, { suit: 's', value: '3' }, { suit: 's', value: '4' }, { suit: 's', value: '5' }, { suit: 's', value: '6' }, { suit: 's', value: '7' }, { suit: 's', value: '8' }, { suit: 's', value: '9' }, { suit: 's', value: '10' }, { suit: 's', value: '11' }, { suit: 's', value: '12' }, { suit: 's', value: '13' },
    { suit: 'h', value: '1' }, { suit: 'h', value: '2' }, { suit: 'h', value: '3' }, { suit: 'h', value: '4' }, { suit: 'h', value: '5' }, { suit: 'h', value: '6' }, { suit: 'h', value: '7' }, { suit: 'h', value: '8' }, { suit: 'h', value: '9' }, { suit: 'h', value: '10' }, { suit: 'h', value: '11' }, { suit: 'h', value: '12' }, { suit: 'h', value: '13' },
    { suit: 'd', value: '1' }, { suit: 'd', value: '2' }, { suit: 'd', value: '3' }, { suit: 'd', value: '4' }, { suit: 'd', value: '5' }, { suit: 'd', value: '6' }, { suit: 'd', value: '7' }, { suit: 'd', value: '8' }, { suit: 'd', value: '9' }, { suit: 'd', value: '10' }, { suit: 'd', value: '11' }, { suit: 'd', value: '12' }, { suit: 'd', value: '13' },
    { suit: 'c', value: '1' }, { suit: 'c', value: '2' }, { suit: 'c', value: '3' }, { suit: 'c', value: '4' }, { suit: 'c', value: '5' }, { suit: 'c', value: '6' }, { suit: 'c', value: '7' }, { suit: 'c', value: '8' }, { suit: 'c', value: '9' }, { suit: 'c', value: '10' }, { suit: 'c', value: '11' }, { suit: 'c', value: '12' }, { suit: 'c', value: '13' },
    { suit: null, value: null }
];

const suitMap = {
    s: ['s', 'sp', 'spade', 'spades', '♠', '🂡'],
    h: ['h', 'he', 'heart', 'hearts', '♥', '🂱'],
    d: ['d', 'di', 'diamond', 'diamonds', '♦', '🃁'],
    c: ['c', 'cl', 'club', 'clubs', '♣', '🃑']
};

const valueMap = {
    '1': ['1', 'a', 'ace'],
    '2': ['2', 'two', 'deuce'],
    '3': ['3', 'three'],
    '4': ['4', 'four'],
    '5': ['5', 'five'],
    '6': ['6', 'six'],
    '7': ['7', 'seven'],
    '8': ['8', 'eight'],
    '9': ['9', 'nine'],
    '10': ['10', 't', 'ten'],
    '11': ['11', 'j', 'jack'],
    '12': ['12', 'q', 'queen', 'ladies'],
    '13': ['13', 'k', 'king', 'cowboys']
};

const valueNameMap = {
    '1': 'Ace',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
    '10': 'Ten',
    '11': 'Jack',
    '12': 'Queen',
    '13': 'King',
    '14': 'Ace',
};

const suitNameMap = {
    's': 'Spades',
    'h': 'Hearts',
    'd': 'Diamonds',
    'c': 'Clubs'
};

export default function CardPicker({ onCardPicked, onClose }) {
    const [search, setSearch] = useState('');

    const filterCards = () => {
        const lowerSearch = search.toLowerCase();
        if (!lowerSearch) return allCards;
        return allCards.filter(card => {
            if (!card.suit || !card.value) return false;
            const suitMatches = suitMap[card.suit].some(s => lowerSearch.includes(s));
            const valueMatches = valueMap[card.value].some(v => lowerSearch.includes(v));
            const name = `${valueNameMap[card.value]} of ${suitNameMap[card.suit]}`;
            const nameMatches = name.toLowerCase().includes(lowerSearch);
            return suitMatches || valueMatches || nameMatches;
        });
    };

    return (
        <div className="fixed inset-0 bg-defaultBg bg-opacity-95 flex flex-col w-screen border-4 rounded-lg border-defaultText p-3 h-64 top-1/3 justify-center z-50">
            
            <div className="flex flex-row gap-1">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search cards..."
                    className="border p-2 rounded-md w-10/12 mb-4"
                />
                <button onClick={onClose} className="w-1/12 text-gray-500 text-center ml-auto px-2 py-2 h-fit">X</button>
            </div>
            <div className="bg-contentBg p-2 rounded-md w-full h-48 overflow-scroll">
                <div className="flex flex-wrap gap-0">
                    {filterCards().map((card, index) => (
                        <div
                            key={index}
                            className="hover:outline hover:outline-2 hover:outline-blue-500 cursor-pointer"
                            onClick={() => onCardPicked(card)}
                        >
                            <PokerCard suit={card.suit} value={card.value} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}