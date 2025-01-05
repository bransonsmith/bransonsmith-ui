import React, { useState, useEffect } from 'react';

const BlindDisplay = () => {
    const [startTime, setStartTime] = useState(null);

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [lastPausedAt, setLastPausedAt] = useState(null);

    const [localTime, setLocalTime] = useState(new Date());

    const [lastSaveTime, setLastSaveTime] = useState(null);
    const [loading, setLoading] = useState(true);

    const levels = [
        { "Level": 1,  "SB": 5,   "BB": 10,      "Ante": 0, "StartSeconds": 0,   "Rebuys": 0, "AddOns": 0 },
        { "Level": 2,  "SB": 10,  "BB": 20,      "Ante": 0, "StartSeconds": 1200,  "Rebuys": 0, "AddOns": 0 },
        { "Level": 3,  "SB": 15,  "BB": 30,      "Ante": 0, "StartSeconds": 2400,  "Rebuys": 0, "AddOns": 0 },
        { "Level": 4,  "SB": 20,  "BB": 40,      "Ante": 0, "StartSeconds": 3600,  "Rebuys": 0, "AddOns": 0 },
        { "Level": 5,  "SB": 40,  "BB": 80,      "Ante": 0, "StartSeconds": 4800,  "Rebuys": 0, "AddOns": 0 },
        { "Level": 6,  "SB": 50,  "BB": 100,     "Ante": 0, "StartSeconds": 6000,  "Rebuys": 0, "AddOns": 0 },
        { "Level": 7,  "SB": 100, "BB": 200,     "Ante": 0, "StartSeconds": 7200,  "Rebuys": 0, "AddOns": 0 },
        { "Level": 8,  "SB": 150, "BB": 300,     "Ante": 0, "StartSeconds": 8400, "Rebuys": 0, "AddOns": 0 },
        { "Level": 9,  "SB": 200, "BB": 400,     "Ante": 0, "StartSeconds": 9600, "Rebuys": 0, "AddOns": 0 },
        { "Level": 10, "SB": 300, "BB": 600,     "Ante": 0, "StartSeconds": 10800, "Rebuys": 0, "AddOns": 0 },
        { "Level": 11, "SB": 400, "BB": 800,     "Ante": 0, "StartSeconds": 12000, "Rebuys": 0, "AddOns": 0 },
        { "Level": 12, "SB": 500, "BB": 1000,    "Ante": 0, "StartSeconds": 13200, "Rebuys": 0, "AddOns": 0 },
        { "Level": 13, "SB": 1000, "BB": 2000,   "Ante": 0, "StartSeconds": 14400, "Rebuys": 0, "AddOns": 0 },
        { "Level": 14, "SB": 1500, "BB": 3000,   "Ante": 0, "StartSeconds": 15600, "Rebuys": 0, "AddOns": 0 },
        { "Level": 15, "SB": 2000, "BB": 4000,   "Ante": 0, "StartSeconds": 16800, "Rebuys": 0, "AddOns": 0 },
        { "Level": 16, "SB": 3000, "BB": 6000,   "Ante": 0, "StartSeconds": 18000, "Rebuys": 0, "AddOns": 0 },
        { "Level": 17, "SB": 5000, "BB": 10000,  "Ante": 0, "StartSeconds": 19200, "Rebuys": 0, "AddOns": 0 },
    ];

    useEffect(() => {
        if (!loading) {
            let timer;
            if (startTime && !isPaused) {
                timer = setInterval(() => {
                    setElapsedSeconds(elapsedSeconds + 1);
                    setLocalTime(new Date());
                }, 1000);
            } else {
                timer = setInterval(() => {
                    setLocalTime(new Date());
                }, 1000);
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

    const currentLevel = levels.filter(level => level.StartSeconds <= elapsedSeconds).reduce((max, level) => level.Level > max.Level ? level : max, levels[0]) || null;
    const nextLevel = elapsedSeconds > 0 ? levels.find(level => level.Level === currentLevel.Level + 1) : levels[0];

    return (
        <div className="w-screen max-w-7xl mx-auto py-80">

            <div className="flex flex-row mt-2 w-full flex-wrap mb-10 py-6 border-b border-gray-700">
                <div className="flex flex-col mx-auto">
                    <div className="my-auto text-2xl">Local Time:</div>
                    <div className="my-auto text-4xl font-bold"> {localTime.toLocaleTimeString()}</div>
                </div>

                {startTime && (
                    <div className="flex flex-col mx-auto">
                        <div className="my-auto text-2xl">Play-Time Duration:</div>
                        <div className="flex flex-row gap-2">
                            <div className="my-auto text-4xl font-bold"> {formatTime(elapsedSeconds)}</div>

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
                        <div className="my-auto text-2xl">Start Time:</div>
                        <div className="flex flex-row gap-2">
                            <div className="my-auto text-4xl font-bold"> {startTime.toLocaleTimeString()}</div>
                            <button className="border-2 border-gray-700 text-gray-400 bg-contentBg mt-2 px-3 ml-3 w-fit h-fit hover:bg-red-900" onClick={endTournament}>
                                Delete Tournament
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-row flex-wrap w-full pb-10 px-10">

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
                                <div className="text-white">{currentLevel.SB} / {currentLevel.BB}</div>
                            </div>

                            { nextLevel && <>
                            
                                    <div className="mb-0 text-4xl font-bold text-gray-400">TIME UNTIL NEXT LEVEL</div>
                                    {nextLevel.StartSeconds - elapsedSeconds > ((nextLevel.StartSeconds - currentLevel.StartSeconds) * .1) && (
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
                                            nextLevel.StartSeconds - elapsedSeconds <= 10
                                            ? 'red'
                                            : nextLevel.StartSeconds - elapsedSeconds <= ((nextLevel.StartSeconds - currentLevel.StartSeconds) * .1)
                                            ? 'yellow'
                                            : 'lightgray',
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
                                    <div>{nextLevel.SB} / {nextLevel.BB}</div>
                                </div>
                            </div>
                            ) : (
                            <div className="w-fit mx-auto flex flex-col">
                                <h1 className="mb-2 text-6xl">Final Level</h1>
                            </div>
                            )}
                        </div>
                        )}

                
                {isPaused &&
                    <span className="text-7xl font-bold text-error-700 mx-auto my-auto border-4 border-error-900 h-fit w-fit py-2 px-5">PAUSED</span>
                }


                <div className="flex flex-col w-fit ml-auto mr-10 mb-auto">
                    <div className="mb-2 text-gray-600 font-bold text-2xl">Blind Levels</div>
                    <div className="w-fit flex flex-col border border-gray-400">
                        <div className="flex flex-row font-bold border-b border-gray-600 gap-1 p-1 text-gray-400">
                            <div className="w-6">#</div>
                            <div className="w-16"><div className="w-fit ml-auto">SB</div></div>
                            <div>/</div>
                            <div className="w-16"><div className="w-fit mr-auto">BB</div></div> 
                            <div className="w-16"><div className="w-fit mr-auto">Start</div></div> 
                        </div>
                        {levels.map((level) => {
                            if (elapsedSeconds > 0 && currentLevel && level.Level === currentLevel.Level) {
                                return (
                                    <div key={level.Level} className="flex flex-row border-b border-gray-600 font-bold gap-1 p-1">
                                        <div className="w-6">{level.Level}</div>
                                        <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div>/</div>
                                        <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                    </div>
                                )
                            }
                            else if (nextLevel && level.Level === nextLevel.Level) {
                                return (
                                    <div key={level.Level} className="flex flex-row border-b border-gray-600 text-gray-400 font-bold gap-1 p-1">
                                        <div className="w-6">{level.Level}</div>
                                        <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div>/</div>
                                        <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                    </div>
                                )
                            }
                            else if (currentLevel && level.Level < currentLevel.Level) {
                                return (
                                    <div key={level.Level} className="flex flex-row border-b border-gray-600 text-gray-600 gap-1 p-1">
                                        <div className="w-6">{level.Level}</div>
                                        <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div>/</div>
                                        <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div key={level.Level} className="flex flex-row border-b border-gray-600 text-gray-500 gap-1 p-1">
                                        <div className="w-6">{level.Level}</div>
                                        <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                                        <div>/</div>
                                        <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                                        <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlindDisplay;