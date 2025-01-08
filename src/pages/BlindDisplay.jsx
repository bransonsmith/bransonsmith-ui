import { useState, useEffect, useRef } from 'react';
import { getLevels } from '../components/PokerBlinds/LevelService';
import { getChips } from '../components/PokerBlinds/ChipService';
import PokerBlindsHeader from '../components/PokerBlinds/PokerBlindsHeader';
import CurrentNextBlindInfo from '../components/PokerBlinds/CurrentNextBlindInfo';
import BlindLevelTable from '../components/PokerBlinds/BlindLevelTable';
import ChipInfo from '../components/PokerBlinds/ChipInfo';
import TumblingCardRow from '../components/PokerBlinds/TumblingCardRow';
import BlindSounds from '../components/PokerBlinds/BlindSounds';

const BlindDisplay = () => {
    const [startTime, setStartTime] = useState(null);
    const [localTime, setLocalTime] = useState(new Date());
    
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [lastPausedAt, setLastPausedAt] = useState(null);

    const [loading, setLoading] = useState(true);

    const [remoteSubscriber, setRemoteSubscriber] = useState(false);
    const [remotePublisher, setRemotePublisher] = useState(false);

    const [chips, setChips] = useState(null);
    const [levels, setLevels] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [nextLevel, setNextLevel] = useState(null);
    const [timeToNextLevel, setTimeToNextLevel] = useState(0);

    const [localSave, setLocalSave] = useState(null);
    const [remoteSave, setRemoteSave] = useState(null);

    const [socketState, setSocketState] = useState('Not Connected');
    const wsUrl = 'ws://192.168.1.87:8088'
    const httpUrl = 'http://192.168.1.87:8088/data'
    const ws = useRef(null);

    useEffect(() => {
        const fetchChipsAndLevels = async () => {
            let Chips = await getChips();
            let Levels = await getLevels();
            setChips(Chips);
            setLevels(Levels);
        }

        // function connect() {
            
        //   ws.current = new WebSocket(wsUrl);
        //   setSocketState('Connected');
    
        //   ws.current.onmessage = (event) => {
        //     console.log('WS event!', event);
        //     const localStateIsSubscriber = localStorage.getItem('bs-pokerBlinds-remoteSubscriber') === 'true';
        //     const localStateIsPublisher = localStorage.getItem('bs-pokerBlinds-remotePublisher') === 'true';
        //     setSocketState('Working');
        //     if (localStateIsSubscriber) {
        //         const remoteState = JSON.parse(event.data);
        //         console.log('Remote State:', remoteState);
        //         if (remoteState.startTimeString) {
        //             setStartTime(new Date(remoteState.startTimeString));
        //         }
        //         setElapsedSeconds(parseInt(remoteState.elapsedSeconds));
        //         setIsPaused(remoteState.isPaused === 'true');
        //         console.log('setting lastPausedAt', remoteState.lastPausedAtString)
        //         setLastPausedAt(new Date(remoteState.lastPausedAtString));

        //         localStorage.setItem('bs-pokerBlinds', JSON.stringify(remoteState));
        //     }
        //     // setData(JSON.parse(event.data));
        //   };
    
        //   ws.current.onclose = () => {
        //     console.error('WebSocket closed! Attempting to reconnect...');
        //     setSocketState('Closed');
        //     const localStateIsSubscriber = localStorage.getItem('bs-pokerBlinds-remoteSubscriber') === 'true';
        //     const localStateIsPublisher = localStorage.getItem('bs-pokerBlinds-remotePublisher') === 'true';
        //     if (localStateIsSubscriber) {
        //         setTimeout(connect, 3000); 
        //     }
        //     if (localStateIsPublisher) {
        //         setSocketState('Not Connected as Publisher');
        //     }
        //   };
    
        //   ws.current.onerror = (error) => {
        //     console.error('WebSocket error!', error);
        //     setSocketState('Error');
        //     ws.current?.close();
        //   };
        // }

        setLoading(true);
        const localStateIsSubscriber = localStorage.getItem('bs-pokerBlinds-remoteSubscriber') === 'true';
        const localStateIsPublisher = localStorage.getItem('bs-pokerBlinds-remotePublisher') === 'true';
        if (localStateIsSubscriber) {
            setRemoteSubscriber(true);
        }
        if (localStateIsPublisher) {
            setRemotePublisher(true);
        }

        const existingLocalState = localStorage.getItem('bs-pokerBlinds');
        const existingLocalStateJson = JSON.parse(existingLocalState);
        if (existingLocalState) {
            setLocalSave(existingLocalStateJson);
        }

        async function getRemoteState() {
            var existingRemoteStateJson = await readGameFromRemote()
            if (localStateIsPublisher && existingRemoteStateJson !== null) {
                const state = {
                    startTimeString: existingRemoteStateJson.startTimeString,
                    elapsedSeconds: existingRemoteStateJson.elapsedSeconds.toString(),
                    isPaused: true,
                    lastPausedAtString: new Date().toISOString(),
                }
                
                setStartTime(new Date(existingRemoteStateJson.startTimeString));
                setElapsedSeconds(parseInt(existingRemoteStateJson.elapsedSeconds));
                setIsPaused(true);
                console.log('setting lastPausedAt 121', existingRemoteStateJson.lastPausedAtString)
                setLastPausedAt(new Date(existingRemoteStateJson.lastPausedAtString));

                localStorage.setItem('bs-pokerBlinds', JSON.stringify(state));
                writeGameToRemote(JSON.stringify(state));
                setLocalSave(state);
                setRemoteSave(state);
            }
            if (localStateIsSubscriber && existingRemoteStateJson !== null) {
                console.log('setting remote state')
                const state = {
                    startTimeString: existingRemoteStateJson.startTimeString,
                    elapsedSeconds: existingRemoteStateJson.elapsedSeconds.toString(),
                    isPaused: true.toString(),
                    lastPausedAtString: new Date().toISOString(),
                }

                setStartTime(new Date(existingRemoteStateJson.startTimeString));
                setElapsedSeconds(parseInt(existingRemoteStateJson.elapsedSeconds));
                setIsPaused(existingRemoteStateJson.isPaused === 'true');
                console.log('setting lastPausedAt 141', existingRemoteStateJson.lastPausedAtString)
                setLastPausedAt(new Date(existingRemoteStateJson.lastPausedAtString));

                localStorage.setItem('bs-pokerBlinds', JSON.stringify(state));
                setLocalSave(state);
                setRemoteSave(state);
            }
        }
        getRemoteState();
        if (localStateIsSubscriber) {
            // connect();
        }

        if (chips === null || levels === null) {
            fetchChipsAndLevels();
        }

        if (!localStateIsPublisher && !localStateIsSubscriber) {
            setStartTime(new Date(existingLocalStateJson.startTimeString));
            setElapsedSeconds(parseInt(existingLocalStateJson.elapsedSeconds));
            setIsPaused(true);
            setLastPausedAt(new Date());
        }
        setLoading(false);

        return () => ws.current?.close();
      }, []);

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
            if (startTime && levels) {
                setCurrentLevel(levels.filter(level => level.StartSeconds <= elapsedSeconds).reduce((max, level) => level.StartSeconds > max.StartSeconds ? level : max, levels[0]) || null)
                if (currentLevel !== null) {
                    setNextLevel(elapsedSeconds > 0 ? levels.find(level => level.StartSeconds > (currentLevel.StartSeconds)) : levels[0])
                    if (nextLevel) {
                        setTimeToNextLevel(nextLevel.StartSeconds - elapsedSeconds)
                    }
                }
            }
            const updateSubscription = async () => {
                await pullLatestRemote()
            }

            updateSubscription();
            saveState();
            return () => clearInterval(timer);
        }
    }, [startTime, isPaused, localTime, loading]);

    const pullLatestRemote = async () => {

        const localStateIsSubscriber = localStorage.getItem('bs-pokerBlinds-remoteSubscriber') === 'true';
        if (localStateIsSubscriber) {
            console.log('pulling latest remote')
            await readGameFromRemote()
        }
    }

    const writeGameToRemote = async (stateJsonString) => {
        console.log('Write to remote', stateJsonString)
        const url = 'http://192.168.1.87:8088/data'
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: stateJsonString
            })
            const data = await response.json()
            localStorage.setItem('bs-pokerBlinds', stateJsonString);
            setRemoteSave(JSON.parse(stateJsonString));
            // console.log('Wrote to remote', stateJsonString)
        }
        catch(e) {
            console.log('error', e)
        }
    }

    const readGameFromRemote = async () => {
        try {
            const response = await fetch(httpUrl);
            const existingRemoteState = await response.json();
            const existingRemoteStateJson = JSON.parse(existingRemoteState);
            setRemoteSave(existingRemoteStateJson);

            const localStateIsSubscriber = localStorage.getItem('bs-pokerBlinds-remoteSubscriber') === 'true';
            if (localStateIsSubscriber) {
                console.log('Updating from latest remote', existingRemoteStateJson)
                // update memory to remote-values
                if (existingRemoteState.startTimeString) {
                    setStartTime(new Date(existingRemoteState.startTimeString));
                }
                setElapsedSeconds(parseInt(existingRemoteState.elapsedSeconds));
                setIsPaused(existingRemoteState.isPaused === 'true');
                if (existingRemoteState.lastPausedAtString) {
                    try {
                        console.log('setting lastPausedAt 246', existingRemoteState.lastPausedAtString)
                        setLastPausedAt(new Date(existingRemoteState.lastPausedAtString));

                    }
                    catch (e) {
                        console.log('error setting lastPausedAt 246', e)
                    }
                }
            }
            return existingRemoteStateJson;
        }
        catch(e) {
            console.log('error', e)
        }
    }

    const saveState = () => {
        if (startTime) {
            
            const localStateIsSubscriber = localStorage.getItem('bs-pokerBlinds-remoteSubscriber') === 'true';
            const localStateIsPublisher = localStorage.getItem('bs-pokerBlinds-remotePublisher') === 'true';

            let startTimeString = startTime.toISOString();
            let lastPausedAtString = new Date().toISOString();
            if (lastPausedAt) {
                // console.log('lastPausedAt 270', lastPausedAt)
                let lastPausedAtString = lastPausedAt.toISOString();
            }

            const state = {
                startTimeString,
                elapsedSeconds: elapsedSeconds.toString(),
                isPaused: isPaused.toString(),
                lastPausedAtString: lastPausedAtString,
            }
            if (localStateIsPublisher) {
                localStorage.setItem('bs-pokerBlinds', JSON.stringify(state));
                setLocalSave(state);
                writeGameToRemote(JSON.stringify(state));
            }
            else if (localStateIsSubscriber) {
                // only save local in events
            }
            else {
                localStorage.setItem('bs-pokerBlinds', JSON.stringify(state));
                setLocalSave(state);
            }
        }
    }

    const formatTime = (seconds) => {
        seconds = parseInt(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const togglePause = () => {
        const oldPauseValue = isPaused;
        let newPausedAt = new Date()

        if (oldPauseValue) {

        } 
        else {
            newPausedAt = new Date();
            // console.log('setting lastPausedAt 306', newPausedAt)
            setLastPausedAt(newPausedAt);
        }
        setIsPaused(!oldPauseValue);
    };

    const toggleRemoteSubscriber = async () => {

        const newRemoteSubscriberValue = !remoteSubscriber;
        localStorage.setItem('bs-pokerBlinds-remoteSubscriber', (newRemoteSubscriberValue).toString());

        if (newRemoteSubscriberValue) {
            await readGameFromRemote()
        }

        setRemoteSubscriber(newRemoteSubscriberValue);
    }

    const toggleRemotePublisher = async () => {

        const newRemotePublisherValue = !remotePublisher;
        localStorage.setItem('bs-pokerBlinds-remotePublisher', (newRemotePublisherValue).toString());

        if (newRemotePublisherValue) {
            if (startTime) {
                const state = {
                    startTimeString: startTime.toISOString().toString(),
                    elapsedSeconds: elapsedSeconds.toString(),
                    isPaused: isPaused.toString(),
                    lastPausedAtString: lastPausedAt.toISOString().toString(),
                }
                localStorage.setItem('bs-pokerBlinds', JSON.stringify(state));
                setLocalSave(state);
                writeGameToRemote(JSON.stringify(state));
            }
        }

        setRemotePublisher(newRemotePublisherValue);
    }

    return (
        <div className="w-screen max-w-7xl mx-auto py-80">
            {isPaused && <span className="text-7xl bg-contentBg font-bold sticky left-1/3 top-1/3 text-error-700 mx-auto my-auto border-4 border-error-900 h-fit w-fit py-2 px-5">
                PAUSED
            </span>}
            
            <PokerBlindsHeader 
                localTime={localTime}
                formattedElapsedSeconds={formatTime(elapsedSeconds)}
                startTime={startTime}
                togglePause={togglePause}
                isPaused={isPaused}
                showPauseResumeButton={!remoteSubscriber}
            />

            <div className="flex flex-row flex-wrap w-full pb-10 px-0">

                { !startTime && <button className="border-2 border-white text-accent-300 bg-contentBg text-2xl px-6 h-fit w-fit mt-8 mx-auto" 
                    onClick={() => { setStartTime(new Date()); setLastPausedAt(new Date()) }}>
                    Start!
                </button> }
                    
                <CurrentNextBlindInfo 
                    startTime={startTime}
                    currentLevel={currentLevel}
                    nextLevel={nextLevel}
                    elapsedSeconds={elapsedSeconds}
                />

                <BlindLevelTable 
                    levels={levels} 
                    currentLevel={currentLevel} 
                    chips={chips} 
                    elapsedSeconds={elapsedSeconds}
                    formatTime={formatTime}
                />

                <ChipInfo chips={chips} />
            </div>

            <TumblingCardRow localTime={localTime} />

            <div className="flex flex-col gap-3 mt-32">
                <div className="flex flex-row gap-3">
                    <div>Socket:</div>
                    { socketState && (socketState === 'Working' || socketState === 'Connected') && <div className="font-bold text-accent-400">{socketState}</div> }
                    { socketState && (socketState === 'Error' || socketState === 'Closed')      && <div className="font-bold text-error-800" >{socketState}</div> }
                    { socketState && (socketState === 'Not Connected as Publisher')      && <div className="font-bold text-slate-500" >{socketState}</div> }
                    <label className="my-auto">Remote Subscriber</label>
                    <input type="checkbox" checked={remoteSubscriber} onChange={toggleRemoteSubscriber} />
                    <label className="my-auto">Remote Publisher</label>
                    <input type="checkbox" checked={remotePublisher} onChange={toggleRemotePublisher} />
                </div>
                <div className="flex flex-col">
                    <div>Local Save:</div>
                    { !localSave && <div>None</div> }
                    { localSave && <div className="ml-6">
                        {Object.keys(localSave).map((key) => {
                            return <div key={key}>{key}: {localSave[key].toString()}</div>
                        })}
                    </div> }
                    { localSave && <div className="flex flex-row gap-3">
                        <button className="ml-10 w-fit h-fit bg-contentBg border-2 border-accent-400" onClick={() => {}}>Load from Local</button>
                        <button className="ml-10 w-fit h-fit bg-contentBg border-2 border-accent-400" onClick={() => {}}>Write to Local</button> 
                    </div> }
                </div>
                <div className="flex flex-col">
                    <div>Remote Save:</div>
                    { !remoteSave && <div>None</div> }
                    { remoteSave && <div className="ml-6">
                        {Object.keys(remoteSave).map((key) => {
                            return <div key={key}>{key}: {remoteSave[key].toString()}</div>
                        })}
                    </div> }
                    { remoteSave && <div className="flex flex-row gap-3">
                        <button className="ml-10 w-fit h-fit bg-contentBg border-2 border-accent-400" onClick={() => {}}>Load from Remote</button>
                        <button className="ml-10 w-fit h-fit bg-contentBg border-2 border-accent-400" onClick={() => {}}>Write to Remote</button> 
                    </div> }
                </div>
                <div className="flex flex-col">
                    <div>In Memory:</div>
                    { !startTime && <div>None</div> }
                    { startTime && lastPausedAt && <div className="ml-6">
                        <div>startTimeString: { startTime.toISOString().toString() }</div>
                        <div>elapsedSeconds: { elapsedSeconds.toString() }</div>
                        <div>isPaused: { isPaused.toString() }</div>
                        { lastPausedAt && <div>lastPausedAtString: { lastPausedAt.toString() }</div> }
                    </div> }
                    { startTime && <div className="flex flex-row gap-3">
                        <button className="ml-10 w-fit h-fit bg-contentBg border-2 border-accent-400" onClick={() => {}}>Load from Memory</button>
                        <button className="ml-10 w-fit h-fit bg-contentBg border-2 border-accent-400" onClick={() => {}}>Write to Memory</button> 
                    </div> }

                    <div> = Add controls to opt in to writing or reacting to remote events.</div>
                    <div> = After remote check, can save to local (might be saving what was just received from remote).</div>
                    <div> = Should only read from local if there is no remote data enabled.</div>
                    <div> = Should only write to local with no remote via opt in. Don't want to overwrite cached remote data in localStorage unintentionally.</div>
                </div>
            </div>

            <BlindSounds timeToNextLevel={timeToNextLevel}/>
        </div>
    );
};

export default BlindDisplay;