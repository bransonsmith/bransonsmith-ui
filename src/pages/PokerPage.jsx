
import PokerCard from '../components/Poker/PokerCard'
import PokerSeat from '../components/Poker/PokerSeat'
import PokerGame from '../components/Poker/PokerGame'

export default function PokerPage() {

    return <div className="">

        <h1>Poker</h1>

        <PokerGame />

        {/* <div className="flex flex-row w-96 flex-wrap gap-2">
            <PokerCard suit="s" value='13' />
            <PokerCard suit="c" value='12' />
        </div>

        <div className="flex flex-row w-96 flex-wrap gap-2">

            <PokerSeat 
                name="Player 3" 
                stack={200} 
                bet={20} 
                status="CALLED" 
                positions={["BB"]} 
                cards={[{ suit: 'd', value: '11' }, { suit: 's', value: '8' }]} 
            />
        </div> */}

    </div>
} 

