import './BQEMemorizationPage.css'
import { useState } from 'react'
import { getVerse } from '../Services/EsvApiService'
import ReactDiffViewer from 'react-diff-viewer-continued';
import BQEVerseSelector from '../Components/BQEVerseSelector.js';

export default function BQEMemorizationPage() {
    
    const [bibleVersion, setBibleVersion] = useState('ESV')
    const [showDiff, setShowDiff] = useState(false)
    const [userInput, setUserInput] = useState('')
    const [actualVerse, setActualVerse] = useState('')
    const [loading, setLoading] = useState(false)

    const [verseBook, setVerseBook] = useState('Genesis')
    const [verseChapter, setVerseChapter] = useState(1)
    const [verseVerse, setVerseVerse] = useState(1)

    const [verseCache, setVerseCache] = useState({})

    function reset() {
        setShowDiff(false)
        setUserInput('')
    }

    function tryCache() {
        if(Object.hasOwn(verseCache, verseBook + ' ' + verseChapter + ':' + verseVerse)) {
            setActualVerse(verseCache[verseBook + ' ' + verseChapter + ':' + verseVerse])
        }
    }

    async function checkAnswer() {
        setLoading(true)
        const result = await getVerse(verseBook, verseChapter, verseVerse)
        if (result.error) {
            setActualVerse('')
        }
        else {
            const actual = result.data.passages[0].replace('(ESV)', '').trim()
            setActualVerse(actual)
        }
        setShowDiff(true)
        setLoading(false)
    }

    return <div className="bran-page">
        <div className='content-container'>
            
            { showDiff
            ? <div className='bqe-mem-pre-answer'>
                { loading 
                    ? <div>
                        <div className='bqe-mem-verse'>{`${verseBook + ' ' + verseChapter + ':' + verseVerse}` + ' (ESV)'}</div>
                        <div className="dot-flashing"/>
                    </div>
                    : <div className='bqe-diff'>
                        <div className='bqe-mem-verse'>Differences (your guess is on the bottom)</div>
                        
                        <ReactDiffViewer style={{'border': 'none'}} showDiffOnly={false} oldValue={actualVerse} newValue={userInput} splitView={false} hideLineNumbers={true}/>

                        <div className='bqe-mem-verse actual'>{actualVerse}</div>
                        <div className='bqe-mem-verse'>{`${verseBook + ' ' + verseChapter + ':' + verseVerse}` + ' (ESV)'}</div>
                        
                        
                        <button className='bqe-button' onClick={reset}><div className='bqe-button-text'>Reset</div></button>
                    </div>
                }
            
            </div>
            : <div className='bqe-mem-pre-answer'>
                <div  className='bqe-mem-instructions'> 
                    Pick a verse, then try to type it exactly. (ESV)
                </div>

                <BQEVerseSelector 
                    verseBook={verseBook}
                    verseChapter={verseChapter}
                    verseVerse={verseVerse}
                    setVerseBook={setVerseBook}
                    setVerseChapter={setVerseChapter}
                    setVerseVerse={setVerseVerse}
                />
                <textarea className='bqe-input' placeholder={`Type ${verseBook + ' ' + verseChapter + ':' + verseVerse} here`} value={userInput} onChange={(event) => setUserInput(event.target.value)}/>
                <button className='bqe-button bqe-mem-check-answer' onClick={checkAnswer}><div className='bqe-button-text'>Check Answer</div></button>
            </div>
            }
            
            <div className='edged-item esv-copyright bqe-mem-footer'>
                <div className='esv-copyright-text'>
                Scripture quotations marked “ESV” are from the ESV® Bible 
                (The Holy Bible, English Standard Version®), 
                copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. 
                Used by permission. All rights reserved. The ESV text may not be quoted in any 
                publication made available to the public by a Creative Commons license. 
                The ESV may not be translated into any other language.

                Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible.
                </div>
            </div>
        </div>
    </div>
}
