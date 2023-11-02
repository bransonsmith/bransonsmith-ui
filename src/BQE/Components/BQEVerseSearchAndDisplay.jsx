import { useState } from "react";
import { getVerse } from '../Services/EsvApiService'
import BQEVerse from "./BQEVerse";
import BQEVerseSelector from "./BQEVerseSelector";

export default function BQEVerseSearchAndDisplay(props) {
    
    const [lastSearch, setLastSearch] = useState({book: 'Genesis', chapter: 1, verse: 1})
    const [verse, setVerse] = useState('In the beginning, God created the heavens and the earth. (ESV)')
    const [loading, setLoading] =useState(false)
    const [esvVerseResponse, setEsvVerseResponse] = useState(null)
    const [esvVerseError, setEsvVerseError] = useState(null)
    const [verseBook, setVerseBook] = useState('Genesis')
    const [verseChapter, setVerseChapter] = useState(1)
    const [verseVerse, setVerseVerse] = useState(1)

    async function lookupVerse() {
        if (lastSearch.book == verseBook && lastSearch.chapter == verseChapter && lastSearch.verse == verseVerse) {
            return
        }
        setLoading(true)
        const serviceResp = await getVerse(verseBook, verseChapter, verseVerse)
        setEsvVerseResponse(serviceResp)
        if (serviceResp.error) {
            setEsvVerseError(serviceResp.message)
            setVerse(null)
        }
        else {
            setEsvVerseError(null)
            setVerse(serviceResp.data.passages)
            setLastSearch({book: verseBook, chapter: verseChapter, verse: verseVerse})
        }

        setLoading(false)
    }

    return <div className="bqe-verse-search-and-display">

        <div className='bqe-verse-display'><BQEVerse verse={verse}/></div>
        <BQEVerseSelector 
            verseBook={verseBook}
            verseChapter={verseChapter}
            verseVerse={verseVerse}
            setVerseBook={setVerseBook}
            setVerseChapter={setVerseChapter}
            setVerseVerse={setVerseVerse}
        />

        {loading ? <div className='dot-flashing'></div> : <div className='loading-spacer'/> }
        <button className="bp-item bqe-verse-selector-submit" onClick={lookupVerse}> Get Verse </button>
        
        {esvVerseError
        ? <div>
            <h2>Error getting esv verse</h2>
            <p>{esvVerseError}</p>
        </div> : <span/> }

    </div>
}
