import { useEffect, useRef, useState } from "react";
import { getChapter } from "../Services/EsvApiService";
import { BibleData } from "../Data/BQEData"
import BQEBookChapterSelector  from "../Components/BQEBookChapterSelector"
import { Helmet } from 'react-helmet';

export default function BibleReadingPage() {
    const ref = useRef();
    const paragraphRefs = useRef([]);

    const [tvMode, setTvMode] = useState(false);
    const [reachedEndOfCurrentChapter, setReachedEndOfCurrentChapter] = useState(true);
    const [showBookChapterSelectionForm, setShowBookChapterSelectionForm] = useState(true)

    const [bookSelectorValue, setBookSelectorValue] = useState('Genesis');
    const [chapterSelectorValue, setChapterSelectorValue] = useState(1);

    const [book, setBook] = useState('');
    const [chapter, setChapter] = useState(1);
    const [paragraphs, setParagraphs] = useState([]);
    const [numberOfChaptersInBook, setNumberOfChaptersInBook] = useState(0)
    const [firstChapter, setFirstChapter] = useState(0)
    const [lastFetchedChapter, setLastFetchedChapter] = useState(0)

    const handleBookChange = (value) => { setBookSelectorValue(value) }
    const handleChapterChange = (value) => { setChapterSelectorValue(value) }

    const bookChapterCache = {}

    async function SubmitBookChapterSelection() {
        setBook(bookSelectorValue);
        setChapter(chapterSelectorValue);

        setParagraphs([])
        setShowBookChapterSelectionForm(false)
        window.scrollTo(0, 0)
        setNumberOfChaptersInBook(BibleData.passage_data.find(b => b['name'] == bookSelectorValue).chapters)
        setFirstChapter(chapterSelectorValue)
        setLastFetchedChapter(0)

        let chapterContent = await getChapterParagraphs(bookSelectorValue, chapterSelectorValue)
        setParagraphs(chapterContent)
        setLastFetchedChapter(chapterSelectorValue)
        setReachedEndOfCurrentChapter(false)
    }

    async function getChapterParagraphs(bookName, chapterNumber) {

        if (Object.keys(bookChapterCache).includes(bookName + chapterNumber)) { return bookChapterCache[bookName + chapterNumber]; }

        let resp = await getChapter(bookName, chapterNumber)
        let newChapterParagraphs = resp.data.passages[0]
            .replace('(ESV)', '')
            .replace('\n\n', '\n')
            .split('    ')
            .filter(p => /\S/.test(p))
            .map(p => { return {chapter: chapterNumber, book: bookName, content: p} });
        
        if (Object.keys(bookChapterCache).length > 20) { delete bookChapterCache[Object.keys(bookChapterCache)[0]]; }

        bookChapterCache[bookName + chapterNumber] = newChapterParagraphs

        return newChapterParagraphs
    }

    useEffect(() => {
        let doneLoadingChapters = lastFetchedChapter >= numberOfChaptersInBook;
        if (!doneLoadingChapters && reachedEndOfCurrentChapter) {
            loadNextChapter()
        }

        async function loadNextChapter() {
            var newChapterParagraphs = await getChapterParagraphs(book, lastFetchedChapter + 1)
            setLastFetchedChapter(Number(lastFetchedChapter) + 1)

            let existingParagraphs = paragraphs
            let allParagraphs = existingParagraphs.concat(newChapterParagraphs)

            setParagraphs(allParagraphs)
            setReachedEndOfCurrentChapter(false)
        }
    }, [reachedEndOfCurrentChapter])

    useEffect(() => { // check when the ref appears on screen, set reachedEndOfCurrentChapter, used to autoload next chapter
        const observer = new IntersectionObserver((entries) => {
          const [entry] = entries;
          setReachedEndOfCurrentChapter(entry.isIntersecting);
        });
    
        if (ref.current) { observer.observe(ref.current); }
        return () => { if (ref.current) { observer.unobserve(ref.current); } };
      }, [ref, ref.current]);

    return <div>
        <Helmet>
            <title>Extended Bible Reading | Branson Smith</title>
            <meta name="description" content="Read large portions of the Bible continuously with this esv bible viewer." />
            <link rel="canonical" href={`https://www.bransonsmith.dev/biblereading`} />
        </Helmet>
        <div className='w-full max-w-[100%] sticky top-0 text-shadow bg-defaultBg py-2 px-8 rounded-md '>
            {showBookChapterSelectionForm 
                ? <div className="cursor-pointer">
                    <div className="flex flex-row w-full">
                        <div className="text-accent-300 font-bold" onClick={() => setShowBookChapterSelectionForm(false)}> [hide] </div>
                        <div className="text-stone-600 cursor-pointer ml-auto mr-10" onClick={() => setTvMode(!tvMode)}> [Contrast] </div>
                    </div>
                    <div className="flex flex-row max-w-[100%] flex-wrap">
                        <BQEBookChapterSelector verseBook={bookSelectorValue} verseChapter={chapterSelectorValue} setVerseBook={handleBookChange} setVerseChapter={handleChapterChange}/>
                        <button className="bg-contentBg border-2 border-gray-700 px-5 py-2 h-fit m-auto hover:text-gray-100 hover:shadow-lg" onClick={SubmitBookChapterSelection}>
                            Go to Chapter
                        </button>
                    </div>
                </div>
                : 
                <div className="flex flex-row w-full">
                    <div className=" cursor-pointer font-bold text-accent-300" onClick={() => setShowBookChapterSelectionForm(true)}> 
                        [select book/chapter]
                    </div>
                    <div className="text-stone-600 cursor-pointer ml-auto mr-10" onClick={() => setTvMode(!tvMode)}> [Contrast] </div>
                </div>
            }
            { book.length > 0 && chapter > 0 &&
                <div className="text-slate-600"> 
                    <span className="text-2xl font-bold mr-4 "> {book}</span> 
                    { lastFetchedChapter > firstChapter
                        ? <span className="">chapters {firstChapter}-{lastFetchedChapter} of {numberOfChaptersInBook} (ESV)</span>
                        : <span className="">chapter {firstChapter} of {numberOfChaptersInBook} (ESV)</span>
                    }
                </div>
            }
        </div>
        { book.length > 0 && chapter > 0 &&
            <div className="w-[100%] max-w-[500px] m-auto p-0">
                <div className="text-lg font-serif leading-8 text-justify">
                    {paragraphs.map((paragraph, index) => {
                        return <span id={`${paragraph.book}-${paragraph.chapter}-${index}`} 
                        key={`${paragraph.book}-${paragraph.chapter}-${index}`}>{ tvMode 
                        ? <p className="p-0 text-stone-200 font-sans font-bold text-lg" 
                            >
                            &nbsp;{paragraph.content}
                        </p>
                        :<p className="p-0 text-stone-500 font-sans font-monospace">
                                &nbsp;&nbsp; {paragraph.content}
                        </p>
                        }</span>
                            
                    })}
                </div>
                <div ref={ref}></div>
            </div>
        }
    </div>
}