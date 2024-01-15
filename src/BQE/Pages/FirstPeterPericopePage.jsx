import { useEffect, useState } from 'react'
import { Pericopes } from '../Data/FirstPeter.js'

export default function FirstPeterPericopePage() {

    const [wordBank, setWordBank] = useState(getShuffledListOfPericopes())
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
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

    function getShuffledListOfPericopes() {

        function shuffle(array) {
            array.sort(() => Math.random() - 0.5);
        }

        let ps = []
        Pericopes.forEach(p => { ps.push(p) });
        shuffle(ps)
        return ps
    }

    function checkOrder() {
        setSubmitted(true)
    }

    function reset() {
        setSubmitted(false)
        const shuffled = getShuffledListOfPericopes()
        setWordBank(shuffled)
    }

    function isCorrect(title) {

        const userGuessIndex = wordBank.findIndex(i => i.Title === title);
        const correctIndex  = Pericopes.findIndex(i => i.Title === title);

        return userGuessIndex === correctIndex
    }

    function getScoreString() {
        var correct = 0
        for (let i = 0; i < wordBank.length; i++) {
            const a = wordBank[i];
            const b = Pericopes[i];
            if (a.Title === b.Title) {
                correct++
            }
        }
        return `${correct} of ${wordBank.length} | ${(correct/wordBank.length*100).toFixed(2)}%`
    }

    return <div className="flex flex-col w-full">
        <h2>1 Peter </h2>
        <p>Sort the following section titles from the book of 1 Peter as given by the ESV.
            <br/>This isn't a test of ESV knowledge, as much as a general check on the order of topics in 1 Peter!
        </p>

        {submitted
        ? <>
            <div className="text-2xl font-bold text-slate-400">{getScoreString()}</div>
            <div className="flex flex-row w-full">

            <div className="flex flex-col w-5/12 my-0 mx-auto">
                <h3> Your Guess </h3>
                {wordBank.map((item, index) => (
                    <div 
                        key={index} 
                        className={`mx-auto my-0 py-2 px-4 rounded-md border-x-4 border-y-2 ${isCorrect(item.Title) ? 'bg-accent-700' : 'bg-red-950'} border-slate-700 w-full`}
                    >
                        {item.Title}
                    </div>
                ))}
            </div>
            <div className="flex flex-col w-5/12 my-0 mx-auto">
                <h3> Correct Order </h3>
                {Pericopes.map((item, index) => (
                    <div 
                        key={index} 
                        className={`mx-auto my-0 py-2 px-4 rounded-md border-x-4 border-y-2 bg-slate-600 border-slate-700 w-full`}
                    >
                        {item.Title}
                    </div>
                ))}
            </div>
        </div>
            <button className="my-4 mx-auto px-4 py-2 font-bold bg-contentBg border-2 border-accent-500 text-white" onClick={reset}>Try Again</button>
            
        </>
        :<>
            {wordBank &&
                <div className="flex flex-col w-full my-4">
                    {wordBank.map((item, index) => (
                        <div 
                            key={index} 
                            draggable 
                            onDragStart={(e) => handleDragStart(e, item, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(index)}
                            className={`mx-auto my-0 py-2 px-4 rounded-md border-x-4 border-y-2 ${dragOverIndex === index ? 'border-slate-300 relative top-1 left-1' : 'border-slate-700'} w-10/12 cursor-grab`}
                        >
                            {item.Title}
                        </div>
                    ))}
                </div>
            }
            <button className="my-4 mx-auto px-4 py-2 font-bold bg-contentBg border-2 border-accent-500 text-white" onClick={checkOrder}>Submit</button>
        </>
        }
        
    </div>
}

