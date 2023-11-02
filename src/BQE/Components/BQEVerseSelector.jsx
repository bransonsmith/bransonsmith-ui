import './BQEVerseSelector.css'
import { BibleData } from "../Data/BQEData"
import { useState } from "react";

export default function BQEVerseSelector(props) {

    const [chapterVerses, setChapterVerses] = useState(getVersesForChapter())

    function getVersesForChapter(chapter=1) {
        const vCount = BibleData.passage_data.filter(b => b.name === props.verseBook)[0].verseCounts[chapter]
        const ommitedVersesForBook = BibleData.omitted_verses.filter(ov => ov.bookName === props.verseBook)
        const ommitedVersesForChapter = ommitedVersesForBook.filter(ov => ov.chapterNum == chapter)

        const verses = []
        for(let i = 1; i <= vCount; i++) { if (ommitedVersesForChapter.filter(ov => ov.verseNum == i).length === 0) { verses.push(i) } }
        return verses
    }

    function handleBookChange(value) {
        props.setVerseBook(value)
        handleChapterChange(1)
        handleVerseChange(1)
    }

    function handleChapterChange(value) {
        props.setVerseChapter(value)
        setChapterVerses(getVersesForChapter(value))
        handleVerseChange(1)
    }

    function handleVerseChange(value) {
        props.setVerseVerse(value)
    }

    return <div className='bqe-verse-selector'>   
        <span className="row">
            <div className='bqe-labeled-select'>
                <select onChange={(event) => handleBookChange(event.target.value)} value={props.verseBook}>
                    {BibleData.passage_data.map( b => {
                        return <option key={b.name}>{b.name}</option>
                    })}
                </select>
                <label className="bp-label"> Book </label>
            </div>
            <div className='bqe-labeled-select'>
                <select onChange={(event) => handleChapterChange(event.target.value)} value={props.verseChapter}>
                    {BibleData.passage_data.filter(b => b.name === props.verseBook)[0].verseCounts.filter(vc => vc !== null).map((vc, i) => {
                        return <option key={i+1}>{i+1}</option>
                    })}
                </select>
                <label className="bp-label"> Chapter </label>
            </div>
            <div className='bqe-labeled-select'>
                <select onChange={(event) => handleVerseChange(event.target.value)} value={props.verseVerse}>
                    {chapterVerses.map(vc => {
                        return <option key={vc}>{vc}</option>
                    })}
                </select>
                <label className="bp-label"> Verse </label>
            </div>
        </span>
    </div>
}
