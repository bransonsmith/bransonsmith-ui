import './BQEPage.css'
import '../Components/BQEQuizReport.css'
import BQETermSearch from "../Components/BQETermSearch";
import BQEVerseSearchAndDisplay from '../Components/BQEVerseSearchAndDisplay';
import { useEffect, useState } from 'react';
import { getScores } from '../Services/BQEScoreService';
import { Helmet } from 'react-helmet';

export default function BQEPage(props) {

    const [loading, setLoading] = useState(false)
    const [scores, setScores] = useState([])

    useEffect( () => {
        async function loadLeaderBoard() {
            setLoading(true)
            const leaderboardRes = await getScores('BasicJSv1');
            if (!leaderboardRes.error) {
                setScores(leaderboardRes.data)
            } 
        }
        loadLeaderBoard();
        setLoading(false)
        }
      , []); // Only re-run the effect if count changes

    function getFormattedDate(dateFromBackend) {
        // 14/01/2023 comes in like DD/MM/YYYY
        // return like MM/DD/YYYY
        var split = dateFromBackend.split('/')
        var dateStr = `${split[1]}/${split[0]}/${split[2]}`
        return dateStr
    }
    return (
        <div className='bran-page'>
            
            <Helmet>
                <title>BQE - Bible Quiz Extraordinaire | Branson Smith</title>
                <meta name="description" content="BQE. Bible Quiz Extraordinaire is Bible Trivia Quiz Game to test how well you know the word! Random Bible Quiz. Random Quiz. BQE" />
                <link rel="canonical" href={`https://www.bransonsmith.dev/BQE`} />
            </Helmet>
            <div className="bqe-page">
                <br/><br/><br/>
                <h1 className="bp-item" style={{'textAlign': 'center'}}>Bible Quiz Extraordinaire!</h1>
                <a href="/BQE/Quiz" className='flex-row bp-item'><button className='flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-lg'><span className='flex-col breath '>Take the Random Quiz!</span></button></a>

                { scores && scores.length > 0
                ? <div className='bqe-score-board'>
                    <div className='bqe-score-board-title'>Random Quiz Leaderboard</div>
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
                : <div className='leaderboard-placeholder'>
                    <div className='dot-flashing'></div>
                </div>
                }

                <div className="mt-10 flex flex-col flex-wrap w-full">
                    <h4>Other Quizzes</h4>
                    <div className="my-4 mr-4 flex flex-row flex-wrap w-full gap-x-4 gap-y-4">
                        <a href='/peter'><button className="border-2 border-slate-700 px-4 py-2 cursor-pointer">1 Peter | Big Picture Check</button></a>
                        <a href='/johnquiz1-5'><button className="border-2 border-slate-700 px-4 py-2 cursor-pointer">John 1-5 | Order Sections</button></a>
                        <a href='/johnquiz'><button className="border-2 border-slate-700 px-4 py-2 cursor-pointer">John Full | Order Sections</button></a>
                    </div>
                </div>

                <br/><br/><br/>
                <div className='edged-item' style={{'padding': 'min(50px, 5%)'}}>
                    <h2 className="bp-item">Verse Lookup</h2>
                    <BQEVerseSearchAndDisplay/> 
                </div>
                <br/><br/><br/>
                <br/><br/><br/>
                <div className='edged-item' style={{'padding': '40px min(50px, 5%)', 'width': 'calc(100%)'}}>
                    <h2 className="bp-item">Term Search</h2>
                    <BQETermSearch/>
                </div>

                
            </div>
        </div>
    )
} 