import axios from "axios";

export async function getVerse(verseBook, verseChapter, verseVerse) {
    let url = `https://u4fn3burgi.execute-api.us-east-1.amazonaws.com/Prod/verse?book=${verseBook}&chapter=${verseChapter}&verse=${verseVerse}`
    return await esvGet(url, `Got esv verse: ${verseBook} ${verseChapter}:${verseVerse}`)
} 

export async function getSearchResult(searchForm) {

    let url = `https://u4fn3burgi.execute-api.us-east-1.amazonaws.com/Prod/search?search=${searchForm}`
    let resp = (await esvGet(url, `Searched esv for: ${searchForm}`))
    if (resp.error || resp.data.total_pages == 1) {
        return resp
    }
    let allResults = resp.data.results
    let moreResults = true
    let page = 2
    while(moreResults) {
        let pageUrl = url + `&page=${page}`
        resp = (await esvGet(pageUrl, `Searched esv for: ${searchForm}, page=${page}`))
        if (resp.error) {
            return resp
        }
        allResults = allResults.concat(resp.data.results)
        moreResults = resp.data.page < resp.data.total_pages
        page += 1
    }
    
    let data = {
        page: resp.data.page,
        total_pages: resp.data.total_pages,
        total_results: resp.data.total_results,
        results: allResults
    }
    return { 
        error: false,
        message: `Searched esv for: ${searchForm}`,
        data: data
    }
}

export async function esvGet(url, message='Success') {
    let headers = {
        'Content-Type': 'application/json'
    }
    
    try {
        const esvGetResponse = await axios.get(url, { headers: headers })
        // console.log(esvGetResponse)
        return { 
            error: false,
            message: message,
            data: esvGetResponse.data
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
