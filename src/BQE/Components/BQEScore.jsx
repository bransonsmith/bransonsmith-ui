import { useState } from 'react';
import { createScore, getScores } from '../Services/BQEScoreService';

async function uploadAScore() {
    const res = await createScore(123, 'BranDawg', 'BasicJSv1', 'Full Random')
}


export default function BQEScore() {

    const [scores, setScores] = useState(null)

    async function getScoresFromService() {
        const res = await getScores('BasicJSv1');
        // console.log(res)
        if (!res.error) {
            setScores(res.data)
        }
    }

    return <div className='bqe-score-up'>
        <button onClick={uploadAScore}>Upload test score</button>

        <button onClick={getScoresFromService}>Get Scores</button>
        { scores !== null && scores
        ? <div>
            {scores.map(s => {
                return <div key={s.ScoreId}>{s.UserName} {s.Score}</div>
            })}
        </div>
        :<span/>
        }
    </div>
}

