import { useEffect } from 'react';
import'./LuckFile.css'

export default function LuckFile(props) {

    // function getSortedTeams() {
    //     let sorted = []
    //     Object.keys(props.file.teams).forEach(team => {
    //        sorted.push(props.file.teams[team]) 
    //     });
    //     if (props.file.filename == "totals") {
    //         sorted.sort((a, b) => (parseFloat(a.average_rank) > parseFloat(b.average_rank)) ? 1 : -1)
    //     } else {
    //         sorted.sort((a, b) => (parseInt(a.matchup.num) > parseInt(b.matchup.num)) ? 1 : -1)
    //     }
    //     return sorted
    // } 

    const matchupColors = ['#ff000011', '#ffff0011', '#00ff0011', '#00ffff11', '#0000ff11', '#ff00ff11', '#ffffff11', '#dddddd33']

    function wlStyle(team, stat_key) {
        return {'background': team.stats[stat_key].wl > .5 ? '#00ffaa22' : team.stats[stat_key].wl < .5 ? '#ffaa0022' : 'var(--bran-colors-background-primary)'}
    }

    function luckStyle(luck) {
        return {'background': luck > 50 ? '#00ffaa44' : luck < -50 ? '#ffaa0044' : 'var(--bran-colors-background-primary)'}
    }

    function getMatchupColor(team) {
        if (team.matchup) {
            return matchupColors[parseInt(team.matchup.num)]
        }
        return '#fff'
    }

    function formattedValue(value, afterDec=3) {
        let split = ("" + value).split('.')
        if (split.length > 1) {
            const fixed = parseFloat(value).toFixed(afterDec)
            let strNum = '' + fixed
            while(strNum.includes('.') && (strNum.endsWith('0') || strNum.endsWith('.'))) {
                strNum = strNum.substring(0, strNum.length - 1)
            }
            if (strNum.includes('.')) {
                return parseFloat(strNum)
            } else {
                return parseInt(strNum)
            }
        }
        return value
    }

    function getWinPct(team) {

        let to3Digits = "" + ((team.matchup.wins.length + team.matchup.ties.length * .5) / (team.matchup.wins.length + team.matchup.ties.length + team.matchup.losses.length)).toFixed(3)
        return "." + to3Digits.split('.')[1]
    }

    function sortBy(sortFunc) {

        props.sortBy()

    }
    
    // async function getRankRank(teamToRank, trait, asc=-1)
    // {
    //     let sorted = []
    //     Object.keys(props.file.teams).forEach(team => {
    //        sorted.push(props.file.teams[team]) 
    //     });
    //     sorted.sort((a, b) => (parseInt(a[trait]) > parseInt(b[trait])) ? 1*asc : -1 *asc)
    //     return sorted.findIndex(t => t.name === teamToRank.name) + 1
    // }

    function rankStr(rank) {
        if (rank === 0) {
            return '0th'
        }
        if (rank === 1) {
            return '1st'
        }
        if (rank === 2) {
            return '2nd'
        }
        if (rank === 3) {
            return '3rd'
        }
        return rank + 'th'
    }

    return (<div>
        {/* <h2 className="luck-file-label">{props.file.Label}</h2> */}
        <ul className="luck-file-teams">{props.teams.map((team, index) =>
                <li className="luck-file-team" key={index} style={{'background': getMatchupColor(team)}}>
                
                <details className='luck-file-details'>
                    <summary className='w-full'>
                        <h3 className="w-full">
                            <div className="text-2xl flex flex-row gap-x-2 h-fit">
                                <img src={team.logo} alt="logo" className="w-8 h-8 mb-auto mt-0 rounded-full border border-gray-700 border-radius-full" />
                                <div className="text-2xl mt-auto">{team.name} </div>
                                <div className="text-lg mt-auto">{team.matchup.wins.length}-{team.matchup.losses.length}-{team.matchup.ties.length}</div>
                                <div className="text-lg mt-auto">({rankStr(team.winPctRank)})</div>
                            </div>
                            <div className="team-luck">
                                {/* <div className="team-trait" onClick={() => sortBy(getWinPct)}>
                                    <div className="team-trait-label">Record </div>
									
                                </div> */}
                                <div className="team-trait flex flex-col w-fit">
									<div className="team-trait-label mr-auto ml-0">Luck Score ({rankStr(team.luckScoreRank)})</div>
                                    <div className="team-trait-value mr-auto ml-0">{Number.parseFloat(team.luck_score * .01).toFixed(2)}</div>
                                </div>
                                <div className="team-trait">
                                    <div className="team-trait-label mr-auto ml-0">Avg Rank ({rankStr(team.avgRankRank)})</div>
                                    <div className="team-trait-value mr-auto ml-0">{Number.parseFloat(team.average_rank).toFixed(2)}</div>
                                </div>
                                <div className="team-trait">
									<div className="team-trait-label mr-auto ml-0">Expected Ws ({rankStr(team.expectedWinsRank)})</div>
                                    <div className="team-trait-value mr-auto ml-0">{Number.parseFloat(team.expected_wins).toFixed(2)}</div> 
                                </div>
                            </div>
                        </h3>
                    </summary>
                        <ul className="luck-file-team-stats">
                            
                            <li>
                                <div className="luck-file-team-stat left-head" style={{'background': 'var(--bran-colors-background-primary)'}}>
                                    <div className="stat-data top-head " style={{'background': 'var(--bran-colors-background-primary)'}}>Stat</div>
                                    <div className="stat-data" style={{'background': 'var(--bran-colors-background-primary)'}}>
                                        {props.filename==='totals'? 
                                        <span style={{'fontSize': '6px'}}>Avg Value</span> 
                                        : <span>Value</span> }
                                    </div>
                                    <div className="stat-data" style={{'background': 'var(--bran-colors-background-primary)'}}>
                                        {props.filename==='totals'? 
                                        <span style={{'fontSize': '6px'}}>Avg Rank</span> 
                                        : <span>Rank</span> }
                                    </div>
                                    <div className="stat-data" style={{'background': 'var(--bran-colors-background-primary)'}}>
                                        
                                    {props.filename==='totals'? 
                                        <span style={{'fontSize': '6px'}}>Avg Wins</span> 
                                        : <span>Wins</span> }</div>
                                    <div className="stat-data" style={{'background': 'var(--bran-colors-background-primary)'}}>Luck</div>
                                </div>
                            </li>
                            
                            {Object.keys(team.stats).map((stat_key) =>
                            <li key={stat_key}>
                                <div className="luck-file-team-stat">
                                    <div className="centered stat-data top-head" style={{'background': 'var(--bran-colors-background-primary)'}}>{stat_key}</div>
                                    <div className="centered stat-data" style={wlStyle(team, stat_key)}>{formattedValue(team.stats[stat_key].value)}</div>
                                    <div className="centered stat-data" style={wlStyle(team, stat_key)}>{formattedValue(team.stats[stat_key].rank, 2)}</div>
                                    <div className="centered stat-data" style={wlStyle(team, stat_key)}>{formattedValue(team.stats[stat_key].wl, 2)}</div>
                                    <div className="centered stat-data" style={luckStyle(Number.parseFloat(team.stats[stat_key].luck_score).toFixed(2))}>{(Number.parseFloat(team.stats[stat_key].luck_score) * .01).toFixed(2)}</div>
                                </div>
                            </li>
                        )}</ul>
                </details>
                
            </li>
        )}</ul> 
    </div>)
}
