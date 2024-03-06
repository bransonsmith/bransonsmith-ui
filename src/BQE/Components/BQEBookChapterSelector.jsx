import './BQEVerseSelector.css'
import { BibleData } from "../Data/BQEData"
import { useState } from "react";

export default function BQEBookChapterSelector(props) {

    function handleBookChange(value) {
        props.setVerseBook(value)
        handleChapterChange(1)
    }

    function handleChapterChange(value) {
        props.setVerseChapter(value)
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
        </span>
    </div>
}
