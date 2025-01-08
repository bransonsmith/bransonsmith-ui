import { useEffect, useState } from 'react';
import TumblingCard from './TumblingCard';

export default function TumblingCardRow({localTime}) {

    const [showCardAnimation, setShowCardAnimation] = useState(false);
    const [showCardAnimation2, setShowCardAnimation2] = useState(false);
    const [lastAnimationTime, setLastAnimationTime] = useState(null);
    
    const minMillisecondsBetweenAnimations = 8000;
    const animationRatio = 50;

    useEffect(() => {
        let timer = setInterval(() => {}, 1000);
        potentiallyRunAnimation();
        return () => clearInterval(timer);
    }, [localTime]);

    const potentiallyRunAnimation = () => {
        if (lastAnimationTime === null || (new Date() - lastAnimationTime) > minMillisecondsBetweenAnimations) {
            var diceRoll = Math.floor(Math.random() * animationRatio);
            if (diceRoll === 1) {
                animateCards();
            }
        }
    }

    const animateCards = () => {
        setShowCardAnimation(true);
        setLastAnimationTime(new Date());
        setTimeout(() => {
            setShowCardAnimation2(true);
        }, 100);

        setTimeout(() => {
            setShowCardAnimation(false);
        }, 4200);
        setTimeout(() => {
            setShowCardAnimation2(false);
        }, 4400);
    }

    return <div className="absolute w-10/12 h-fit">
        <div className="w-10/12 flex relative -top-48">
            { showCardAnimation && <>
                <TumblingCard start={0} />
            </>
            }
            { showCardAnimation2 && <>
                <TumblingCard start={1} />
            </>
            }
        </div>
    </div>
}