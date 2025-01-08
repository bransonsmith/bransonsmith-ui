

export default function CurrentNextBlindInfo({ startTime, currentLevel, nextLevel, elapsedSeconds }) {

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

    return <> {startTime && (
    <div className="flex flex-col">
        <div className="mb-0 text-4xl font-bold text-gray-400">BLINDS</div>
        <div className="flex flex-row text-9xl font-bold text-white mb-20">
            { currentLevel && currentLevel.BB
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
        </> }

        {nextLevel &&  <div className="w-full h-5 mt-0 mb-0 relative overflow-hidden rounded bg-gray-800 border-2 border-gray-400">
            <div className="h-full transition-all duration-500"
                style={{ 
                    width: `${ 
                        ((nextLevel.StartSeconds - elapsedSeconds) /
                        (nextLevel.StartSeconds - currentLevel.StartSeconds)) *
                        100 }%`,
                    backgroundColor:
                        nextLevel.StartSeconds - elapsedSeconds <= 10 ? 'red'
                        : nextLevel.StartSeconds - elapsedSeconds <= ((nextLevel.StartSeconds - currentLevel.StartSeconds) * .1)
                        ? 'yellow' : 'lightgray',
                }}
            ></div>
        </div> }

        {nextLevel
        ? <div className="w-fit flex flex-col mt-20">
            <div className="w-full flex flex-row">
                <div className="text-4xl text-gray-400 font-bold mr-6 mt-auto">NEXT</div>
            </div>
            <div className="flex flex-row text-7xl font-bold text-gray-400">
                
                <div>{nextLevel.SB} { nextLevel.BB && <>/ {nextLevel.BB}</>}</div>
            </div>
        </div>
        : <div className="w-fit mx-auto flex flex-col">
            <h1 className="mb-2 text-6xl">Final Level</h1>
        </div>
        }
    </div>
    )} </>
}