import { useEffect, useState } from 'react'
import { JohnQuizData } from '../Data/JohnQuizData15.js'

export default function JohnQuizPageHead() {

    const [wordBank, setWordBank] = useState(getShuffledListOfJohnQuizData())
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [answerKey, setAnswerKey] = useState(generateAnswerKey())

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

        let fullList = []
        let lastInsertedChapter = 0
        JohnQuizData.forEach(p => {
            while (p.startChapter > lastInsertedChapter) {
                lastInsertedChapter++
                fullList.push({
                    isChapterMarker: true,
                    chapter: lastInsertedChapter,
                    title: `Chapter ${lastInsertedChapter}`
                })
            }
            let pCopy = {
                ...p
            }
            pCopy.isCorrect = undefined
            fullList.push(pCopy)
        })
        return fullList
    }

    function getShuffledListOfJohnQuizData() {
        const numChapters = 5;
        const chapterMarkers = [];
        for (let ch = 1; ch <= numChapters; ch++) {
            chapterMarkers.push({
                isChapterMarker: true,
                chapter: ch,
                title: `Chapter ${ch}`
            });
        }

        const shuffledPericopes = [...JohnQuizData];
        for (let i = shuffledPericopes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPericopes[i], shuffledPericopes[j]] = [shuffledPericopes[j], shuffledPericopes[i]];
        }

        const itemsPerChapter = shuffledPericopes.length / numChapters;
        let finishedList = [];
        let nextPericope = 0;
        for (let ch = 1; ch <= numChapters; ch++) {
            finishedList.push({
                isChapterMarker: true,
                chapter: ch,
                title: `Chapter ${ch}`
            });
            // Calculate the target index for this chapter
            const nextTarget = Math.round(itemsPerChapter * ch);
            while (nextPericope < nextTarget && nextPericope < shuffledPericopes.length) {
                finishedList.push(shuffledPericopes[nextPericope]);
                nextPericope++;
            }
        }
        return finishedList;
    }

    function checkOrder() {
        setSubmitted(true)
    }

    function reset() {
        setSubmitted(false)
        const shuffled = getShuffledListOfJohnQuizData()
        setWordBank(shuffled)
    }


        function isCorrect(submission, chapterGuess, item) {
            // Returns true if the item is in the same index in submission as in JohnQuizData
            const idx = submission.findIndex(i => i.title === item.title);
            const correctIdx = JohnQuizData.findIndex(i => i.title === item.title);
            return idx === correctIdx;
        }

    function getScoreString() {
        // Create submission list (wordBank with all chapter markers filtered out)
        const submission = wordBank.filter(i => !i.isChapterMarker);
        let correct = 0;
        // Set isCorrect prop on each non-chapter marker item in wordBank
        wordBank.forEach(item => {
            if (!item.isChapterMarker) {
                item.isCorrect = isCorrect(submission, item.startChapter, item);
                if (item.isCorrect) correct++;
            }
        });
        return `${correct} of ${submission.length} | ${(correct/submission.length*100).toFixed(2)}%`;
    }

    function moveUp(index) {
        if (index > 0) {
            const newWordBank = [...wordBank];
            [newWordBank[index], newWordBank[index - 1]] = [newWordBank[index - 1], newWordBank[index]];
            setWordBank(newWordBank);
        }
    }

    function moveDown(index) {
        if (index < wordBank.length - 1) {
            const newWordBank = [...wordBank];
            [newWordBank[index], newWordBank[index + 1]] = [newWordBank[index + 1], newWordBank[index]];
            setWordBank(newWordBank);
        }
    }

    return <div className="flex flex-col w-full">
        <h2>John </h2>
        <p>Sort the following section titles from the book of John (ESV).
            <br/> (desktop can drag and drop, mobile users use the up and down buttons to move items)
        </p>

        {submitted
        ? <>
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
                    return (
                        <div
                            key={index}
                            className={`mx-auto my-0 py-2 px-4 rounded-md border-x-2 border-y-2 ${item.isCorrect === true ? 'bg-accent-700' : item.isCorrect === false ? 'bg-red-950' : ''} border-neutral-900 w-full`}
                        >
                            {item.title}
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
                            className={`mx-auto my-0 py-2 px-4 rounded-md border-x-2 border-y-2 ${item.isCorrect === true ? 'bg-accent-700' : item.isCorrect === false ? 'bg-red-950' : ''} border-neutral-900 w-full`}
                        >
                            {item.title}
                        </div>
                    );
                })}
            </div>
        </div>
            <button className="my-4 mx-auto px-4 py-2 font-bold bg-contentBg border-2 border-accent-500 text-white" onClick={reset}>Try Again</button>
        </>
        :<>
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
                                    className={`border-2 rounded-xl w-8 h-8 mr-1 my-auto text-center ${canMoveUp ? 'cursor-pointer bg-slate-600 border-slate-400' : 'bg-slate-900 border-slate-700 opacity-40 cursor-not-allowed'}`}
                                    onClick={() => canMoveUp && moveUp(index)}
                                >^</div>
                                <div
                                    className={`border-2 rounded-xl w-8 h-8 mr-1 my-auto text-center ${canMoveDown ? 'cursor-pointer bg-slate-600 border-slate-400' : 'bg-slate-900 border-slate-700 opacity-40 cursor-not-allowed'}`}
                                    onClick={() => canMoveDown && moveDown(index)}
                                >v</div>
                                <div
                                    key={index}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item, index)}
                                    onDragOver={(e) => {
                                        // Only allow drag over if not a chapter marker and within same chapter
                                        if (!item.isChapterMarker && !wordBank[index].isChapterMarker) handleDragOver(e, index);
                                    }}
                                    onDragLeave={handleDragLeave}
                                    onDrop={() => {
                                        // Only allow drop if not on a chapter marker and within same chapter
                                        if (!item.isChapterMarker && !wordBank[index].isChapterMarker) handleDrop(index);
                                    }}
                                    className={`mx-auto my-0 py-2 px-4 rounded-md border-x-4 border-y-2 ${dragOverIndex === index ? 'border-slate-300 relative top-1 left-1' : 'border-slate-700'} w-10/12 cursor-grab bg-slate-700`}
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
        }
        
    </div>
}

