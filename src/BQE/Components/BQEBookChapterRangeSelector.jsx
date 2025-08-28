import './BQEVerseSelector.css'
import { BibleData } from "../Data/BQEData"
import { useState } from "react";

export default function BQEBookChapterRangeSelector(props) {

    function handleBookChange(value) {
        props.setVerseBook(value)
        handleFirstChapterChange(1)
        handleLastChapterChange(BibleData.passage_data.filter(b => b.name === value)[0].chapters)
    }

    function handleFirstChapterChange(value) {
        props.setFirstChapter(value)
    }

    function handleLastChapterChange(value) {
        props.setLastChapter(value)
    }

    return <div className='bqe-verse-selector'>   
        <span className="row">
            <div className='bqe-labeled-select'>
                <select onChange={(event) => handleBookChange(event.target.value)} value={props.verseBook}>
                    {BibleData.passage_data.filter(b => b.testament === 'New Testament').map( b => {
                        return <option key={b.name}>{b.name}</option>
                    })}
                </select>
                <label className="bp-label"> Book </label>
            </div>
            <div className='bqe-labeled-select'>
                <select onChange={(event) => handleFirstChapterChange(event.target.value)} value={props.firstChapter}>
                    {BibleData.passage_data.filter(b => b.name === props.verseBook)[0].verseCounts.filter(vc => vc !== null).map((vc, i) => {
                        return <option key={i+1}>{i+1}</option>
                    })}
                </select>
                <label className="bp-label"> Start Chapter </label>
            </div>
            <div className='bqe-labeled-select'>
                <select onChange={(event) => handleLastChapterChange(event.target.value)} value={props.lastChapter}>
                    {BibleData.passage_data.filter(b => b.name === props.verseBook)[0].verseCounts.filter(vc => vc !== null).map((vc, i) => {
                        return <option key={i+1}>{i+1}</option>
                    })}
                </select>
                <label className="bp-label"> End Chapter </label>
            </div>
        </span>
    </div>
}
