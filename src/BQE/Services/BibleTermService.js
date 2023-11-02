import { esvTerms } from "../Data/ESVConcordance"

export async function getRandomTerm() {
    const numTerms = esvTerms.words.length
    let randomTermIndex = Math.floor(Math.random() * numTerms)
    let candidateWord = esvTerms.words[randomTermIndex].name
    while (!validTerm(candidateWord)) {
        randomTermIndex = Math.floor(Math.random() * numTerms)
        candidateWord = esvTerms.words[randomTermIndex].name
    }
    return candidateWord
}
function validTerm(candidateWord) {

    const alphanums = new Set("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    function isAlphanumeric(char) {
        return alphanums.has(char);
    }

    for (let i = 0; i < candidateWord.length; i++) {
        const c = candidateWord[i];
        if (!isAlphanumeric(c)) {
            return false
        }
    }

    return true;
}

export async function getReferencesForTerm(term) {
    term = term.toUpperCase()
    return esvTerms.words.filter(w => w.name == term || w.name == term + 'S' || w.name == term + 'ES' || w.name == term.substring(0, term.length -1) + 'IES').reduce((allEntrys, w) => {
        return allEntrys.concat(w.entrys)
    }, [])
}
