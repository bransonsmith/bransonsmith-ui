import './BQETermSearch.css'
import { useState } from "react";
import { getSearchResult } from '../Services/EsvApiService';

export default function BQETermSearch(props) {

    const [searchForm, setSearchForm] = useState('')
    const [searchResult, setSearchResult] = useState(null) 
    const [loading, setLoading] =useState(false)
    const [esvSearchResponse, setEsvSearchResponse] = useState(null)
    const [esvSearchError, setEsvSearchError] = useState(null)
    const [lastSearch, setLastSearch] = useState(null)

    async function getESVSearchResult() {
        if (lastSearch == searchForm) return
        setLoading(true)
        if (searchForm) {
            const serviceResp = await getSearchResult(searchForm)
            setEsvSearchResponse(serviceResp)
            if (serviceResp.error) {
                setEsvSearchError(serviceResp.message)
                setSearchResult(null)
            }
            else {
                setEsvSearchError(null)
                setSearchResult(serviceResp.data.results)
                setLastSearch(searchForm)
            }
        }
        setLoading(false)
    }
    
    return <div className='bqe-term-search'>
        
        <input placeholder="search for term" className="bqe-search-text" id="search-form" type="text" onChange={(event) => setSearchForm(event.target.value)}/>
        <button className="bqe-search-submit" onClick={getESVSearchResult}> Search </button>
        
        {esvSearchError
        ? <div>
            <h2>Error getting esv verse</h2>
            <p>{esvSearchError}</p>
        </div> : <span/> }

        {loading
        ? <div className='dot-flashing'></div>
        : <span className='loading-spacer'/> }

        {searchResult
            ? <div className="bqe-search-result">{searchResult.map((r, i) => <div key={i}>{i+1}) {r.reference}<br/>{r.content}<br/><br/></div>)}</div>
            : <span></span>
        }

    </div>
}