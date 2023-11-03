import { useState } from 'react'
import BQEQuestionAndAnswer from '../Components/BQEQuestionAndAnswer'
import './BQERandomQuizPage.css'
import { getReferencesForTerm, getRandomTerm } from '../Services/BibleTermService';
import { getSearchResult, getVerse } from '../Services/EsvApiService';
import { getBestScoreInfo } from '../Services/BQEScoreRandomVerseAnswer';
import BQEVerse from '../Components/BQEVerse';
import BQEQuizReport from '../Components/BQEQuizReport';
import { Helmet } from 'react-helmet';

export default function BQERandomQuizPage(props) {

    /*
        Gets random terms from esv concordance and asks user to
        guess the book/chapter/verse the term is in.

        Number of questions/terms comes in as a prop
    */
    const QUIZ_STATES = {
        PRE: 'Show instructions before quiz starts', 
        QUE: 'Show the question',
        ANS: 'Show the answers/score that question',
        POS: 'Post-quiz summary'
    }

    const [quizState, setQuizState] = useState(QUIZ_STATES.PRE)
    const [score, setScore] = useState(0)
    const [lastQuestionScore, setLastQuestionScore] = useState(0)
    const [currentQuestionCorrectAnswers, setCurrentQuestionCorrectAnswers] = useState([])
    const [currentQuestionBestAnswer, setCurrentQuestionBestAnswer] = useState(null)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [questionCount, setQuestionCount] = useState(5)
    const [selectedVerse, setSelectedVerse] = useState(null)
    const [selectedReference, setSelectedReference] = useState(null)
    const [guessVerse, setGuessVerse] = useState(null)

    const [showingScore, setShowingScore] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [lastScoreInfo, setLastScoreInfo] = useState(null)

    const [submittedAnswers, setSubmittedAnswers] = useState([])
    const [completedQuestions, setCompletedQuestions] = useState([])
    const [questionScores, setQuestionScores] = useState([])
    const [possibleAnswerCounts, setPossibleAnswerCounts] = useState([])

    const [verseBook,     setVerseBook] = useState('Genesis')
    const [verseChapter,  setVerseChapter] = useState(1)
    const [verseVerse,    setVerseVerse] = useState(1)

    const [obscureBooks,    setObscureBooks] = useState(['Ruth', 'Ezra', 'Nehemiah', 'Lamentations', 'Joel', 'Amos', 'Obadiah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zecharriah', 'Malachi', 'Philemon', '3 John', 'Jude'])

    async function startQuiz() {
        await getNextQuestionTerm()
        setQuizState(QUIZ_STATES.QUE)
    }

    async function getNextQuestionTerm() {
        return setCurrentQuestion(await getRandomTerm())
    }

    async function getCurrentScore(answer) {
        const searchRes = (await getSearchResult(currentQuestion))

        const correctAnswers = searchRes.data.results.map(r => {
            const colonSplit = r.reference.split(':')
            let parsedChapter = 0
            let parsedBook = ''
            let parsedVerse = 0
            if (colonSplit.length > 1) {
                const preColonSplit = colonSplit[0].split(' ')
                parsedChapter = preColonSplit.pop()
                parsedBook = preColonSplit.join(' ')
                parsedVerse = colonSplit[1].split(' ')[0]
            } else {
                parsedChapter = 1
                const secondSplit = colonSplit[0].split(' ')
                parsedBook = secondSplit[0]
                parsedVerse = secondSplit[secondSplit.length - 1]
            }
            return {
                book: parsedBook,
                chapter: parsedChapter,
                verse: parsedVerse,
                full: r.content,
                reference: r.reference
            }
        })
        
        setCurrentQuestionCorrectAnswers(correctAnswers)

        let engine = 'BasicJSv1'
        const bestScoreInfo = getBestScoreInfo(correctAnswers, answer, engine)
        let bestScore = bestScoreInfo['answerScore']
        let bestAnswer = bestScoreInfo['answer']
        let scoreMessage = bestScoreInfo['message']
        let scoreEngine = engine
        
        const possibleCounts = possibleAnswerCounts
        possibleCounts.push(correctAnswers.length)
        setPossibleAnswerCounts(possibleCounts)

        setCurrentQuestionBestAnswer(bestAnswer)
        handleVerseClick(bestAnswer)
        setLastQuestionScore(bestScore)
        setLastScoreInfo(bestScoreInfo)
        return bestScore
    }

    function setTotalScore() {
        return setScore(questionScores.reduce((sum, s) => { return sum + s}, 0));
    }

    async function submitAnswer() {
        setLoading(true)
        const answers = submittedAnswers
        const answer = { book: verseBook, chapter: verseChapter, verse: verseVerse }
        answers.push(answer)
        setSubmittedAnswers(answers)

        const scores = questionScores
        const score = await getCurrentScore(answer)

        scores.push(score)
        setQuestionScores(scores)
        setTotalScore()
        setLoading(false)
        setQuizState(QUIZ_STATES.ANS)
        setShowingScore(true)
    }

    function handleVerseClick(verseObj) {
        setSelectedVerse(verseObj.full + ' (ESV)')
        setSelectedReference(verseObj.reference)
    }

    async function handleGuessVerseClick() {
        if (guessVerse == null) {
            const result = await getVerse(verseBook, verseChapter, verseVerse)
            setGuessVerse(result.data.passages[0])
            setSelectedVerse(result.data.passages[0])
            setSelectedReference(`${verseBook} ${verseChapter}:${verseVerse}`)
        } else {
            setSelectedVerse(guessVerse)
            setSelectedReference(`${verseBook} ${verseChapter}:${verseVerse}`)
        }
    }

    function nextQuestion() {
        getNextQuestionTerm()
        setShowingScore(false)
        const questions = completedQuestions
        questions.push(currentQuestion)
        setCompletedQuestions(questions)

        setCurrentQuestionNumber(currentQuestionNumber + 1)
        resetAnswerForm()
        setGuessVerse(null)
        setQuizState(QUIZ_STATES.QUE)
    }

    function resetAnswerForm() {
        setVerseBook('Genesis')
        setVerseChapter(1)
        setVerseVerse(1)
    }

    function restartQuiz() {
        window.location.reload();
    }

    function finishQuiz() {
        const questions = completedQuestions
        questions.push(currentQuestion)
        setCompletedQuestions(questions)
        setQuizState(QUIZ_STATES.POS)
    }

    return <>
        <Helmet>
            <title>BQE - Bible Quiz Extraordinaire | Branson Smith</title>
            <meta name="description" content="BQE. Bible Quiz Extraordinaire is Bible Trivia Quiz Game to test how well you know the word! Random Bible Quiz. Random Quiz. BQE" />
            <link rel="canonical" href={`https://www.bransonsmith.dev/BQE`} />
        </Helmet>
        <h1 className="m-0 text-xs p-0 text-[#555]">BQE Bible Quiz Extraordinaire!</h1>
        <h2 className="m-0 text-xs p-0 text-[#444]">Random Quiz</h2>
        <div className='bqe-quiz-meta-section'>
            
            { quizState !== QUIZ_STATES.PRE && quizState !== QUIZ_STATES.POS
            ? <span><div className='bqe-quiz-meta-question'>Question {currentQuestionNumber} of {questionCount}</div>
            <div className='bqe-quiz-meta-score'>Total Score: {score}</div></span>
            : <span/>
            }
        </div>

        <div className='bqe-question-container p-0'>
            { quizState === QUIZ_STATES.PRE
            ? <div className='bqe-pre-quiz'>
                <div className='bqe-quiz-instructions'>
                    For each term, guess a Bible verse that the term appears in. All text is ESV.
                </div>

                <button className="bqe-quiz-start" onClick={startQuiz}>Start Quiz</button>
            </div>
            : <span>
                { quizState === QUIZ_STATES.QUE 
                ? <span>
                    { loading 
                    ? <div>
                        <div className="bqe-term">
                            {currentQuestion}
                        </div>
                        <div className="dot-flashing"/>
                    </div>
                    : <BQEQuestionAndAnswer 
                        term={currentQuestion}
                        verseBook = {verseBook}
                        verseChapter = {verseChapter}
                        verseVerse = {verseVerse}
                        setVerseBook = {setVerseBook}
                        setVerseChapter = {setVerseChapter}
                        setVerseVerse = {setVerseVerse}
                        submitAnswer = {submitAnswer}
                    />
                    }
                </span>
                : <span>
                    { quizState === QUIZ_STATES.ANS
                    ?   <div className='bqe-show-score'>

                        <div className="bqe-term">
                            {currentQuestion}
                        </div>
                        <div className='bqe-score-answer'>Your answer: <div className='bqe-guess bqe-clickable-verse' onClick={handleGuessVerseClick}> {' ' + verseBook + ' ' + verseChapter + ':' + verseVerse}</div></div>
                        
                        <div className='bqe-score-row'><div className="bqe-score-row-label"> Book? </div> {lastScoreInfo.bookScore > 0       ? <div className='bqe-score-correct'>{lastScoreInfo.bookMessage}    + {lastScoreInfo.bookScore}   </div> : <div className='bqe-score-incorrect'>NO</div>}</div>
                        <div className='bqe-score-row'><div className="bqe-score-row-label"> Chapter? </div> {lastScoreInfo.chapterScore > 0 ? <div className='bqe-score-correct'>{lastScoreInfo.chapterMessage} + {lastScoreInfo.chapterScore}</div> : <div className='bqe-score-incorrect'>NO</div>}</div>
                        <div className='bqe-score-row'><div className="bqe-score-row-label"> Verse? </div> {lastScoreInfo.verseScore > 0     ? <div className='bqe-score-correct'>{lastScoreInfo.verseMessage}   + {lastScoreInfo.verseScore}  </div> : <div className='bqe-score-incorrect'>NO</div>}</div>
                        <div className='bqe-score'>Score: <div className='bqe-guess'>{lastQuestionScore}</div></div>
                        { currentQuestionNumber >= questionCount
                        ? 
                        <div className='bqe-restart-section'>
                            <div className='bqe-restart-score'>Total Score: {score}</div>
                            <button className='bqe-next-question-restart' onClick={finishQuiz}>Finish Quiz</button>
                        </div>
                        : <button className='mt-8 ml-auto px-7 py-4 w-fit h-fit rounded bg-contentBg text-defaultText border-2 border-accent-300 hover:bg-accent-600' onClick={nextQuestion}>Next Question</button>
                        }

                        <div className='bqe-correct-heading'>Correct Answers ({currentQuestionCorrectAnswers.length})</div>
                        { selectedVerse
                        ? <div className='bqe-correct-heading'>
                            <BQEVerse verse={selectedVerse} reference={selectedReference}/>
                        </div>
                        :<span/>}
                        
                        <div className='bqe-scores'>
                            <li className="bqe-clickable-verse" onClick={() => handleVerseClick(currentQuestionBestAnswer)}>{currentQuestionBestAnswer.book + ' ' + currentQuestionBestAnswer.chapter + ':' + currentQuestionBestAnswer.verse}</li>
                            {currentQuestionCorrectAnswers.filter(a => 
                                !(a.book == currentQuestionBestAnswer.book && 
                                a.chapter == currentQuestionBestAnswer.chapter && 
                                a.verse == currentQuestionBestAnswer.verse)).map((a, i) => { 
                                return <li key={i} className="bqe-clickable-verse" onClick={() => handleVerseClick(a)}>{a.book + ' ' + a.chapter + ':' + a.verse}</li> 
                            })}
                        </div>
                    </div>
                    : <div className='bqe-quiz-report-container'>
                        <BQEQuizReport 
                            questions={completedQuestions}
                            answers={submittedAnswers}
                            scores={questionScores}
                            possibleAnswers={possibleAnswerCounts}
                            obscureBooks={obscureBooks}
                            title={'Full Random'}
                        />
                        <button className='bqe-next-question-restart' onClick={restartQuiz}>Restart Quiz</button>
                    </div>
                    }
                </span>
                }
            </span>
            }
        </div>
    </>
}
