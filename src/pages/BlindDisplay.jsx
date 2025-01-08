import React, { useState, useEffect } from 'react';
import TumblingCard from '../components/Poker/TumblingCard';

const BlindDisplay = () => {
    const [startTime, setStartTime] = useState(null);
    
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [lastPausedAt, setLastPausedAt] = useState(null);

    const [localTime, setLocalTime] = useState(new Date());

    const [lastSaveTime, setLastSaveTime] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showCardAnimation, setShowCardAnimation] = useState(false);
    const [showCardAnimation2, setShowCardAnimation2] = useState(false);
    const [lastAnimationTime, setLastAnimationTime] = useState(null);


    const levels = [
        { "Level": 1,  "SB": 10  , "BB": 20   , "Ante": 0, "StartSeconds": 0,     "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
        { "Level": 2,  "SB": 20  , "BB": 40   , "Ante": 0, "StartSeconds": 1200,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
        { "Level": 3,  "SB": 30  , "BB": 60   , "Ante": 0, "StartSeconds": 2400,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
        { "Level": 4,  "SB": 40  , "BB": 80   , "Ante": 0, "StartSeconds": 3600,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
        { "Level": 0,  "SB": '5 MIN BREAK', "BB": '', "Ante": 0, "StartSeconds": 4800,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": true },
        { "Level": 5,  "SB": 50  , "BB": 100  , "Ante": 0, "StartSeconds": 5100,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 6,  "SB": 70 ,  "BB": 140  , "Ante": 0, "StartSeconds": 6300,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 7,  "SB": 100 , "BB": 200  , "Ante": 0, "StartSeconds": 7500,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false, "removeChip": 'White' },
        { "Level": 8,  "SB": 150 , "BB": 300  , "Ante": 0, "StartSeconds": 8700,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 0,  "SB": '5 MIN BREAK', "BB": '', "Ante": 0, "StartSeconds": 9900,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false, "removeChip": 'Red' },
        { "Level": 9,  "SB": 250 , "BB": 500  , "Ante": 0, "StartSeconds": 10200,  "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 10, "SB": 350 , "BB": 700 , "Ante": 0, "StartSeconds": 11400, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 11, "SB": 500 , "BB": 1000 , "Ante": 0, "StartSeconds": 12600, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 12, "SB": 750,  "BB": 1500 , "Ante": 0, "StartSeconds": 13800, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 13, "SB": 1000, "BB": 2000 , "Ante": 0, "StartSeconds": 15000, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false, "removeChip": 'Green' },
        { "Level": 14, "SB": 2000, "BB": 4000 , "Ante": 0, "StartSeconds": 16200, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 15, "SB": 3000, "BB": 6000 , "Ante": 0, "StartSeconds": 17400, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
        { "Level": 16, "SB": 5000, "BB": 10000, "Ante": 0, "StartSeconds": 19800, "Rebuys": 0, "AddOns": 0, "RebuyAllowed": false },
    ];
    const [currentLevel, setCurrentLevel] = useState(levels[0]);
    const [nextLevel, setNextLevel] = useState(levels[1]);
    const [timeToNextLevel, setTimeToNextLevel] = useState(levels[1].StartSeconds - elapsedSeconds);

    const chips =[
        { 'name': 'White',  'color': '#e6e7e8', 'detail': '#0e1930', 'text': '#ffffff', 'value': 10    , numValue: 10    , 'quantity': 20 },
        { 'name': 'Red',    'color': '#6e091a', 'detail': '#d1cfcf', 'text': '#e6e7e8', 'value': 50    , numValue: 50    , 'quantity': 16 },
        { 'name': 'Black',  'color': '#080707', 'detail': '#d1cfcf', 'text': '#d1cfcf', 'value': 100   , numValue: 100   , 'quantity': 10 },
        { 'name': 'Green',  'color': '#336135', 'detail': '#d1cfcf', 'text': '#e6e7e8', 'value': 250   , numValue: 250   , 'quantity': 4  },
        { 'name': 'Blue',   'color': '#1a348a', 'detail': '#d1cfcf', 'text': '#e6e7e8', 'value': '1K'  , numValue: 1000  , 'quantity': 1  },
        { 'name': 'Pink',   'color': '#a883a3', 'detail': '#ffffff', 'text': '#ffffff', 'value': '2.5K', numValue: 2500  , 'quantity': 0  },
        { 'name': 'Yellow', 'color': '#e8dc72', 'detail': '#ffffff', 'text': '#ffffff', 'value': '5K'  , numValue: 5000  , 'quantity': 0  },
        { 'name': 'Brown',  'color': '#785e4e', 'detail': '#0d0b0a', 'text': '#ffffff', 'value': '10K' , numValue: 10000 , 'quantity': 0  },
    ]

    useEffect(() => {
        if (!loading) {
            let timer;
            if (startTime && !isPaused) {
                timer = setInterval(() => {
                    setElapsedSeconds(elapsedSeconds + 1);
                    setLocalTime(new Date());
                }, 1000);
                if (nextLevel && currentLevel) {
                    if (timeToNextLevel === 3) {
                        playNextLevelSound();
                    }
                    if (timeToNextLevel === 60) {
                        playOneMinuteToNextLevelSound();
                    }
                }
            } else {
                timer = setInterval(() => {
                    setLocalTime(new Date());
                }, 1000);
            }
            if (startTime) {
                setCurrentLevel(levels.filter(level => level.StartSeconds <= elapsedSeconds).reduce((max, level) => level.StartSeconds > max.StartSeconds ? level : max, levels[0]) || null)
                setNextLevel(elapsedSeconds > 0 ? levels.find(level => level.StartSeconds > (currentLevel.StartSeconds)) : levels[0])
                setTimeToNextLevel(nextLevel.StartSeconds - elapsedSeconds)
                potentiallyRunAnimation();
            }
    
            saveState();
            
            return () => clearInterval(timer);
        }
    }, [startTime, isPaused, localTime, loading]);

    useEffect(() => {
        setLoading(true);
        // loadState from localStorage
        const existingState = localStorage.getItem('bs-pokerBlinds');
        if (existingState) {
            
            const existingStateJson = JSON.parse(existingState);

            if (existingStateJson.startTimeString) {
                setStartTime(new Date(existingStateJson.startTimeString));
            }
            if (existingStateJson.lastPausedAtString) {
                setLastPausedAt(new Date(existingStateJson.lastPausedAtString));
            }
            if (existingStateJson.elapsedSeconds) {
                setElapsedSeconds(existingStateJson.elapsedSeconds);
            }
            if (existingStateJson.isPaused) {
                setIsPaused(true);
            }
        }
        else {
        }
        setLoading(false);
    }, []);

    const saveState = () => {
        if (startTime) {

            let startTimeString = startTime.toISOString();;
            let lastPausedAtString = new Date().toISOString();
    
            const state = {
                startTimeString,
                elapsedSeconds,
                isPaused: true,
                lastPausedAtString,
            }
            localStorage.setItem('bs-pokerBlinds', JSON.stringify(state));
        }
    }

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const trimFormatTime = (seconds) => {
        const formatted = formatTime(seconds);
        const trimHours = formatted.startsWith('0:') ? formatted.slice(2) : formatted;
        const trimMinutes = trimHours.startsWith('0') ? trimHours.slice(1) : trimHours;
        return trimMinutes;
    };

    const togglePause = () => {
        if (isPaused) {
            setLastPausedAt(null);
        } else {
            setLastPausedAt(new Date());
        }
        setIsPaused(!isPaused);
    };

    const endTournament = () => {
        localStorage.removeItem('bs-pokerBlinds');
        window.location.reload();
    };


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

    const potentiallyRunAnimation = () => {
        var diceRoll = Math.floor(Math.random() * 50);
        let diff = 0
        if (lastAnimationTime !== null) {
            diff = new Date() - lastAnimationTime;
        }
        if (lastAnimationTime === null || diff > 8000) {
            if (diceRoll === 11) {
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

    return (
        <div className="w-screen max-w-7xl mx-auto py-80">



            {isPaused &&
                    <span className="text-7xl bg-contentBg font-bold sticky left-1/3 top-1/3 text-error-700 mx-auto my-auto border-4 border-error-900 h-fit w-fit py-2 px-5">
                        PAUSED
                    </span>
                }
            <div className="flex flex-row mt-2 w-full flex-wrap mb-10 py-6 pb-2 border-b border-gray-700">
                <div className="flex flex-col mx-auto">
                    {/* <div className="my-auto text-2xl">Local Time:</div> */}
                    <div className="my-auto text-4xl font-bold"> {localTime.toLocaleTimeString()}</div>
                </div>

                {startTime && (
                    <div className="flex flex-col mx-auto">
                        {/* <div className="my-auto text-2xl">Play-Time Duration:</div> */}
                        <div className="flex flex-row gap-2">
                            <div className="my-auto text-3xl text-gray-400 font-bold">Play: {formatTime(elapsedSeconds)}</div>

                            { !isPaused && <button
                                className="border-2 border-gray-700 text-gray-400 bg-contentBg mt-2 px-3 ml-3 w-fit h-fit hover:bg-slate-950" 
                                onClick={togglePause}>
                                Pause
                                </button>
                            }
                            { isPaused && <button
                                className="border-2 border-accent-300 text-gray-400 bg-contentBg mt-2 px-3 ml-3 w-fit h-fit hover:bg-slate-950" 
                                onClick={togglePause}>
                                Resume
                                </button>
                            }

                        </div>
                        {/* <div className="my-auto text-2xl font-bold text-gray-500">Level {currentLevel.Level}</div> */}
                    </div>
                )}

                {startTime && (
                    <div className="flex flex-col mx-auto">
                        <div className="flex flex-row gap-x-2 gap-y-0 py-0 mt-auto">
                            <div className="my-auto text-xl font-bold text-gray-600"> Start: {startTime.toLocaleTimeString()}</div>
                            <button className="border-2 border-gray-700 text-gray-400 bg-contentBg mt-0 px-3 ml-3 w-fit h-fit hover:bg-red-900" onClick={endTournament}>
                                Delete Tournament
                            </button>
                        </div>
                    </div>
                )}
            <button className="sticky top-2 right-2 py-0 px-4 w-fit h-fit" onClick={animateCards}> Cards </button>
            </div>

            <div className="flex flex-row flex-wrap w-full pb-10 px-0">

                { !startTime && 
                    <button className="border-2 border-white text-accent-300 bg-contentBg text-2xl px-6 h-fit w-fit mt-8 mx-auto" 
                        onClick={() => setStartTime(new Date())}>
                        Start!
                    </button>
                }
                    
                    {startTime && (
                        <div className="flex flex-col ">
                            <div className="mb-0 text-4xl font-bold text-gray-400">BLINDS</div>
                            <div className="flex flex-row text-9xl font-bold text-white mb-20">
                                { currentLevel.BB
                                ? <div className="text-white">{currentLevel.SB} / {currentLevel.BB}</div>
                                : <div className="text-white border-6 border-white">BREAK</div>
                                }
                            </div>

                            { nextLevel && <>
                            
                                    <div className="mb-0 text-4xl font-bold text-gray-400">TIME UNTIL NEXT LEVEL</div>
                                    {nextLevel.StartSeconds - elapsedSeconds > ((nextLevel.StartSeconds - currentLevel.StartSeconds) * .1) &&
                                     nextLevel.StartSeconds - elapsedSeconds > 10 && (
                                        <div className="text-8xl font-bold text-white mb-8">
                                            {trimFormatTime(nextLevel.StartSeconds - elapsedSeconds)}
                                        </div>
                                    )}
                                    {nextLevel.StartSeconds - elapsedSeconds > 10 &&
                                        nextLevel.StartSeconds - elapsedSeconds <= ((nextLevel.StartSeconds - currentLevel.StartSeconds) * .1) && (
                                        <div className="text-8xl font-bold text-yellow-300 mb-8">
                                            {trimFormatTime(nextLevel.StartSeconds - elapsedSeconds)}
                                        </div>
                                    )}
                                    {nextLevel.StartSeconds - elapsedSeconds > 0 &&
                                        nextLevel.StartSeconds - elapsedSeconds <= 10 && (
                                        <div className="text-8xl font-bold text-red-600 mb-8">
                                            {trimFormatTime(nextLevel.StartSeconds - elapsedSeconds)}
                                        </div>
                                    )}
                                </>
                            }

                            {nextLevel && (
                            <>
                                <div className="w-full h-5 mt-0 mb-0 relative overflow-hidden rounded bg-gray-800 border-2 border-gray-400">
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{
                                        width: `${
                                            ((nextLevel.StartSeconds - elapsedSeconds) /
                                            (nextLevel.StartSeconds - currentLevel.StartSeconds)) *
                                            100
                                        }%`,
                                        backgroundColor:
                                            nextLevel.StartSeconds - elapsedSeconds <= 10 ? 'red'
                                            : nextLevel.StartSeconds - elapsedSeconds <= ((nextLevel.StartSeconds - currentLevel.StartSeconds) * .1)
                                            ? 'yellow' : 'lightgray',
                                        }}
                                    ></div>
                                </div>

                                
                            </>
                            )}
                            {nextLevel ? (
                            <div className="w-fit flex flex-col mt-20">
                                <div className="w-full flex flex-row">
                                    <div className="text-4xl text-gray-400 font-bold mr-6 mt-auto">NEXT</div>
                                </div>
                                <div className="flex flex-row text-7xl font-bold text-gray-400">
                                    
                                    <div>{nextLevel.SB} { nextLevel.BB && <>/ {nextLevel.BB}</>}</div>
                                </div>
                            </div>
                            ) : (
                            <div className="w-fit mx-auto flex flex-col">
                                <h1 className="mb-2 text-6xl">Final Level</h1>
                            </div>
                            )}
                        </div>
                        )}

                <div className="flex flex-col w-fit  mx-auto mb-auto">
                    <div className="mb-2 text-gray-600 font-bold text-2xl">BLIND LEVELS</div>
                    <div className="w-fit flex flex-col border border-gray-400">
                        <div className="flex flex-row font-bold border-b border-gray-600 gap-1 p-1 text-gray-400 px-2">
                            <div className="w-4">#</div>
                            <div className="w-16"><div className="w-fit ml-auto">SB</div></div>
                            <div>/</div>
                            <div className="w-16"><div className="w-fit mr-auto">BB</div></div> 
                            <div className="w-16"><div className="w-fit mr-auto">Start</div></div> 
                            <div className="w-8"></div> 
                        </div>
                        {levels.map((level, i) => {
                            if (level.Level === 0 && currentLevel && level.StartSeconds === currentLevel.StartSeconds) {
                                return (
                                    <div key={i} className="flex text-lg flex-row border-2 border-gray-400 text-gray-400 gap-1 p-1 px-2 font-bold">
                                        <div className="w-4"></div>
                                        <div className="w-32"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div className="w-1"></div>
                                        <div className="w-0"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                        { level.removeChip &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                            </div> 
                                        }
                                        { level.RebuyAllowed &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="ml-auto my-auto text-accent-600">rb</div>
                                            </div> 
                                        }
                                    </div>
                                )
                            }
                            if (elapsedSeconds > 0 && currentLevel && level.StartSeconds === currentLevel.StartSeconds) {
                                return (
                                    <div key={i} className="flex text-lg flex-row border-2 border-gray-400 font-bold gap-1 p-1 px-2">
                                        <div className="w-4">{level.Level}</div>
                                        <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div>/</div>
                                        <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                        { level.removeChip &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                            </div> 
                                        }
                                        { level.RebuyAllowed &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="ml-auto my-auto text-accent-600">rb</div>
                                            </div> 
                                        }
                                    </div>
                                )
                            }
                            else if (level.Level === 0) {
                                return (
                                    <div key={i} className="flex text-lg flex-row border-b-2 border-t border-gray-500 text-gray-400 gap-1 p-1 px-2">
                                        <div className="w-4"></div>
                                        <div className="w-32"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div className="w-1"></div>
                                        <div className="w-0"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                        { level.removeChip &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                            </div> 
                                        }
                                        { level.RebuyAllowed &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="ml-auto my-auto text-accent-600">rb</div>
                                            </div> 
                                        }
                                    </div>
                                )
                            }
                            else if (elapsedSeconds > 0 && currentLevel && level.StartSeconds < currentLevel.StartSeconds) {
                                return (
                                    <div key={i} className="flex text-lg flex-row border-b border-gray-600 text-gray-500 gap-1 p-1 px-2">
                                        <div className="w-4">{level.Level}</div>
                                        <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div>/</div>
                                        <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                        { level.removeChip &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                            </div> 
                                        }
                                        { level.RebuyAllowed &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="ml-auto my-auto text-accent-600">rb</div>
                                            </div> 
                                        }
                                    </div>
                                )
                            }
                            else  {
                                return (
                                    <div key={i} className="flex text-lg flex-row border-b border-gray-600 text-gray-500 gap-1 p-1 px-2">
                                        <div className="w-4">{level.Level}</div>
                                        <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div>/</div>
                                        <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                        { level.removeChip &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                            </div> 
                                        }
                                        { level.RebuyAllowed &&
                                            <div className="w-6 flex ml-auto">
                                                <div className="ml-auto my-auto text-accent-600">rb</div>
                                            </div> 
                                        }
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>


                <div className="flex flex-col w-fit mr-0 mb-auto bl-auto">
                    {/* <div className="mb-2 text-gray-600 font-bold text-2xl">Chips</div> */}
                    <div className="w-52 flex flex-row flex-wrap gap-4 mx-auto mt-0">
                        {chips.map((chip) =>    
                        <div key={chip.color} className="relative w-24 h-24">
                            <div
                                className="text-outlined-dark absolute w-24 h-24 font-bold text-center pt-4 text-4xl rounded-full border-8 border-contentBg shadow-xl shadow-contentBg [text-shadow:_0px_0px_6px_rgb(0_0_0)]"
                                style={{ background: chip.color, color: chip.text }}
                            >
                                {chip.value}
                            </div>
                            {[...Array(8)].map((_, i) => {
                                const angle = (i * 45 * Math.PI) / 180;
                                const radius = 46;
                                let leftAdjust = 0;
                                let topAdjust = 0;
                                // if (i === 7) { leftAdjust =  .5; topAdjust = -.5; }
                                // if (i === 5) { leftAdjust = -.5; topAdjust = -.5; }
                                // if (i === 3) { leftAdjust = -.5; topAdjust =  .5; }
                                // if (i === 1) { leftAdjust =  .5; topAdjust =  .5; }
                                return {
                                    transform: `rotate(${i * 45}deg)`,
                                    left: `${radius + Math.cos(angle) * radius + leftAdjust}%`,
                                    top: `${radius + Math.sin(angle) * radius + topAdjust}%`
                                };
                            }).map((style, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2"
                                    style={{ ...style, color: chip.detail, backgroundColor: chip.detail }}
                                >
                                    {/* {i} */}
                                    {/* <div className="w-1 h-1 border-2 rotate-45" style={{ borderColor: chip.text }} /> */}
                                </div>
                            ))}
                        </div>)}
                    </div>
                    <div className="flex flex-col w-full mt-8 ml-auto mr-0">
                        <div className="flex flex-row w-full gap-1">
                            { chips.filter(c => c.quantity > 0).sort((a, b) => b.quantity - a.quantity).map((chip) => {
                                return <div key={chip.value} style={{backgroundColor: chip.color, color: chip.detail, height: "" + (chip.quantity * 8) + 'px'}} className="rounded p-0 mt-auto font-bold text-3xl w-16 text-center flex">
                                    { chip.quantity == 1
                                        ? <div className="-my-6 mx-auto p-0 [text-shadow:_0px_0px_4px_rgb(0_0_0)]">{chip.quantity}</div>
                                        : <>{chip.quantity == 4
                                            ? <div className="-my-1 mx-auto p-0 [text-shadow:_0px_0px_4px_rgb(0_0_0)]">{chip.quantity}</div>
                                            : <div className="mt-auto mx-auto p-0 [text-shadow:_0px_0px_4px_rgb(0_0_0)]">{chip.quantity}</div>
                                        }</>
                                    }
                                    <div className="w-1 flex flex-col gap-1 mr-0 mt-0.5 rounded-full" style={{}}>
                                        { Array(chip.quantity).fill().map((_, i) => {
                                            return <div  key={i} className="w-fit flex flex-row">
                                                    <div className="w-1 h-1 ml-auto" style={{backgroundColor: chip.detail}}></div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            })}
                        </div>
                        <div className="text-gray-300 font-bold text-2xl mt-1">START STACK: {chips.reduce((acc, cur) => acc + cur.quantity * cur.numValue, 0)}</div>
                    </div>
                </div>
            </div>
            <div className="absolute w-10/12 h-fit">
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
        </div>
    );
};

export default BlindDisplay;