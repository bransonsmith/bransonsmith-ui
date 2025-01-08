import { useState, useEffect } from 'react';

export default function BlindSounds({timeToNextLevel}) {

    useEffect(() => {
        if (timeToNextLevel === 3) {
            playNextLevelSound();
        }
        if (timeToNextLevel === 60) {
            playOneMinuteToNextLevelSound();
        }
    }, [timeToNextLevel]);

    const playOneMinuteToNextLevelSound = () => {
        const audio = new Audio('/short-beep-tone-47916.mp3')
        const audio2 = new Audio('/short-beep-tone-47916.mp3')
        const audio3 = new Audio('/short-beep-tone-47916.mp3')
        audio.play();
        setTimeout(() => {
            audio2.play();
        }, 550);
        setTimeout(() => {
            audio3.play();
        }, 550 + 210);
    };
    
    const playNextLevelSound = () => {
        const audio = new Audio('/short-beep-countdown-81121.mp3')
        audio.play();
    };

    return <></>;
}