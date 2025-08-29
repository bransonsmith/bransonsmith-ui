
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import BQEBookChapterRangeSelector from '../Components/BQEBookChapterRangeSelector'
import { NTHeadingData } from '../Data/NTHeadingData.js'

export default function GenericChapterSectionQuiz({initBookName, initFirstChapter, initLastChapter}) {

    const [bookName, setBookName] = useState(initBookName ?? 'John')
    const [firstChapter, setFirstChapter] = useState(initFirstChapter ?? 1)
    const [lastChapter, setLastChapter] = useState(initLastChapter ?? 5)

    // Separate selector state for starting a new quiz (so current quiz state isn't mutated prematurely)
    const [selBook, setSelBook] = useState(bookName)
    const [selFirstChapter, setSelFirstChapter] = useState(firstChapter)
    const [selLastChapter, setSelLastChapter] = useState(lastChapter)

    const navigate = useNavigate();

    // PHASES: 'classify', 'review', 'submitted'
    const [phase, setPhase] = useState('classify');
    // For phase 1: shuffled pericopes, and answers as {title, chosenChapter}
    const [shuffledPericopes] = useState(() => shuffleArray([...NTHeadingData]));
    const [baselinePericopes] =  useState(() => getBaseLinePericopes([...NTHeadingData]));
    const [classifyIndex, setClassifyIndex] = useState(0);
    const [classified, setClassified] = useState([]); // {title, startChapter, chosenChapter, ...}
    // For phase 2/3: wordBank is the user's current order (with chapter markers)
    const [wordBank, setWordBank] = useState([]);
    // For move highlight effect
    const [movedIndex, setMovedIndex] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [answerKey, setAnswerKey] = useState(generateAnswerKey());
    const [submitted, setSubmitted] = useState(false);


    const handleDragStart = (e, item, index) => {
        setDraggedItem({ item, index });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault(); // Necessary to allow dropping
        setDragOverIndex(index); // Update the drag over index
    };

    const handleDragLeave = () => {
        setDragOverIndex(null); // Reset drag over index when leaving an item
    };

    const handleDrop = (index) => {
        if (draggedItem.index !== index) {
            const newWordBank = [...wordBank];
            newWordBank.splice(draggedItem.index, 1); // Remove the item from its original position
            newWordBank.splice(index, 0, draggedItem.item); // Insert the item in the new position

            setWordBank(newWordBank);
        }
        setDragOverIndex(null); // Reset drag over index after dropping
    };


    function generateAnswerKey() {
        let fullList = [];
        let lastInsertedChapter = 0;

        baselinePericopes.forEach(p => {
            while (p.startChapter > lastInsertedChapter) {
                lastInsertedChapter++;
                fullList.push({
                    isChapterMarker: true,
                    chapter: lastInsertedChapter,
                    title: `Chapter ${lastInsertedChapter}`
                });
            }
            let pCopy = { ...p };
            pCopy.isCorrect = undefined;
            fullList.push(pCopy);
        });
        return fullList;
    }

    function getBaseLinePericopes(arr)
    {
        let relatedBook = arr.filter(b => b.bookName === bookName)[0]
        let relatedSections = relatedBook.headings.filter(h => h.startChapter >= firstChapter && h.startChapter <= lastChapter)
        return relatedSections
    }

    function shuffleArray(arr) {
        // Fisher-Yates shuffle

        let relatedBook = arr.filter(b => b.bookName === bookName)[0]
        let relatedSections = relatedBook.headings.filter(h => h.startChapter >= firstChapter && h.startChapter <= lastChapter)
        let a = [...relatedSections];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }


    // Phase 1: handle chapter selection for a pericope
    function handleClassifyChapter(chapterNum) {
        if (phase !== 'classify') return;
        const current = shuffledPericopes[classifyIndex];
        const next = [...classified, { ...current, chosenChapter: chapterNum }];
        setClassified(next);
        if (classifyIndex + 1 < shuffledPericopes.length) {
            setClassifyIndex(classifyIndex + 1);
        } else {
            // Build review list grouped by chapter markers
            const chapters = Array.from(new Set(baselinePericopes.map(p => p.startChapter))).sort((a,b)=>a-b);
            const reviewList = [];
            chapters.forEach(ch => {
                reviewList.push({ isChapterMarker: true, chapter: ch, title: `Chapter ${ch}` });
                next.filter(item => item.chosenChapter === ch).forEach(item => reviewList.push(item));
            });
            setWordBank(reviewList);
            setPhase('review');
        }
    }

    // Allow undoing last classification before moving to review
    function undoLast() {
        if (phase !== 'classify' || classifyIndex === 0) return;
        setClassified(prev => prev.slice(0, -1));
        setClassifyIndex(i => Math.max(0, i - 1));
    }

    async function checkOrder() {
        setSubmitted(true);
        setPhase('submitted');
        // Compute score details before persisting usage
        const scoreDetails = computeScoreDetails();
        await handleCreate('ChapQuizUsage', scoreDetails)
    }

    const handleCreate = async (tableName, scoreDetails) => { 
        // scoreDetails expected shape from computeScoreDetails()
        if (!scoreDetails) {
            const errorMessage = `Error creating ${tableName}. Missing score details.`;
            if (typeof setToastMessage === 'function') setToastMessage({message: errorMessage, error: true});
            console.error(errorMessage);
            return;
        }
        function createId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0;
              const v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
        }
        const newItem = {
            Id: createId(),
            submissionTime: new Date().toISOString(),
            bookName: bookName,
            startChapter: firstChapter,
            endChapter: lastChapter,
            name: `${bookName}|${firstChapter}-${lastChapter}`,
            score: scoreDetails.score,
            maxScore: scoreDetails.maxScore,
            percent: scoreDetails.percent,
            totalSections: scoreDetails.totalSections,
            correctChapters: scoreDetails.correctChapterCount,
            correctPlacements: scoreDetails.correctPlacementCount
        };
        const forDynamo = JSON.stringify(newItem);
        try {
            
            const functionBaseUrl = "https://q2555xh4l7ppkwldozgnavh3ce0aweeq.lambda-url.us-east-1.on.aws/";
            const response = await fetch(`${functionBaseUrl}?table=${tableName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: forDynamo
            })
            if (!response.ok) {
                const errorMessage = `Error creating ${tableName}. ${response.status}`
                console.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = `Error creating ${tableName}. ${error.message}`
            console.error(errorMessage);
        }
    }

    function reset() {
        window.location.reload()
    }

    function isCorrect(submission, chapterGuess, item) {
        const idx = submission.findIndex(i => i.title === item.title);
        const correctIdx = baselinePericopes.findIndex(i => i.title === item.title);
        return idx === correctIdx;
    }

    function isCorrectChapter(submission, item) {
        // Find the index of this item in submission and in answerKey
        const subIdx = submission.findIndex(i => i.title === item.title);
        const ansIdx = answerKey.findIndex(i => i.title === item.title);
        if (subIdx === -1 || ansIdx === -1) return false;

        // Find the most recent chapter marker before this item in submission
        let subChapter = null;
        for (let i = subIdx - 1; i >= 0; i--) {
            if (submission[i].isChapterMarker) {
                subChapter = submission[i].chapter;
                break;
            }
        }

        // Find the most recent chapter marker before this item in answerKey
        let ansChapter = null;
        for (let i = ansIdx - 1; i >= 0; i--) {
            if (answerKey[i].isChapterMarker) {
                ansChapter = answerKey[i].chapter;
                break;
            }
        }

        let result = subChapter === ansChapter

        return subChapter === ansChapter;
    }

    function getScoreString() {
        const details = computeScoreDetails();
        return <div className="felx flex-col w-full">
            <div className="">{`${details.score} of ${details.maxScore} | ${(details.percent).toFixed(2)}%` }</div>
            <div className="font-normal text-sm">{`${details.correctChapterCount} of ${details.totalSections} correct chapters | ${details.pointsPerCorrectChapter} pts each | ${(details.correctChapterCount/details.totalSections*100).toFixed(2)}%`}</div>
            <div className="font-normal text-sm">{`${details.correctPlacementCount} of ${details.totalSections} perfect placement | ${details.bonusPerPerfectPlacement} pts each | ${(details.correctPlacementCount/details.totalSections*100).toFixed(2)}%`}</div>
        </div>
    }

    function computeScoreDetails() {
        // Create submission list (wordBank with all chapter markers filtered out)
        const submission = wordBank.filter(i => !i.isChapterMarker);
        // Set correctness
        wordBank.forEach(item => {
            if (!item.isChapterMarker) {
                item.correctChapter = isCorrectChapter(wordBank, item);
                if (item.correctChapter) {
                    item.isCorrect = isCorrect(submission, item.startChapter, item);
                } else {
                    item.isCorrect = false;
                }
            }
        });
        const pointsPerCorrectChapter = 10;
        const bonusPerPerfectPlacement = 1;
        const correctChapterCount = wordBank.filter(i => !i.isChapterMarker && i.correctChapter === true).length;
        const correctPlacementCount = wordBank.filter(i => !i.isChapterMarker && i.isCorrect === true).length;
        const totalSections = submission.length;
        const score = (correctPlacementCount * bonusPerPerfectPlacement) + (correctChapterCount * pointsPerCorrectChapter);
        const maxScore = totalSections * (pointsPerCorrectChapter + bonusPerPerfectPlacement);
        const percent = maxScore === 0 ? 0 : (score / maxScore) * 100;
        return {
            totalSections,
            correctChapterCount,
            correctPlacementCount,
            pointsPerCorrectChapter,
            bonusPerPerfectPlacement,
            score,
            maxScore,
            percent
        };
    }

    function moveUp(index) {
        if (index > 0) {
            const newWordBank = [...wordBank];
            [newWordBank[index], newWordBank[index - 1]] = [newWordBank[index - 1], newWordBank[index]];
            setWordBank(newWordBank);
            setMovedIndex(index - 1);
            setTimeout(() => setMovedIndex(null), 1200);
        }
    }

    function moveDown(index) {
        if (index < wordBank.length - 1) {
            const newWordBank = [...wordBank];
            [newWordBank[index], newWordBank[index + 1]] = [newWordBank[index + 1], newWordBank[index]];
            setWordBank(newWordBank);
            setMovedIndex(index + 1);
            setTimeout(() => setMovedIndex(null), 1200);
        }
    }

    function startNewQuiz() {
        const f = parseInt(selFirstChapter, 10);
        const l = parseInt(selLastChapter, 10);
        if (isNaN(f) || isNaN(l) || f < 1 || l < f) {
            // Simple validation; could surface a nicer message later
            return;
        }
        const url = `/chapquiz/${encodeURIComponent(selBook)}/${f}/${l}`;
        window.location.href = url;
    }

    const chapters = Array.from(new Set(baselinePericopes.map(p => p.startChapter))).sort((a,b)=>a-b);
    const progress = ((classifyIndex) / shuffledPericopes.length) * 100;

    const onKeyReorder = useCallback((e, index) => {
        if (phase !== 'review') return;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveUp(index);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveDown(index);
        }
    }, [phase, moveUp, moveDown]);

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-lg font-semibold tracking-tight">{bookName} <span className="text-md font-normal">{firstChapter}-{lastChapter}</span></h2>
                
            {phase === 'classify' && (
                <div className="flex flex-col items-center my-4">
                    <p className="mb-2 text-sm text-slate-500">Which chapter is the following heading from?</p>
                    <div className="text-2xl text-center font-bold mb-5 px-4 leading-snug min-h-[70px]">{shuffledPericopes[classifyIndex]?.title}</div>
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {chapters.map(ch => {
                            const usedCount = classified.filter(c => c.chosenChapter === ch).length;
                            return (
                                <button
                                    key={ch}
                                    className="relative px-4 py-2 rounded-md bg-slate-900 text-white border border-slate-600 hover:border-blue-500 hover:bg-slate-800 text-sm"
                                    onClick={() => handleClassifyChapter(ch)}
                                >
                                    {ch}
                                    {usedCount > 0 && <span className="absolute -top-2 -right-1 text-[10px] px-1 w-4 rounded bg-slate-500 text-neutral-900 font-semibold">{usedCount}</span>}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span>{classifyIndex+1} / {shuffledPericopes.length}</span>
                        <button disabled={classifyIndex === 0} onClick={undoLast} className={`px-2 py-1 rounded border text-[11px] ${classifyIndex===0? 'opacity-40 cursor-not-allowed border-slate-700':'border-slate-500 hover:border-blue-500'}`}>Undo</button>
                    </div>
                    {phase === 'classify' && (
                        <div className="w-3/4 h-2 bg-slate-800 rounded overflow-hidden mt-2" aria-label="Progress" role="progressbar" aria-valuenow={classifyIndex} aria-valuemin={0} aria-valuemax={shuffledPericopes.length}>
                            <div className="h-full bg-accent-500 transition-all" style={{width: `${progress}%`}} />
                        </div>
                    )}
                </div>
            )}
            {phase === 'review' && (
                <>
                    <div className="mb-3 text-sm leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-700">
                        <p className="m-0"><strong>Reorder:</strong> Drag items or use arrow buttons to arrange sections beneath the proper chapter markers.</p>
                        <p className="m-0 mt-1 text-xs text-slate-400">Most points: correct chapter. Bonus points: exact global order.</p>
                    </div>
                    {wordBank &&
                        <div className="flex flex-col w-full my-4" role="list" aria-label="Reorder sections">
                            {wordBank.map((item, index) => {
                                if (item.isChapterMarker) {
                                    return (
                                        <div
                                            key={index}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, item, index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={() => handleDrop(index)}
                                            className={`w-full flex items-center my-0 py-0 select-none cursor-grab h-fit ${dragOverIndex === index ? 'border border-slate-300 bg-slate-800' : ''}`}
                                        >
                                            <span className="text-sm text-gray-400 ml-2 mr-2 whitespace-nowrap h-fit">{item.title}</span>
                                            <div className="flex-1 border-t border-b border-gray-500 ml-2 h-0 w-full" />
                                        </div>
                                    );
                                }
                                const canMoveUp = index > 0;
                                const canMoveDown = index < wordBank.length - 1;
                                return (
                                    <div className="flex flex-row w-full mt-1" key={index} role="listitem">
                                        <button
                                            type="button"
                                            aria-label="Move up"
                                            className={`p-0 border rounded-md w-8 h-8 mr-1 my-auto text-center text-base font-extrabold ${canMoveUp ? 'cursor-pointer bg-slate-800 border-slate-500 hover:border-blue-500' : 'bg-slate-900 border-slate-800 opacity-30 cursor-not-allowed'}`}
                                            onClick={() => canMoveUp && moveUp(index)}
                                            disabled={!canMoveUp}
                                        >↑</button>
                                        <button
                                            type="button"
                                            aria-label="Move down"
                                            className={`p-0 border rounded-md w-8 h-8 mr-1 my-auto text-center text-base font-extrabold ${canMoveDown ? 'cursor-pointer bg-slate-800 border-slate-500 hover:border-blue-500' : 'bg-slate-900 border-slate-800 opacity-30 cursor-not-allowed'}`}
                                            onClick={() => canMoveDown && moveDown(index)}
                                            disabled={!canMoveDown}
                                        >↓</button>
                                        <div
                                            tabIndex={0}
                                            onKeyDown={(e)=>onKeyReorder(e,index)}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, item, index)}
                                            onDragOver={(e) => {
                                                if (!item.isChapterMarker && !wordBank[index].isChapterMarker) handleDragOver(e, index);
                                            }}
                                            onDragLeave={handleDragLeave}
                                            onDrop={() => {
                                                if (!item.isChapterMarker && !wordBank[index].isChapterMarker) handleDrop(index);
                                            }}
                                            className={`mx-auto my-0 py-2 px-4 rounded-md border ${dragOverIndex === index ? 'border-accent-400 ring-2 ring-accent-500/40' : 'border-slate-700'} w-10/12 cursor-grab bg-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-500/70 text-sm ${movedIndex === index ? 'ring-4 ring-green-400 ring-opacity-60 transition-all duration-500' : ''}`}
                                            style={{ opacity: item.isChapterMarker ? 0.5 : 1 }}
                                            aria-grabbed={draggedItem?.index === index}
                                            role="option"
                                        >
                                            {item.title}
                                            {item.iam && (
                                                <span className="ml-3 text-[10px] px-2 py-[2px] rounded bg-green-800 text-green-200 border border-green-600">I AM</span>
                                            )}
                                            {item.sign && (
                                                <span className="ml-3 text-[10px] px-2 py-[2px] rounded bg-amber-800 text-amber-200 border border-amber-600">sign</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    }
                    <button className="my-4 mx-auto px-5 py-2 font-semibold bg-accent-600 hover:bg-accent-500 active:bg-accent-700 rounded text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition" onClick={checkOrder}>Submit Answers</button>
                </>
            )}
            {phase === 'submitted' && (
                <>
                    <div className="text-2xl font-bold text-slate-400 flex flex-row gap-x-2"><span className="text-sm mb-auto mt-2">Score: </span>{getScoreString()}</div>
                    <div className="flex flex-row w-full">
                        <div className="flex flex-col w-5/12 my-0 mx-auto">
                            <h3> Your Guess </h3>
                            {wordBank.map((item, index) => {
                                if (item.isChapterMarker) {
                                    return (
                                        <div key={index} className="w-full flex items-center my-0 py-0 select-none h-fit">
                                            <span className="text-sm text-gray-400 ml-2 mr-2 whitespace-nowrap h-fit">{item.title}</span>
                                            <div className="flex-1 border-t border-b border-gray-500 ml-2 h-0 w-full" />
                                        </div>
                                    );
                                }
                                // Determine classes for correctChapter and isCorrect
                                let base = 'mx-auto my-0 py-2 px-4 rounded-md border-x border-y w-full mt-1 flex flex-row';
                                let color = ' border-neutral-900 ';
                                let animate = '';
                                if (item.correctChapter === true && item.isCorrect === false) {
                                    color += ' bg-green-800 border-green-950 ';
                                }
                                else if (item.isCorrect === true) {
                                    color += ' bg-green-700 border-green-100 '; 
                                    animate = ' animate-pulse-fast shadow-[0_0_6px_2px_rgba(34,197,94,0.7)] ';
                                } 
                                else if (item.isCorrect === false && item.correctChapter === false) {
                                    color += ' bg-red-950 ';
                                } 
                                else {
                                    color += '  ';
                                }
                                return (
                                    <div
                                        key={index}
                                        className={base + color + animate}
                                        style={item.isCorrect ? { transition: 'box-shadow 0.5s', borderWidth: 1 } : {}}
                                    >
                                        {item.title}
                                        { item.correctChapter === false 
                                            ? <span className="text-gray-500 ml-auto mr-0">{'ch' + item.startChapter}</span>
                                            : <span className="text-transparent ml-auto mr-0">{'ch' + item.startChapter}</span>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex flex-col w-5/12 my-0 mx-auto">
                            <h3> Correct Order </h3>
                            {answerKey.map((item, index) => {
                                if (item.isChapterMarker) {
                                    return (
                                        <div key={index} className="w-full flex items-center my-0 py-0 select-none h-fit">
                                            <span className="text-sm text-gray-400 ml-2 mr-2 whitespace-nowrap h-fit">{item.title}</span>
                                            <div className="flex-1 border-t border-b border-gray-500 ml-2 h-0 w-full" />
                                        </div>
                                    );
                                }
                                return (
                                    <div
                                        key={index}
                                        className={'mx-auto my-0 py-2 px-4 rounded-md border-x border-y w-full mt-1 flex flex-row border-neutral-700'}
                                    >
                                        {item.title}
                                        { item.correctChapter === false 
                                            ? <span className="text-transparent ml-auto mr-0">{'ch' + item.startChapter}</span>
                                            : <span className="text-transparent ml-auto mr-0">{'ch' + item.startChapter}</span>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button className="my-4 mx-auto px-4 py-2 font-bold bg-contentBg border-2 border-accent-500 text-white" onClick={reset}>Try Again</button>
                </>
            )}

            {/* New quiz range selector & button */}
            <div className="mt-36 pt-6 border-t border-slate-700">
                <h3 className="mb-2 text-lg font-semibold">Start a new Order-the-Sections Quiz</h3>
                <BQEBookChapterRangeSelector
                    verseBook={selBook}
                    firstChapter={selFirstChapter}
                    lastChapter={selLastChapter}
                    setVerseBook={setSelBook}
                    setFirstChapter={setSelFirstChapter}
                    setLastChapter={setSelLastChapter}
                />
                <button
                    onClick={startNewQuiz}
                    className="mt-4 px-4 py-2 font-bold bg-contentBg border-2 border-accent-500 text-white"
                >
                    Start New Quiz
                </button>
            </div>
        </div>
    );
}
