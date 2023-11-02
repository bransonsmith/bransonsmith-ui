import axios from "axios";
import {esvGet} from './EsvApiService'

export async function createScore(score, user, scoringEngine, quizName) {

    const data = {
        UserName: user,
        Score: score,
        QuizName: quizName,
        ScoringEngine: scoringEngine,
    }

    let url = `https://wyzs9hbjag.execute-api.us-east-1.amazonaws.com/Prod/score`
    return await post(url, `Create BQE Score ${user} ${score}`, data)
} 


export async function getScores(scoringEngine) {
    let url = `https://wyzs9hbjag.execute-api.us-east-1.amazonaws.com/Prod/score?ScoringEngine=${scoringEngine}`

    return await esvGet(url, 'Get BQE Scores')
} 


async function post(url, message='Success', data) {
    let headers = {
        'Content-Type': 'application/json'
    }
    
    try {
        const createBqeResponse = await axios.post(url, data, { headers: headers })
        return { 
            error: false,
            message: message,
            data: createBqeResponse.data
        }
    }
    catch(reason) {
        console.log(reason)
        console.log(reason.message)
        return { 
            error: true,
            message: reason.message,
            data: reason
        }
    }
}
