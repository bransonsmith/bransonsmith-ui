import PokerCard from './PokerCard';
import { useState, useEffect } from 'react';

export default function TumblingCard ({start}) {

    const [rank, setRank] = useState(null);
    const [suit, setSuit] = useState(null);

    const rollCard = () => {
        var suitRoll = Math.floor(Math.random() * 4);
        var rankRoll = Math.floor(Math.random() * 13);

        const suits = ['h', 'd', 's', 'c'];
        const ranks = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];


        setRank(ranks[rankRoll]);
        setSuit(suits[suitRoll]);
    }

    useEffect(() => {
        setTimeout(() => {
            rollCard();
        }, 3000);


    }, []);

    return (<>
        { start === 0 &&
            <div className="card-animation">
                <PokerCard suit={suit} value={rank}/>
            </div>
        }
        { start === 1 &&
            <div className="card-animation2">
                <PokerCard suit={suit} value={rank}/>
            </div>
        }
    </>
    );
  };