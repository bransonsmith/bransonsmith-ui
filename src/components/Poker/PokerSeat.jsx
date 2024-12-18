
import PokerCard from './PokerCard'
import PositionMarker from './PositionMarker'

export default function PokerSeat({ name, stack, bet, status, positions, cards }) {

    return <div className="border p-2 rounded-md w-48 flex flex-col">

        <div className="flex flex-row w-full flex-wrap gap-2">
            {name && <div className="font-bold">{name}</div>}
            <div className="flex flex-row gap-1 ml-auto">
                {positions.map((position, index) => (
                    <PositionMarker key={index} position={position} isSelected={true} />
                ))}
            </div>
        </div>

        <div className="mt-2">
            {bet > 0 && <div className="border-2 border-yellow-800 text-slate-300 font-bold rounded-lg px-2 py-1 w-fit mx-auto my-2 px-3">{bet} BB</div>}
            {status && <div className="bg-gray-700 text-gray-300 font-bold rounded-xl px-2 py-1 w-24 mx-auto h-fit text-center">{status}</div>}
        </div>

        <div className="flex flex-row gap-2 mt-2 mx-auto">
            {cards && cards.length > 0 ? (
                cards.map((card, index) => (
                    <PokerCard key={index} suit={card.suit} value={card.value} />
                ))
            ) : (
                <div className="text-gray-500">No Cards</div>
            )}
        </div>

        
        {stack && (
            <div className="flex items-center text-gray-500 p-2 pb-0 font-bold text-lg rounded-lg mr-auto h-fit text-center">
                <span className="mr-1">^</span>
                {stack} BB
            </div>
        )}

    </div>
}