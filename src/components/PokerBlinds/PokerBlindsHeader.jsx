

export default function PokerBlindsHeader({ localTime, formattedElapsedSeconds, startTime, togglePause, isPaused, showPauseResumeButton, endTournament, plusTime, minusTime }) {


    return <div className="flex flex-row mt-2 w-full flex-wrap mb-10 py-6 pb-2 border-b border-gray-700">
        <div className="flex flex-col mx-auto">
            {/* <div className="my-auto text-2xl">Local Time:</div> */}
            <div className="my-auto text-4xl font-bold"> {localTime.toLocaleTimeString()}</div>
        </div>

        {startTime && (
            <div className="flex flex-col mx-auto">
                {/* <div className="my-auto text-2xl">Play-Time Duration:</div> */}
                <div className="flex flex-row gap-2">
                    <div className="my-auto text-3xl text-gray-400 font-bold">Play: {formattedElapsedSeconds}</div>

                    { !isPaused && showPauseResumeButton && <button
                        className="border-2 border-gray-700 text-gray-400 bg-contentBg mt-2 px-3 ml-3 w-fit h-fit hover:bg-slate-950" 
                        onClick={togglePause}>
                        Pause
                        </button>
                    }
                    { isPaused && showPauseResumeButton && 
                    <div className="flex flex-row">
                        <button
                            className="border-2 border-accent-300 text-gray-400 bg-contentBg mt-2 px-3 ml-3 w-fit h-fit hover:bg-slate-950" 
                            onClick={togglePause}>
                            Resume
                        </button>
                        <div className="flex flex-col w-fit px-2">
                            <button className="border-2 border-gray-700 text-gray-400 bg-contentBg mt-0 ml-3 w-7 px-2 py-0 text-center h-fit hover:bg-red-900" onClick={plusTime}>
                                +
                            </button>
                            <button className="border-2 border-gray-700 text-gray-400 bg-contentBg mt-0 ml-3 w-7 px-2 py-0 h-fit text-center hover:bg-red-900" onClick={minusTime}>
                                -
                            </button>
                        </div>
                    </div>
                    }

                </div>
            </div>
        )}

        {startTime && (
            <div className="flex flex-col mx-auto">
                <div className="flex flex-row gap-x-2 gap-y-0 py-0 mt-auto">
                    <div className="my-auto text-xl font-bold text-gray-600"> Start: {startTime.toLocaleTimeString()}</div>
                    { showPauseResumeButton && 
                        <button className="border-2 border-gray-700 text-gray-400 bg-contentBg mt-0 px-3 ml-3 w-fit h-fit hover:bg-red-900" onClick={endTournament}>
                            Delete Tournament
                        </button>
                    }
                </div>
            </div>
        )}
    </div>
}