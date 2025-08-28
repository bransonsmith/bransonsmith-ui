import { useState } from 'react';
import BQEBookChapterRangeSelector from './BQEBookChapterRangeSelector';

export default function OtherQuizzesSection({ withDivider = false }) {
    return (
        <div className="mt-32 flex flex-col flex-wrap w-full">
            {withDivider && <span className="border-t-2 border-slate-700 w-full my-5" />}
            <h4>Other Quizzes</h4>
            <div className="my-4 mr-4 flex flex-row flex-wrap w-full gap-x-4 gap-y-4">
                <a href='/peter'><button className="border-2 border-slate-700 px-4 py-2 cursor-pointer bg-gray-800">1 Peter | Big Picture Check</button></a>
                <a href='/chapquiz/John/1/5'><button className="border-2 border-slate-700 px-4 py-2 cursor-pointer bg-gray-800">John 1-5 | Order Sections</button></a>
                {/* Future static quiz links can go here */}
            </div>
            <OrderSectionsQuickStart />
        </div>
    );
}

function OrderSectionsQuickStart() {
    const [book, setBook] = useState('John');
    const [firstChapter, setFirstChapter] = useState(1);
    const [lastChapter, setLastChapter] = useState(5);

    function start() {
        const f = parseInt(firstChapter, 10);
        const l = parseInt(lastChapter, 10);
        if (isNaN(f) || isNaN(l) || f < 1 || l < f) return;
        window.location.href = `/chapquiz/${encodeURIComponent(book)}/${f}/${l}`;
    }

    return (
        <div className="flex flex-col mt-6 p-4 border border-slate-700 rounded-md bg-gray-800 w-full max-w-3xl">
            <h5 className="mb-2 font-semibold">Order-the-Sections Quiz</h5>
            <BQEBookChapterRangeSelector
                verseBook={book}
                firstChapter={firstChapter}
                lastChapter={lastChapter}
                setVerseBook={setBook}
                setFirstChapter={setFirstChapter}
                setLastChapter={setLastChapter}
            />
            <div>
                <button
                    onClick={start}
                    className="mt-4 px-4 py-2 font-bold bg-contentBg border-2 border-accent-500 "
                >
                    Start Order-the-Sections Quiz
                </button>
            </div>
        </div>
    );
}
