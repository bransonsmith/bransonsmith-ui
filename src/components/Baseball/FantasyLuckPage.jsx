import { useEffect, useState } from 'react'
import './FantasyLuckPage.css'

// import axios from "axios";
import LuckFile from './LuckFile';
export default function FantasyLuckPage(props) {

    const [files, setFiles] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [sortedTeams, setSortedTeams] = useState(null)
    const [currentSortAttribute, setCurrentSortAttribute] = useState(null)
    const [refreshInProgress, setRefreshInProgress] = useState(false)
    const [cacheRefreshState, setCacheRefreshState] = useState('NOT_ATTEMPTED')
    const [year, setYear] = useState('2025')

    
    useEffect( () => {
        async function initLuckStats() {
            const leaderboardRes = await getLuckStats();

        }
        initLuckStats();
    }, []); // Only re-run the effect if count changes

    // useEffect(() => {getLuckStats()}, [])

    function getSortedTeams(fileWithTeams) {
        let sorted = []
        Object.keys(fileWithTeams.teams).forEach(team_key => {
           sorted.push(fileWithTeams.teams[team_key]) 
        });

        // assign stat rankings for each team for: 

        console.log('Sorting')

        let byAvgRank = []
        let byExpectedWins = []
        let byLuckScore = []
        let byWinPct = []

        sorted.sort((a, b) => (Number.parseFloat(a.average_rank) > Number.parseFloat(b.average_rank)) ? 1 : -1)
        sorted.forEach(team => byAvgRank.push(team))
        
        console.log('byAvgRank', byAvgRank)

        sorted.sort((a, b) => (Number.parseFloat(a.expected_wins) < Number.parseFloat(b.expected_wins)) ? 1 : -1)
        sorted.forEach(team => byExpectedWins.push(team))

        console.log('byExpectedWins', byExpectedWins)

        sorted.sort((a, b) => (Number.parseFloat(a.luck_score) < Number.parseFloat(b.luck_score)) ? 1 : -1)
        sorted.forEach(team => byLuckScore.push(team))

        sorted.sort((a, b) => (Number.parseFloat(a.matchup.wins.length + a.matchup.ties.length * .5) / (a.matchup.wins.length + a.matchup.ties.length + a.matchup.losses.length) < Number.parseFloat(b.matchup.wins.length + b.matchup.ties.length * .5) / (b.matchup.wins.length + b.matchup.ties.length + b.matchup.losses.length)) ? 1 : -1)
        sorted.forEach(team => byWinPct.push(team))

        sorted.forEach(team => {
            team['avgRankRank'] = byAvgRank.indexOf(team) + 1
            team['expectedWinsRank'] = byExpectedWins.indexOf(team) + 1
            team['luckScoreRank'] = byLuckScore.indexOf(team) + 1
            team['winPctRank'] = byWinPct.indexOf(team) + 1
        })

        // Number.parseFloat(team.average_rank).toFixed(2)
        // Number.parseFloat(team.expected_wins).toFixed(2)
        // Number.parseFloat(team.luck_score * .01).toFixed(2)
        // winPct:    function getWinPct(team) {
        //     let to3Digits = "" + ((team.matchup.wins.length + team.matchup.ties.length * .5) / (team.matchup.wins.length + team.matchup.ties.length + team.matchup.losses.length)).toFixed(3)
        //     return "." + to3Digits.split('.')[1]
        // }

        if (fileWithTeams.filename == "totals") {
            sorted.sort((a, b) => (parseFloat(a.average_rank) > parseFloat(b.average_rank)) ? 1 : -1)
        } else {
            sorted.sort((a, b) => (parseInt(a.matchup.num) > parseInt(b.matchup.num)) ? 1 : -1)
        }

        return sorted
    } 

    function setData(luck_files) {
        
        luck_files.sort((a, b) =>  parseInt(a.filename.substring(4)) - parseInt(b.filename.substring(4)))
        luck_files.reverse()
        var [itemToMove] = luck_files.splice(luck_files.length - 1, 1)
        luck_files.unshift(itemToMove)

        setFiles(luck_files)
        setSelectedFile(luck_files[1])
        setSortedTeams(getSortedTeams(luck_files[1]))
    }

    async function getLuckStats(yearValue=year) {
        let url = `https://f8hx49ftwc.execute-api.us-east-1.amazonaws.com/dev/luck?year=${yearValue}`
        let headers = {
              'Content-Type': 'application/json'
            }     
        //console.log('Requesting files: ')
        //console.log(url)

        fetch(url, { headers: headers })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            //console.log('res data');
            //console.log(data);
            setData(data.luck_files);
        })
        .catch((reason) => {
            //console.log('error from aws');
            //console.log(reason);
            //console.log(reason.message);
        });
    }

    function getUpdateTime() {
        let time_value = files[0].time
        try {
            let time_split = time_value.split(' ')
            let date_str = time_split[0]
            let time_str = time_split[1]
            let time_zone = time_split[2]
    
            let month_str = date_str.split('-')[1]
            let day_str = date_str.split('-')[2]
            let year_str = date_str.split('-')[0]
    
            let hours_str = time_str.split(':')[0]
            let hours_num = parseInt(hours_str)
            let minutes_str = time_str.split(':')[1]
            let minutes_num = parseInt(minutes_str)
    
            let am_pm = hours_num <= 11 ? 'am' : 'pm'
    
            if (minutes_num < 10) {
                minutes_str = '0' + minutes_str
            }
    
    
            return `${hours_str}:${minutes_str}${am_pm} ${time_zone} ${month_str}/${day_str} ${year_str}`
        } catch {
            return time_value
        }
       
    }

    function refreshStats(event) {
        event.preventDefault();
        let swid = '{254B8B35-CC4A-4469-89E5-26F3B6E39495}'
        let espn = 'AEAFbaWEQUdlQae6CfhgpCtuLd2lJP22ny3zsFU%2BzUPut6CNB%2F%2BjHh53aiNl%2BivitfaINMD%2FdVaaZAW47QBf3Lnf%2BatVVf7CfY5mc4QJ47pEjD%2BmvU5ZRdKTcN5KC3qSmIuDwO8M465o7VERlkCAC96buRfhuc81JFyOkL8IgyqhvaAeZ1nmQxHXI4fiZ%2FJG45W5HdT55SsgSyB2oFN1HuJaXtyvlbv3zIHamJleF%2BxoIw1A%2BbHz5fsDvgl4L9jGszLihBKuYS4ppU0LANdE2LblxmRUAWwz8hyoc50y7iY18g%3D%3D'
        let url = 'https://f8hx49ftwc.execute-api.us-east-1.amazonaws.com/dev/luck'
        const post_body = { 
            cookies: {
                // swid: swid,
                swid: swid,
                // espn_s2: "AECZENefEx6xX4T9ImdrYCklgxRz3Ja3uJfa1FApW4wCWFBM7Zf5wEVWqp5jI3WcZxStRxExTVdnsncYyLl3%2FFkToPEMqEssbwBlKpFTksN%2B48K7Bdr%2FihDdFBsj2mVb36igBsX%2FVAqlc%2B%2FGrKn3db%2FjTQKT%2BFdYXK%2FHzu9eieXv%2BCbQRZLAd59XiOqTWRtNyEdjDCkaJz9h16IlmtyJuXOuwUMaCB%2Bsg9cpwE4RfjZ78qhwR64n0XfAugSUNKt2AUEoMP%2BSArGOvk7dv1HUbI3KcFjaVnnKb8coxy034AyN1A%3D%3D"
                espn_s2: espn
            }
        };
        const headers = { 
            'Content-Type': 'application/json',
        };
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(post_body)
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            //console.log(res)
            // window.location.reload();
        })
        .catch((err) => {
            //console.log(err);
            // window.location.reload();
        });

    }
    
    function attemptCacheRefresh() {
        let swid = ''
        let espn = ''
        let url = 'https://f8hx49ftwc.execute-api.us-east-1.amazonaws.com/dev/luck'
        const post_body = { 
            cookies: {
                swid: swid,
                espn_s2: espn
            }
        };
        const headers = { 
            'Content-Type': 'application/json',
        };
        setCacheRefreshState('IN_PROGRESS')
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(post_body)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                // //console.log(data)
                let lambda_code = data.statusCode;
                if (lambda_code > 299) {
                    setCacheRefreshState('FAILED');
                } else {
                    window.location.reload();
                }
            })
            .catch((err) => {
                //console.log(err);
                // window.location.reload();
            });
    }

    async function handleYearChange(yearValue) {
        //console.log(`year change: ${yearValue}`)
        if (year !== yearValue) {
            //console.log(`new value: ${yearValue}`)
            
        }
        setFiles(null)
        setYear(yearValue)
        await getLuckStats(yearValue)
    }

    function sortTeamsBy(attribute) {
        setCurrentSortAttribute(attribute)
        const attr_map = {
            "Record": { "name": "wl", "dir": -1 },
            "Avg Rank": { "name": "average_rank", "dir": 1 },
            "Expected Ws": { "name": "expected_wins", "dir": -1 },
            "Luck Score": { "name": "luck_score", "dir": -1 },
            "Matchup": { "name": "matchup", "dir": 1 },
        }
        let selectedAttr = attr_map[attribute]

        let newSort = []
        sortedTeams.forEach(team => {
            newSort.push(team)
        });

        if (attribute === "Matchup") {
            if (selectedFile.filename !== "totals") {
                newSort.sort((a, b) => (parseFloat(a[selectedAttr["name"]].num) > parseFloat(b[selectedAttr["name"]].num)) ? selectedAttr["dir"] : selectedAttr["dir"] * -1)
                setSortedTeams(newSort)     
            }
        } else {
            newSort.sort((a, b) => (parseFloat(a[selectedAttr["name"]]) > parseFloat(b[selectedAttr["name"]])) ? selectedAttr["dir"] : selectedAttr["dir"] * -1)
            setSortedTeams(newSort)    
        }



        // newSort.sort((a, b) => (parseFloat(a[selectedAttr["name"]]) > parseFloat(b[selectedAttr["name"]])) ? selectedAttr["dir"] : selectedAttr["dir"] * -1)
        // setSortedTeams(newSort)    

    }

    function setNewSelectedFile(file) {
        setSelectedFile(file)
        setSortedTeams(getSortedTeams(file))
        document.getElementById("sort-selector").value = ""
        // if (currentSortAttribute) {
        //     sortTeamsBy(currentSortAttribute)
        // }
        // sortTeamsBy(currentSortAttribute)
    }

    function getDisplayFilename(filename) {
        if (filename === "totals") {
            return "Totals"
        }
        return 'Week ' + filename.substring(4) 
    }

    function filenameSort(a,b) {
        if (a.filename === "totals") {
            return -1
        }

        let a_num = parseInt(a.filename.substring(4))
        let b_num = parseInt(b.filename.substring(4))
        return b_num - a_num
    }

    return (
        <div className="fantasy-luck-page">
            
            <h1 className="my-0 text 2xl">Fantasy Baseball Funzone "Luck Score"</h1>
            <h2 className="my-0 text-sm text-gray-400 text-normal flex flex-col pl-3">
                <div className="underline ">Luck Score - </div>
                <div className="font-normal">How many wins received based on your weekly opponent's performance.<br/>e.g. If you have 2nd most HR in a week, and you just happen to be playing against the person with the most HR that week, then you got very "unlucky".</div>
            </h2>
            <div className="explanation mx-0">
                <details>
                    <summary>How is Luck Score calculated?</summary><br/>

                    <b>Summary:</b>
                    <div className="explanation-summary">
                        <div>Luck score measures how many extra/missing wins you have solely due to good/bad weekly matchups.</div>
                        <div><b>Think of it as a way to quantify weekly matchup difficulty (where high luck = weak weekly opponent).</b></div>
                        <br/>
                        <div>Luck score is the difference between your ACTUAL WIN count, and your EXPECTED WIN count, based on your weekly stat rankings.</div>
                        <br/>
                        <div>For example, if you're 5th place out of 12 teams in a category, if given a random opponent, you would win 7 of 11 times.</div>
                        <div>Therefore, you're Expected Wins for that category is 7/11.</div>
                        <div>Simply add this number up for all of your categories, then subtract it from your actual number of wins.</div>

                        <br/>
                        <div><b>In Summary, Luck = the number of wins above or below your expected wins.</b></div>
                        {/* <div>For each category you won, you got lucky, to some extent, to match up against a worse opponent (unless you were 1st place in that category).</div>
                        <div>Likewise, each category you lost, you got unlucky, to some extent, to match up against a better opponent (unless you were 12th place in that category).</div>
                        <br/><div>So for each win, you get luck points added for the probablility you could have lost but didn't.</div>
                        <div>And for each loss, you get luck points subtracted for the probablility you could have won but didn't.</div> */}
                    </div>
                    <div className="boxed"><b className="boxed-title">Formula</b>
                        <div>for each stat find score, then add up all stats</div><br/>
                        <div className="centered"><b>score = (Actual_Wins - Expected_Wins)</b></div>
                        <div className="centered">where</div>
                        <div className="centered"><b>Actual_Wins = 1 for a win, 0 for a loss, .5 for a tie</b></div>
                        <div className="centered"><b>Expected_Wins = Num_Opponents_You_Beat / Num_Opponents</b></div>
                    
                        {/* <div className="formula-table">
                            <b>Formula Outputs:</b>
                            <div>Category Rank on Y Axis</div><div>Category Result on X Axis</div> <div>= Luck Score for category</div>
                            <table>
                                <tbody>

                            <tr><th>rank</th><th>W</th><th>L</th><th>T</th></tr>
                            <tr><th>1</th><td>N/A</td><td> -100</td><td> -50</td></tr>
                            <tr><th>2</th><td>9.09</td><td> -90.91</td><td> -40.91</td></tr>
                            <tr><th>3</th><td>18.18</td><td> -81.82</td><td> -31.82</td></tr>
                            <tr><th>4</th><td>27.27</td><td> -72.73</td><td> -22.73</td></tr>
                            <tr><th>5</th><td>36.36</td><td> -63.64</td><td> -13.64</td></tr>
                            <tr><th>6</th><td>45.45</td><td> -54.55</td><td> -4.55</td></tr>
                            <tr><th>7</th><td>54.55</td><td> -45.45</td><td> 4.55</td></tr>
                            <tr><th>8</th><td>63.64</td><td> -36.36</td><td> 13.64</td></tr>
                            <tr><th>9</th><td>72.73</td><td> -27.27</td><td> 22.73</td></tr>
                            <tr><th>10</th><td>81.82</td><td> -18.18</td><td> 31.82</td></tr>
                            <tr><th>11</th><td>90.91</td><td> -9.09</td><td> 40.91</td></tr>
                            <tr><th>12</th><td>100</td><td> N/A</td><td> 50</td></tr>
                            </tbody></table>
                        </div> */}
                    </div>
                    <b>Example 1:</b>
                    <div className="explanation-summary"><br/>
                        Given I placed 3rd in HR and Lost<br/>

                        <br/>Expected_Wins = (12 - 3) / 11 -> 9/11 
                        <br/>In English: if given a random matchup, I would beat 9 out of the 11 possible matchups (only 1st and 2nd best in HR would beat me)

                        <br/><br/>Actual_Wins = 0
                        <br/>In English: I did not get a win (matched up against a better-ranked opponent)

                        <br/><br/>Luck_Score = (0 - 9/11) -> -9/11 -> -.8181
                        <br/>In English: I expect to win that category most of the time (9/11 times), but this week I got unlucky. So I get the probablity that I should have won subtracted from my luck score. (Subtrating luck points = being unlucky) 

                    </div>

                    <b>Example 2:</b>
                    <div className="explanation-summary"><br/>
                        Given I placed 3rd in HR and Won<br/>

                        <br/>Expected_Wins = (12 - 3) / 11 -> 9/11 
                        <br/>In English: if given a random matchup, I would beat 9 out of the 11 possible matchups (only 1st and 2nd best in HR would beat me)

                        <br/><br/>Actual_Wins = 1
                        <br/>In English: I got a win (matched up against a worse-ranked opponent)

                        <br/><br/>Luck_Score = (1 - 9/11) -> 2/11 -> .1818
                        <br/>In English: I should lose this category 2/11 times, but this week I got "lucky" (a small amount of luck to dodge the 2 loss-scenarios). So I get the probablity that I should have lost added to my luck score. (Adding luck points = being lucky) 
                    </div>
                </details>
            </div>

            {files && selectedFile && selectedFile.filename === 'totals'? 
            <div className="menu">
                <div className="sort-select">
                    <div className="sort-label">Sort By</div>
                    <select id="sort-selector" onChange={(event) => sortTeamsBy(event.target.value)}>
                        <option>Expected Ws</option>
                        <option>Luck Score</option>
                        <option>Matchup</option>
                        <option>Record</option>
                        <option>Avg Rank</option>
                    </select>
                </div>
                <div className="disclaimer">*Current Week stats update once per day at 6am CST.</div>
                <div className="disclaimer">*Current Week not included in totals.</div>
                {/* <div className="sort-select">
                    <div className="sort-label">Year</div>
                    <select id="sort-selector" value={year} default={2025} onChange={async (event) => await handleYearChange(event.target.value)}>
                        <option id='2025'>2025</option>
                        <option id='2024'>2024</option>
                        <option id='2023'>2023</option>
                        <option>2022</option>
                    </select>
                </div> */}
            </div>
            :<span/>
            }

            {files && selectedFile && sortedTeams?
            <div className="file-display">
                
                <ul className="tab-heads">{files.sort(filenameSort).map((file) =>
                    <li key={file.filename} onClick={() => {setNewSelectedFile(file)}}>
                        { selectedFile && file.filename == selectedFile.filename?
                            <div className="tab-head tab-head-selected">
                                {getDisplayFilename(file.filename)}
                            </div>
                            :<div className="tab-head">
                                {getDisplayFilename(file.filename)}
                            </div>
                        }
                    </li>
                )}
                </ul>
                <div className="tab-content">
                    {selectedFile?
                        <span>
                            { sortedTeams?
                                <LuckFile teams={sortedTeams} filename={selectedFile.filename} sortBy={sortTeamsBy}/>
                            : <span/>
                            }
                        </span>
                    :<span/>}
                </div>
            </div>
            : <div>Loading...</div>
            }
            
            {files?
            <div className="refresh">
                { cacheRefreshState === 'FAILED'? <></>
                //     <form className="refresh-form" onSubmit={(event) => refreshStats(event)}>
                //      <div>
                //         <b>Easy fix: Tell Branson (xxx-xxx-8950) that his ESPN Credentials expired. Then he can come fill out the form with his info.</b>

                //         <b>Complicated fix:</b>
                //          Because the ESPN Fantasy API isn't designed for public use (it's allowed, just not convenient), 
                //          you'll have to login normally on their website, then copy over your authentication info to access
                //          our private league data. Basically, you give espn your username/password, they give tokens confirming who you are
                //          and these are stored in your browser's cookies. Then you can access our private league data using those cookies.

                //          <br/>
                //          So, if you give those cookies to this application, it can use them to access the league data on your behalf, process it,
                //          then publish it here. But if you have any worries, or confusion, or understandably don't want to provide your authentication
                //          details to some random guy's app, just ask Branson aka Left Field Lizards aka 8950 phone in group to update the data.

                //          <br/>
                //          <b>
                //              The cookie values can be accessed by:
                //              <ol>
                //                  <li>Login to espn fantasy site like you normally would</li>
                //                  <li>Hit F12 to access developer tools or right click the page > Inspect</li>
                //                  <li>Go to the Application Tab (may be under a drop down)</li>
                //                  <li>On the left click on the Cookies drop down</li>
                //                  <li>Choose https://www.espn.com (not the fantasy one)</li>
                //              </ol>
                //          </b>
                //          <br/>
                //          <b>
                //              IF YOU GIVE YOUR COOKIES, THIS APP WILL BE ACTING AS YOUR IDENTITY WITH ESPN. UNTIL THOSE COOKIES EXPIRE (which you may or may not be able to make happen manually by logging out, not sure)
                //              <br/>
                //              SO DON'T PUT YOUR INFO IN HERE UNLESS YOU TRULY TRUST BRANSON TO ONLY USE IT TO FETCH FANTASY DATA.
                //          </b>
                //      </div>
                //      <label>
                //          Cookies > https://www.espn.com > SWID
                //          <input id="form-swid" type="text" name="name" placeholder="{123ABC12-ABCD-1234-12CD-1234ABCD1234}"/>
                //      </label>
                //      <label>
                //          Cookies > https://www.espn.com > espn_s2
                //          <input id="form-espn" type="text" name="name" placeholder="AEB0qSOME SUPER LONG STRING OF CHARACTERS< JUST COPY IT WITH ctrl + a ctrl + c A%3D%3D"/>
                //      </label>
                //      <input type="submit" value="Submit" />
                //  </form>
                : <span>{cacheRefreshState === 'NOT_ATTEMPTED'?
                    <button onClick={() => attemptCacheRefresh()}>Refresh Data</button>
                    : <span> { cacheRefreshState === 'IN_PROGRESS'?
                        <div>Loading...</div>
                        : <span/>
                    }
                    </span>
                }
                </span>
                }

                {files?
                    <div className="last-updated">
                        Last Updated: {getUpdateTime()}
                    </div>
                :<span/>
                }
                {/* <div className="description">
                    Use this to manually pull the latest available data from ESPN.
                    It will run automatically at 6am CST every day.
                    From what I can tell so far, ESPN updates stats once every night sometime between 1:00am-8:00am cst, 
                    so updating more often than that probably won't get any new information.

                    <br/>Hopefully in the future, I can figure out how to get their live data instead of daily.
                </div> */}
                
            </div>
            :<span/>
            }
        
        </div>
    )
}
