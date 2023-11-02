import { BibleData } from "../Data/BQEData.js"

export function getBestScoreInfo(correctAnswers, answer, scoreEngine) {

    let bestScore = 0
    let bestAnswer = null 
    let message = ''
    let bestScoreInfo = null
    correctAnswers.forEach(a => {
        
        let scoreInfo = getScoreForAnswer(a, correctAnswers, answer, scoreEngine)

        let answerScore = scoreInfo['answerScore']

        if (answerScore > bestScore || bestAnswer === null) {
            bestScore = answerScore
            bestAnswer = a
            message = scoreInfo['message']
            bestScoreInfo = scoreInfo
        }
    })

    return bestScoreInfo
}

// book score = 30-50
// chapter score = 80 or 30
// verse score = 55 or 25

function getScoreForAnswer(correctAnswer, correctAnswers, userAnswer, scoreEngine) {
    let answerScore = 0;
    let message = ''
    let bookScore = 0
    let chapterScore = 0
    let verseScore = 0
    let bookMessage = ''
    let chapterMessage = ''
    let verseMessage = ''

    if (sameBook(userAnswer, correctAnswer)) {
        bookScore = 30

        const chaptersInBook = BibleData.passage_data.filter(b => 
            b.name == userAnswer.book || b.name + 's' == userAnswer.book || b.name == userAnswer.book + 's')[0]['chapters']

        // console.log(chaptersInBook)
        let bookPct = 53 - chaptersInBook
        if (bookPct < 0) {
            bookPct = 0
        }
        // console.log(bookPct)
        let bookCoef = bookPct / 100
        let bookSizeBonus = Math.ceil(10 * bookCoef)
        // console.log(bookSizeBonus)
        bookScore += Math.ceil(bookSizeBonus)

        // TODO obscure book check
        const obscureBooks = [
            'Ruth', 'Ezra', 'Nehemiah', 'Lamentations', 'Joel', 
            'Amos', 'Obadiah', 'Micah', 'Nahum', 'Habakkuk', 
            'Zephaniah', 'Haggai', 'Zecharriah', 'Malachi', 
            'Philemon', '3 John', 'Jude']
        if (obscureBooks.includes(userAnswer.book)) {
            bookScore *= 1.23;
            message = 'Nice find'
        }

        bookScore = Math.ceil(bookScore)
        bookMessage = 'Yes'

        // How often does it appear in this book?
    } else { return {
        bookScore,
        bookMessage,
        chapterScore,
        chapterMessage,
        verseScore,
        verseMessage,
        answerScore: bookScore + chapterScore + verseScore,
        message,
        answer: correctAnswer
    } }

    if (correctAnswer.chapter == userAnswer.chapter) {
        chapterScore = 80
        chapterMessage = 'Yuup'
        // How often does it appear in this chapter?

        if (correctAnswer.verse == userAnswer.verse) {
            verseScore = 35
            verseMessage = 'Nailed it'
            // How often does it appear in this verse?
        }
        else if (Math.abs(correctAnswer.verse - userAnswer.verse) == 1) {
            verseScore = 25
            verseMessage = 'Close Enough?'
        }
        if (verseScore > 0) {
            verseScore += Math.ceil((77 / Math.max(10, Math.ceil(correctAnswers.length / 5))))
            verseScore += Math.max(5 - correctAnswers.length, 0) * 3
            verseScore = Math.ceil(verseScore)
        }
    }
    else if (Math.abs(correctAnswer.chapter - userAnswer.chapter) == 1) {
        chapterScore = 30
        chapterMessage = 'Just Off...'

        if (correctAnswer.verse == userAnswer.verse) {
            verseScore = 18
            verseMessage = 'Right Verse, Wrong Chapter'
            // How often does it appear in this verse?
        }
        if (verseScore > 0) {
            verseScore += Math.ceil((77 / Math.max(10, Math.ceil(correctAnswers.length / 5))))
            verseScore += Math.max(5 - correctAnswers.length, 0) * 3
            verseScore = Math.ceil(verseScore)
        }
    } else {
        verseScore = 0
        verseMessage = ''
    }
    // let answersInSameChapter = correctAnswers.filter(a => a.chapter == userAnswer.chapter)
    // let chapPct = answersInSameChapter.length / correctAnswers.length * 100
    // if (chapPct < 5 || answersInSameChapter < 2) {
    //     chapterScore = Math.ceil((1.43 + (chapPct/100)) * chapterScore)
    // } else {
    //     chapterScore = Math.ceil((100 - chapPct) * 30)
    // }
    chapterScore = Math.ceil(chapterScore)
    verseScore = Math.ceil(verseScore)

    let result = {
        bookScore,
        bookMessage,
        chapterScore,
        chapterMessage,
        verseScore,
        verseMessage,
        answerScore: bookScore + chapterScore + verseScore,
        message,
        answer: correctAnswer
    }
    // console.log(result)
    return result
}


function sameBook(userAnswer, correctAnswer) {
    return correctAnswer.book == userAnswer.book || correctAnswer.book + 's' == userAnswer.book || correctAnswer.book == userAnswer.book + 's'
}
