import { useState, useEffect } from 'react'
import './BQEQuizReport.css'
import { createScore, getScores } from '../Services/BQEScoreService';

export default function BQEQuizReport(props) {

    const [showScoreForm, setShowScoreForm] = useState(false);
    const [loading, setLoading] = useState(false)
    const [scoreName, setScoreName] = useState('')
    const [message, setMessage] = useState(null)
    const [showLeaderBoard, setShowLeaderBoard] = useState(false)
    const [scores, setScores] = useState([])
    const [submittedScore, setSubmittedScore] = useState(false)

    useEffect( () => {
        async function loadLeaderBoard() {
            const leaderboardRes = await getScores('BasicJSv1');
            if (!leaderboardRes.error) {
                setScores(leaderboardRes.data)
                setShowLeaderBoard(true)
            } else {
                setMessage('Failed to load leaderboard.')
                // setSubmittedScore(false)
            }
        }
        loadLeaderBoard();
        }
      , []); // Only re-run the effect if count changes
    
    async function uploadAScore() {
        if (scoreName === null || scoreName === undefined || scoreName.length === 0) {
            setMessage('Specify your name for the leaderboard.')
            return
        }
        setLoading(true)
        setSubmittedScore(true)
        const res = await createScore(props.scores.reduce((s, c) => {return s + c}, 0), scoreName, 'BasicJSv1', 'Full Random')
        if (!res.error) {
            setMessage(null)
            const leaderboardRes = await getScores('BasicJSv1');
            if (!leaderboardRes.error) {
                setScores(leaderboardRes.data)
                setShowLeaderBoard(true)
            } else {
                setMessage('Failed to update leaderboard.')
                // setSubmittedScore(false)
            }
        } else {
            setMessage('Failed to submit score.')
            setSubmittedScore(false)
        }
        setShowScoreForm(false)
        setLoading(false)
    }

    function getFormattedDate(dateFromBackend) {
        // 14/01/2023 comes in like DD/MM/YYYY
        // return like MM/DD/YYYY
        var split = dateFromBackend.split('/')
        var dateStr = `${split[1]}/${split[0]}/${split[2]}`
        return dateStr
    }

    return <div className='bqe-quiz-report'>
        <div className='bqe-quiz-report-header'>
            <div className='bqe-quiz-title'>Quiz Report - {props.title}</div>
            <div className='bqe-quiz-date'>{new Date().toLocaleString()}</div>
        </div>
        <div className='bqe-quiz-report-questions'>
            <div className='bqe-q-header-row'>
                <div className='bqe-q-header bqe-q-n'></div>
                <div className='bqe-q-header bqe-q-q'><div className='bqe-q-col-text'>Term</div></div>
                <div className='bqe-q-header bqe-q-a'><div className='bqe-q-col-text'>Guess</div></div>
                <div className='bqe-q-header bqe-q-p'><div className='bqe-q-col-text'>Possible Verses</div></div>
                <div className='bqe-q-header bqe-q-s'><div className='bqe-q-col-text'>Score</div></div>
            </div>
            {props.questions.map( (q, i)  => {
                return <div className='bqe-quiz-report-question' key={i}>
                    <div className='bqe-q-col bqe-q-n'><div className='bqe-q-col-text'>{i+1}</div></div>
                    <div className='bqe-q-col bqe-q-q'><div className='bqe-q-col-text'>
                        {props.questions[i]}</div>
                    </div>
                    <div className='bqe-q-col bqe-q-a'><div className='bqe-q-col-text'>
                        {props.scores[i] > 20 || (props.scores[i] > 0 && props.obscureBooks.includes(props.answers[i].book))
                            ? <span className='bqe-score-highlight'>{props.answers[i].book + ' ' + props.answers[i].chapter + ':' + props.answers[i].verse}</span>
                            : <span>{props.answers[i].book + ' ' + props.answers[i].chapter + ':' + props.answers[i].verse}</span>
                        }</div>
                    </div>
                    <div className='bqe-q-col bqe-q-p'><div className='bqe-q-col-text'>
                        {props.possibleAnswers[i] < 4 && props.scores[i] > 0
                        ? <span className='bqe-score-highlight'>{props.possibleAnswers[i]}</span>
                        : <span>{props.possibleAnswers[i]}</span>
                        }</div>
                    </div>
                    <div className='bqe-q-col bqe-q-s'><div className='bqe-q-col-text'>
                        {props.scores[i] > 0
                        ? <span className='bqe-score-highlight'>{props.scores[i]}</span>
                        : <span>{props.scores[i]}</span>
                        }</div>
                    </div>
                </div>
            })}
        </div>
        <div className='bqe-quiz-report-footer'>

            <div className='bqe-quiz-report-total-row'>
                <div className='bqe-quiz-report-total-label'>Total Score</div>
                <div className='bqe-quiz-report-total-score'>{props.scores.reduce((s, c) => {return s + c}, 0)}</div>
            </div>

            { showScoreForm
            ? <span> { loading
                ? <div className='dot-flashing'></div>
                :<div className='bqe-score-form'>
                    <input placeholder="name" className="bqe-submit-score-form-text" id="search-form" type="text" onChange={(event) => setScoreName(event.target.value)}/>
                    {/* <input className='bqe-score-form-name' placeholder='name' value={scoreName} onChange={}/>   */}
                    <button className='bqe-submit-score-form-submit' onClick={uploadAScore}>Submit Score</button>
                </div>
            }</span> 
            : <span className='flexed'> { !loading && !submittedScore && props.scores.reduce((s, c) => {return s + c}, 0) > 0
                ? <button className='bqe-submit-score' onClick={() => setShowScoreForm(true)}>Submit Score To Public Leaderboard</button>
                : <span/>
            }
            </span>
            }
            
            { showLeaderBoard && scores && scores.length > 0
            ? <div className='bqe-score-board'>
                <div className='bqe-score-board-title'>Quiz Leaderboard</div>
                <div className='bqe-score-board-row'>
                    <div className='bqe-score-board-header bsb-i'><div className='bqe-score-board-header-text'></div></div>
                    <div className='bqe-score-board-header bsb-n'><div className='bqe-score-board-header-text'>Name </div></div>
                    <div className='bqe-score-board-header bsb-s'><div className='bqe-score-board-header-text'>Score </div></div>
                    <div className='bqe-score-board-header bsb-d'><div className='bqe-score-board-header-text'>Date</div></div>
                </div>
                {scores.slice(0, Math.min(scores.length, 10)).map((s, i) => {
                    return <div className='bqe-score-board-row' key={s.ScoreId}>
                        <div className='bqe-score-board-col bsb-i'><div className='bqe-score-board-col-text'>{i+1}</div></div>
                        <div className='bqe-score-board-col bsb-n'><div className='bqe-score-board-col-text'>{s.UserName} </div></div>
                        <div className='bqe-score-board-col bsb-s'><div className='bqe-score-board-col-text'>{s.Score} </div></div>
                        <div className='bqe-score-board-col bsb-d'><div className='bqe-score-board-col-text'>{getFormattedDate(s.Date.split(' ')[0])}</div></div>
                    </div>
                })}
            </div>
            :<span/>
            }

            {message
            ?<div>{message}</div>
            :<span/>}
        </div>
    </div>
}
