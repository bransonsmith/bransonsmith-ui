import { useState } from 'react'
import BQEVerseSelector from "./BQEVerseSelector";
import './BQEQuestionAndAnswer.css'

export default function BQEQuestionAndAnswer(props) {
    return <div className="bqe-question-and-answer">

        <div className="bqe-term-to-guess">
            <div className="bqe-guess-instructions">
                Guess a verse that the following term appears in (ESV):
            </div>
            <div className="bqe-term">
                {props.term}
            </div>
        </div>
        
        <BQEVerseSelector 
            verseBook={props.verseBook}
            verseChapter={props.verseChapter}
            verseVerse={props.verseVerse}
            setVerseBook={props.setVerseBook}
            setVerseChapter={props.setVerseChapter}
            setVerseVerse={props.setVerseVerse}
        />

        <button className="bqe-verse-qa-submit" onClick={props.submitAnswer}> Submit Answer </button>
    </div>

}