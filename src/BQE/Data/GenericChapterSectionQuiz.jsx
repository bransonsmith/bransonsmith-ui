
import { useState } from 'react'
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
        const current = shuffledPericopes[classifyIndex];
        setClassified(prev => [...prev, { ...current, chosenChapter: chapterNum }]);
        if (classifyIndex + 1 < shuffledPericopes.length) {
            setClassifyIndex(classifyIndex + 1);
        } else {
            // Include the last classified item directly
            const lastAnswer = { ...shuffledPericopes[classifyIndex], chosenChapter: chapterNum };
            const allClassified = [...classified, lastAnswer];
            const chapters = Array.from(new Set(baselinePericopes.map(p => p.startChapter))).sort((a,b)=>a-b);
            let reviewList = [];
            chapters.forEach(ch => {
                reviewList.push({ isChapterMarker: true, chapter: ch, title: `Chapter ${ch}` });
                allClassified
                    .filter(item => item.chosenChapter === ch)
                    .forEach(item => reviewList.push(item));
            });
            setWordBank(reviewList);
            setPhase('review');
        }
    }

    function checkOrder() {
        setSubmitted(true);
        setPhase('submitted');
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
        // Create submission list (wordBank with all chapter markers filtered out)
        const submission = wordBank.filter(i => !i.isChapterMarker);
        let correct = 0;
        // Set isCorrect prop on each non-chapter marker item in wordBank
        wordBank.forEach(item => {
            if (!item.isChapterMarker) {
                item.correctChapter = isCorrectChapter(wordBank, item)
                if (item.correctChapter)
                {
                    item.isCorrect = isCorrect(submission, item.startChapter, item);
                }
                else {
                    item.isCorrect = false
                }
                if (item.isCorrect) correct++;
            }
        });

        const pointsPerCorrectChapter = 10;
        const bonusForPerfectPlacement = 1;

        let correctChapterCount = wordBank.filter(i => !i.isChapterMarker && i.correctChapter === true).length
        let correctOverallCount = wordBank.filter(i => !i.isChapterMarker && i.isCorrect === true).length
        return <div className="felx flex-col w-full">
            <div className="">{`Score: ${correctOverallCount * bonusForPerfectPlacement + correctChapterCount * pointsPerCorrectChapter} out of ${submission.length * (pointsPerCorrectChapter+bonusForPerfectPlacement)} | ${((correctOverallCount * bonusForPerfectPlacement + correctChapterCount * pointsPerCorrectChapter) / (submission.length * (pointsPerCorrectChapter+bonusForPerfectPlacement))*100).toFixed(2)}%` }</div>
            <div className="font-normal text-sm">{`${correctChapterCount} of ${submission.length} correct chapters | ${pointsPerCorrectChapter} pts each | ${(correctChapterCount/submission.length*100).toFixed(2)}%`}</div>
            <div className="font-normal text-sm">{`${correctOverallCount} of ${submission.length} perfect placement | ${bonusForPerfectPlacement} pts each | ${(correctOverallCount/submission.length*100).toFixed(2)}%`}</div>
        </div>
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

    return (
        <div className="flex flex-col w-full">
            <h2>{bookName} <span className="text-sm">{firstChapter}-{lastChapter}</span></h2>
            {phase === 'classify' && (
                <div className="flex flex-col items-center my-8">
                    <p className="mb-4">What chapter is this section in?</p>
                    <div className="text-xl font-bold mb-6">{shuffledPericopes[classifyIndex]?.title}</div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {Array.from(new Set(baselinePericopes.map(p => p.startChapter))).sort((a,b)=>a-b).map(ch => (
                            <button
                                key={ch}
                                className="px-4 py-2 rounded bg-slate-900 text-white border-2 border-accent-500 hover:bg-accent-800"
                                onClick={() => handleClassifyChapter(ch)}
                            >
                                {ch}
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-gray-400">{classifyIndex+1} of {shuffledPericopes.length}</div>
                </div>
            )}
            {phase === 'review' && (
                <>
                    <p className="mb-2">Review and reorder the sections so that they are in order. <br/> Most points are awarded for sections being put in the correct chapter, and bonus points for exact right order/global-positioning.</p>
                    {wordBank &&
                        <div className="flex flex-col w-full my-4">
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
                                    <div className="flex flex-row w-full mt-1" key={index} >
                                        <div
                                            className={`border-2 rounded-xl w-8 h-8 mr-1 my-auto text-center ${canMoveUp ? 'cursor-pointer bg-slate-900 border-slate-400' : 'bg-slate-900 border-slate-700 opacity-40 cursor-not-allowed'}`}
                                            onClick={() => canMoveUp && moveUp(index)}
                                        >^</div>
                                        <div
                                            className={`border-2 rounded-xl w-8 h-8 mr-1 my-auto text-center ${canMoveDown ? 'cursor-pointer bg-slate-900 border-slate-400' : 'bg-slate-900 border-slate-700 opacity-40 cursor-not-allowed'}`}
                                            onClick={() => canMoveDown && moveDown(index)}
                                        >v</div>
                                        <div
                                            key={index}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, item, index)}
                                            onDragOver={(e) => {
                                                if (!item.isChapterMarker && !wordBank[index].isChapterMarker) handleDragOver(e, index);
                                            }}
                                            onDragLeave={handleDragLeave}
                                            onDrop={() => {
                                                if (!item.isChapterMarker && !wordBank[index].isChapterMarker) handleDrop(index);
                                            }}
                                            className={`mx-auto my-0 py-2 px-4 rounded-md border-x-4 border-y-2 ${dragOverIndex === index ? 'border-slate-300 relative top-1 left-1' : 'border-slate-700'} w-10/12 cursor-grab bg-slate-900 ${movedIndex === index ? 'ring-4 ring-green-400 ring-opacity-80 transition-all duration-500' : ''}`}
                                            style={{ opacity: item.isChapterMarker ? 0.5 : 1 }}
                                        >
                                            {item.title}
                                            {item.iam && (
                                                <span className="mx-4 text-sm text-green-500">I AM</span>
                                            )}
                                            {item.sign && (
                                                <span className="mx-4 text-sm text-yellow-400">sign</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    }
                    <button className="my-4 mx-auto px-4 py-2 font-bold bg-contentBg border-2 border-accent-500 text-white" onClick={checkOrder}>Submit</button>
                </>
            )}
            {phase === 'submitted' && (
                <>
                    <div className="text-2xl font-bold text-slate-400">{getScoreString()}</div>
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
                                        { item.correctChapter === false &&
                                            <span className="text-gray-500 ml-auto mr-0">{'ch' + item.startChapter}</span>
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
                                        className={`mx-auto my-0  mt-1 py-2 px-4 rounded-md border-x border-y  border-neutral-900 w-full`}
                                    >
                                        {item.title}
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
