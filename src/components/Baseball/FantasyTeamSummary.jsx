import { useEffect, useState } from 'react';


export default function FantasyTeamSummary({teams, files}) {

    const [statSummariesState, setStatSummariesState] = useState(null);
    const [statRankUpValues, setStatRankUpValues] = useState([]);
    const [statRankUpSum, setStatRankUpSum] = useState(0);
    const [statRankUpAvg, setStatRankUpAvg] = useState(0);

    const [statSummariesWithTeams, setStatSummariesWithTeams] = useState(null);
    const [teamHiddenStatus, setTeamHiddenStatus] = useState(null);

    useEffect(() => {

        let statSummaries = {};
        let teamHiddenStatusBuilder = {}
        files.forEach((file, i) => {
            if (i > 1) {
                Object.keys(file.teams).forEach((teamKey) => {
                    let team = file.teams[teamKey];
                    teamHiddenStatusBuilder[team.name] = false;
                    Object.keys(team.stats).forEach((statKey) => {
                        if (!statSummaries[statKey]) {
                            statSummaries[statKey] = {};
                            statSummaries[statKey].values = [];
                        }
                        statSummaries[statKey].values.push(team.stats[statKey].value);
                    })
                })
            }
        })
        console.log('teamHiddenStatus', teamHiddenStatusBuilder);
        setTeamHiddenStatus(teamHiddenStatusBuilder);

        let allRankUps = []
        let rankUpSum = 0
        Object.keys(statSummaries).forEach((statKey) => {
            statSummaries[statKey].values = statSummaries[statKey].values.map(s => Number.parseFloat(s)).sort((a,b) => b-a);
        
            let avg = statSummaries[statKey].values.reduce((a, b) => a + b, 0) / statSummaries[statKey].values.length;
            let modeCounts = statSummaries[statKey].values.reduce((a, b) => { a[b] = (a[b] || 0) + 1; return a;}, {});
            let mode = Object.keys(modeCounts).reduce((a, b) => modeCounts[a] > modeCounts[b] ? a : b);
            mode = Number.parseFloat(mode);
            let max = Math.max(...statSummaries[statKey].values);
            let min = Math.min(...statSummaries[statKey].values);
            let median = statSummaries[statKey].values.sort((a,b) => a-b)[Math.floor(statSummaries[statKey].values.length / 2)];

            let variance = statSummaries[statKey].values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / statSummaries[statKey].values.length;
            let stddev = Math.sqrt(variance);
            let zScores = statSummaries[statKey].values.map((x) => (x - avg) / stddev);
            let zScoreAvg = zScores.reduce((a, b) => a + b, 0) / zScores.length;
            let zScoreMax = Math.max(...zScores);
            let zScoreMin = Math.min(...zScores);

            let cv = stddev / avg;
            

            let detailedValues = statSummaries[statKey].values.map(v => {
                
                let lowerIsBetterList = ['ERA', 'WHIP'];
                let lowerIsBetter = lowerIsBetterList.includes(statKey);

                let tenPctOfRange = Math.abs(max - min) * 0.1;

                let tenPercentHigherValue = v + tenPctOfRange;
                let baseValueRank = statSummaries[statKey].values.sort((a, b) => a - b).filter(x => x > v).length;
                let tenPercentHigherValueRank = statSummaries[statKey].values.sort((a, b) => a - b).filter(x => x > tenPercentHigherValue).length;
                
                if (lowerIsBetter) {
                    tenPercentHigherValue = v - tenPctOfRange;
                    baseValueRank = statSummaries[statKey].values.sort((a, b) => b - a).filter(x => x < v).length;
                    tenPercentHigherValueRank = statSummaries[statKey].values.sort((a, b) => b - a).filter(x => x < tenPercentHigherValue).length;
                }
                
                let rankUps = Math.abs(tenPercentHigherValueRank - baseValueRank);
                allRankUps.push(rankUps);
                rankUpSum += rankUps;
                return { 
                    baseIndex: statSummaries[statKey].values.indexOf(v),
                    value: v,
                    baseValueRank,
                    tenPercentHigherValueRank,
                    tenPercentHigherValue: tenPercentHigherValue,
                    rankUps,
                }
            });


            detailedValues = detailedValues.map((detailedValue, i) => {
                let rankUpsPct = detailedValues.sort((a,b) => b.rankUps - a.rankUps)
                                                .filter(x => x.rankUps > detailedValue.rankUps).length * 100;
                return {
                    ...detailedValue,
                    rankUpsPct: rankUpsPct / detailedValues.length,
                }
            })
 
            statSummaries[statKey].avg = avg;
            statSummaries[statKey].mode = mode;
            statSummaries[statKey].max = max;
            statSummaries[statKey].min = min;
            statSummaries[statKey].median = median;
            statSummaries[statKey].variance = variance;
            statSummaries[statKey].stddev = stddev;
            statSummaries[statKey].zScores = zScores;
            statSummaries[statKey].zScoreAvg = zScoreAvg;
            statSummaries[statKey].zScoreMax = zScoreMax;
            statSummaries[statKey].zScoreMin = zScoreMin;
            statSummaries[statKey].cv = cv;
            statSummaries[statKey].detailedValues = detailedValues;
            let tenPctOfRange = Math.abs(max - min) * 0.1;
            statSummaries[statKey].tenPctOfRange = tenPctOfRange;
        })

        let overallRankUpValues = allRankUps.sort((a,b) => b-a);
        setStatRankUpValues(overallRankUpValues);
        setStatRankUpSum(rankUpSum);
        setStatRankUpAvg(rankUpSum / overallRankUpValues.length);

        Object.keys(statSummaries).forEach((statKey) => {
          
            statSummaries[statKey].detailedValues = statSummaries[statKey].detailedValues.map((detailedValue, i) => {

                let overallRankUpPct = overallRankUpValues.filter(x => x > detailedValue.rankUps).length * 100;
                return {
                    ...detailedValue,
                    overallRankUpPct: overallRankUpPct / overallRankUpValues.length,
                }
            })
        })
        
        let totalsFile = files.find(file => file.filename === 'totals');
        console.log(totalsFile)


        let statSummariesWithTeamAverages = {};

        Object.keys(statSummaries).forEach((statKey) => {
            statSummariesWithTeamAverages[statKey] = statSummaries[statKey]
            Object.keys(totalsFile.teams).forEach((teamKey) => {
                let team = totalsFile.teams[teamKey];
                let teamAverageStatValue = team.stats[statKey].value;
                statSummariesWithTeamAverages[statKey].detailedValues.push({
                    team,
                    value: teamAverageStatValue
                })
            })
        })
                


        setStatSummariesWithTeams(statSummariesWithTeamAverages);
        setStatSummariesState(statSummaries);
        console.log('statSummaries', statSummaries);
        console.log('setStatSummariesWithTeams', statSummariesWithTeamAverages);
    }, [teams, files]);


    function getAverageOfRankUpsForStatAboveAndBelowTeamStat(detailedValue, statSummariesForStatWithNoTeamEntries) {

    }

    function getStatValueStyles(detailedValue,  statSummariesForStatWithNoTeamEntries) {

        let styleString = ''

        let statToCheckVal = detailedValue.rankUpsPct;
        let overallToCheckVal = detailedValue.overallRankUpPct;


        if (detailedValue.team) {
            let teamStatValue = detailedValue.value
            let statsBelow = statSummariesForStatWithNoTeamEntries.detailedValues.filter(s => s.value <= teamStatValue && s.tenPercentHigherValue).sort((a,b) => b.value - a.value);
            let statsAbove = statSummariesForStatWithNoTeamEntries.detailedValues.filter(s => s.value >= teamStatValue && s.tenPercentHigherValue).sort((a,b) => a.value - b.value);

            let closestStatBelow = statsBelow[0];
            let closestStatAbove = statsAbove[0];

            let betterRankUpsPct = Math.min(closestStatAbove.rankUpsPct, closestStatBelow.rankUpsPct);
            statToCheckVal = betterRankUpsPct;
            statToCheckVal = 99999; // ignore shading for now
            overallToCheckVal = Math.min(closestStatAbove.overallRankUpPct, closestStatBelow.overallRankUpPct);
            // console.log('teamStatValue', teamStatValue, 'statsBelow', statsBelow, 'statsAbove', statsAbove, 'closestStatBelow', closestStatBelow, 'closestStatAbove', closestStatAbove, 'statToCheckVal', statToCheckVal, 'overallToCheckVal', overallToCheckVal);
        }


        if      (statToCheckVal < 5)  { styleString += `bg-accentShadePositive-700 ` }
        else if (statToCheckVal < 10) { styleString += `bg-accentShadePositive-600 ` }
        else if (statToCheckVal < 20) { styleString += `bg-accentShadePositive-500 ` }
        else if (statToCheckVal < 30) { styleString += `bg-accentShadePositive-400 ` }
        else if (statToCheckVal < 40) { styleString += `bg-accentShadePositive-400 ` }
        else if (statToCheckVal < 50) { styleString += `bg-accentShadePositive-300 ` }
        else if (statToCheckVal < 60) { styleString += `bg-accentShadePositive-300 ` }
        else if (statToCheckVal < 70) { styleString += `bg-accentShadePositive-200 ` }
        else if (statToCheckVal < 80) { styleString += `bg-accentShadePositive-200 ` }
        else if (statToCheckVal < 90) { styleString += `bg-accentShadePositive-100 ` }

        if      (overallToCheckVal < 10)  { styleString += `border-accentShadeNegative-950` }
        else if (overallToCheckVal < 20)  { styleString += `border-accentShadeNegative-800` }
        else if (overallToCheckVal < 30)  { styleString += `border-accentShadeNegative-700` }
        else styleString += `border-gray-800`
        return styleString
    }

    function getValueString(statKey, value, isTeam=false) {
        let floatStats = ['ERA', 'WHIP', 'BA', 'OBP', 'SLG', 'OPS', 'wOBA', 'wRC+', 'FIP', 'xFIP', 'SIERA', 'xERA'];
        if (floatStats.includes(statKey)) {
            return value.toFixed(3);
        }
        else {
            if (isTeam) {
                return '' + value.toFixed(1);
            }
            return '' + value.toFixed(0);
        }
    }

    function sortStat(statKey, a, b) {
        let lowerIsBetterList = ['ERA', 'WHIP'];
        let lowerIsBetter = lowerIsBetterList.includes(statKey);
        if (!lowerIsBetter) {
            return a.value - b.value;
        }
        else {
            return b.value - a.value;
        }
    }

    function getTeamLogo(team) {
        if (team.name === "Left-Field Lizards") {
            return 'Left-Field Lizards.png'
        }
        else if (team.name === "Lovable Winners") {
            return 'Lovable Winners.jpg'
        }
        else if (team.name === "One 5picy Meatball") {
            return 'One 5picy Meatball.png'
        }
        else {
            return  team.name + '.svg'
        }
    }

    function toggleTeam(team) {
        let newTeamHiddenStatus = { ...teamHiddenStatus };
        newTeamHiddenStatus[team.name] = !newTeamHiddenStatus[team.name];
        setTeamHiddenStatus(newTeamHiddenStatus);
    }
    
    function showAll() {
        let newTeamHiddenStatus = { ...teamHiddenStatus };
        Object.keys(newTeamHiddenStatus).forEach((teamKey) => {
            newTeamHiddenStatus[teamKey] = false;
        })
        setTeamHiddenStatus(newTeamHiddenStatus);
    }
    function hideAll() {
        let newTeamHiddenStatus = { ...teamHiddenStatus };
        Object.keys(newTeamHiddenStatus).forEach((teamKey) => {
            newTeamHiddenStatus[teamKey] = true;
        })
        setTeamHiddenStatus(newTeamHiddenStatus);
    }

    function expandAllStats() {
        // find all details elements with ids like: `stat-box-`+statKey
        let statBoxes = document.querySelectorAll('[id^="stat-box-"]');
        statBoxes.forEach((statBox) => {
            statBox.open = true;
        })
    }
    function collapseAllStats() {
        // find all details elements with ids like: `stat-box-`+statKey
        let statBoxes = document.querySelectorAll('[id^="stat-box-"]');
        statBoxes.forEach((statBox) => {
            statBox.open = false;
        })
    }

    //todo
    // allow for hypothetical increase calculator
    // input -> stat, team, increase amount
    // output -> stat, team, new value, new rank
    

    // account for ip, pa on rate stats


    return (
        <details className="flex flex-col w-full py-4 px-0">
            <summary>
                <h2 className="mt-0 py-0">Fantasy Stat Summaries</h2>
            </summary>        
            <p className="flex flex-col gap-x-1 gap-y-1 flex-wrap w-full">
                <div className="flex flex-row w-full gap-x-1 gap-y-1">Each box is a posted-weekly stat total from a team.</div>
                <div className="flex flex-row w-full gap-x-1 gap-y-1">Top number is the stat. Bottom value is how many spots forward this stat goes if you increase it by 10% of the stat's range.</div>
                <div className="flex flex-row w-full gap-x-1 gap-y-1"><div className="rounded w-fit px-1 bg-accentShadePositive-700">Lighter Blue</div>: more gains in rank for 10% improvement in this stat specficially. </div>
                <div className="flex flex-row w-full gap-x-1 gap-y-1"><div className="rounded border w-fit px-1 border-accentShadeNegative-800">Oranger Border</div>: more gains in rank for 10% improvement compared to ALL stats.</div>
                <div className="flex flex-row w-full gap-x-1 gap-y-1"><div className="font-bold">Team Logo</div>: team's average for this stat</div>
            </p>
            {/* <div>Avg: {statRankUpAvg}</div>
            <div>Sum: {statRankUpSum}</div>
            <div>Len: {statRankUpValues.length}</div>
            <div>{statRankUpValues.join(', ')}</div> */}
            { teamHiddenStatus &&
            <div className="w-full flex flex-col p-2 bg-gray-800 rounded border border-gray-700">
                <div className="flex flex-row gap-x-3 gap-y-1 w-full flex-wrap mb-2">
                    <div className="font-bold text-neutral-200 my-auto">Filter Teams</div>
                    <button onClick={showAll} className="w-fit my-auto px-2 bg-accentShadePositive-400 rounded cursor-pointer hover:bg-accentShadePositive-800"> 
                        Show All
                    </button>
                    <button onClick={hideAll} className="w-fit my-auto px-2 bg-accentShadePositive-400 rounded cursor-pointer hover:bg-accentShadePositive-800"> 
                        Hide All
                    </button>
                </div>
                <div className="flex flex-row gap-x-1 gap-y-1 w-full flex-wrap">
                    { Object.keys(files.find(file => file.filename === 'totals').teams).map(teamKey => {
                        let team = files.find(file => file.filename === 'totals').teams[teamKey];
                        if (teamHiddenStatus[team.name]) {
                            return <img onClick={() => toggleTeam(team)} key={teamKey} src={getTeamLogo(team)} alt="logo" className="w-8 h-8 mb-auto mt-0 cursor-pointer hover:border-neutral-200 rounded-full border border-gray-700 border-radius-full opacity-25" />
                        }
                        return <img onClick={() => toggleTeam(team)} key={teamKey} src={getTeamLogo(team)} alt="logo" className="w-8 h-8 mb-auto mt-0 cursor-pointer hover:border-neutral-200 rounded-full border border-gray-700 border-radius-full" />
                    })}
                </div>
                <div className="flex flex-row gap-x-1 gap-y-1 w-full flex-wrap mt-8">
                    <button onClick={expandAllStats} className="w-fit my-auto px-2 bg-accentShadeNegative-400 rounded cursor-pointer hover:bg-accentShadeNegative-800">
                        Expand All Stats
                    </button>
                    <button onClick={collapseAllStats} className="w-fit my-auto px-2 bg-accentShadeNegative-400 rounded cursor-pointer hover:bg-accentShadeNegative-800">
                        Collapse All Stats
                    </button>
                </div>
            </div>  
            }

            { statSummariesWithTeams && <div className="w-full flex flex-col">
                {Object.keys(statSummariesWithTeams).map((statKey, index) => {
                    return <div key={index} className="flex flex-col w-full py-2 border border-gray-800 rounded px-2">
                        <details id={`stat-box-`+statKey} open className="flex flex-col w-full">
                            <summary className="flex flex-col w-full gap-y-2 cursor-pointer pb-2">
                                <div className="flex flex-row gap-x-2 w-full flex-wrap gap-y-1">
                                    <div className="text-lg pr-2 w-12 text-center">{statKey}</div>
                                    <div className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                        <div>AVG</div>
                                        <div>{statSummariesState[statKey].avg.toFixed(2)}</div>
                                    </div>
                                    <div className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                        <div>CV</div>
                                        <div>{statSummariesState[statKey].cv.toFixed(2)}</div>
                                    </div>
                                    <div className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                        <div>10% of Range</div>
                                        <div>{statSummariesState[statKey].tenPctOfRange.toFixed(2)}</div>
                                    </div>
                                    <div className="text-xs text-blue-600 ml-auto mr-0 my-0 py-0">
                                        [expand]
                                    </div>
                                </div>
                            </summary>

                            <div className="flex flex-row gap-x-1 w-fit flex-wrap gap-y-1">
                                    { statSummariesWithTeams[statKey].detailedValues.sort((a,b) => sortStat(statKey, a, b)).map((s, i) => {

                                        if (s.team && teamHiddenStatus[s.team.name]) {
                                            return <></>
                                        }
                                        
                                        if (s.team && !teamHiddenStatus[s.team.name]) {
                                            return <div key={i} className={`flex flex-col w-12 h-fit py-0 text-sm rounded-sm border border-gray-800 ` + getStatValueStyles(s, statSummariesState[statKey])}>
                                            <div className='mx-auto my-auto font-bold z-10 [text-shadow:_0px_0px_5px_rgb(5_5_5)]'>
                                                {getValueString(statKey, s.value, true)}
                                            </div>
                                            <img src={getTeamLogo(s.team)} alt="logo" className="w-full h-10 mb-auto -mt-5 mx-auto opacity-75 rounded" />
                                        </div>
                                        }

                                        return <div key={i} className={`flex flex-col w-12 h-fit py-0 text-sm rounded-sm border ` + getStatValueStyles(s, statSummariesState[statKey])}>
                                            <div className='mx-auto my-auto font-bold'>
                                                {getValueString(statKey, s.value)}
                                            </div>
                                            <div className='mx-auto my-auto text-gray-400'>
                                                {s.rankUps}
                                            </div>
                                        </div>
                                    })}
                                </div>
                        </details>
                        
                    </div>
                })}</div>
            }
        </details>
    );
}


