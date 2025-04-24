import { useEffect, useState } from 'react';

export default function FantasyStatSummaries({completedMatchupFiles}) {

    const [fullLeagueStatsDict, setFullLeagueStatsDict] = useState(null);
    const [teamsDict, setTeamsDict] = useState(null);

    const getLogoPath = (team) => {
        if      (team.name === "Left-Field Lizards") { return 'Left-Field Lizards.png' }
        else if (team.name === "Lovable Winners")    { return 'Lovable Winners.jpg' }
        else if (team.name === "One 5picy Meatball") { return 'One 5picy Meatball.png' }
        return  team.name + '.svg'
    }
    const getLogoPathByTeamKey = (teamKey) => { return getLogoPath(teamsDict[teamKey]) }

    const STAT_METADATA = {
        'R': { lowerIsBetter: false, isRateStat: false, category: 'Batting'},
        'HR': { lowerIsBetter: false, isRateStat: false, category: 'Batting'},
        'RBI': { lowerIsBetter: false, isRateStat: false, category: 'Batting'},
        'OBP': { lowerIsBetter: false, isRateStat: true, category: 'Batting'},
        'SB': { lowerIsBetter: false, isRateStat: false, category: 'Batting'},
        'K': { lowerIsBetter: false, isRateStat: false, category: 'Pitching'},
        'QS': { lowerIsBetter: false, isRateStat: false, category: 'Pitching'},
        'SV': { lowerIsBetter: false, isRateStat: false, category: 'Pitching'},
        'ERA': { lowerIsBetter: true, isRateStat: true, category: 'Pitching'},
        'WHIP': { lowerIsBetter: true, isRateStat: true, category: 'Pitching'},
    }

    function addIncreasedStatCalcToNumbers(statsDict, pctIqrIncrease) {
        let updatedStatsDict = { ...statsDict }
        Object.keys(updatedStatsDict).forEach(statKey => {
            let statMetadata = STAT_METADATA[statKey]
            let statEntry = updatedStatsDict[statKey]
            let statValues = statEntry.values
            statValues.forEach(statValue => {
                if (!statValue.increasedStatCalcs) {
                    statValue.increasedStatCalcs = {};
                }
                statValue.increasedStatCalcs[pctIqrIncrease] = {};

                let increaseAmount = statEntry.iqr * (pctIqrIncrease/100)
                
                let newValue = statValue.value + increaseAmount
                let valuesThatLoseToNewOne = statValues.filter(v => v.value < newValue)
                let valuesThatTieNewOne = statValues.filter(v => v.value === newValue)
                if (statMetadata.lowerIsBetter) {
                    valuesThatLoseToNewOne = statValues.filter(v => v.value > newValue)
                }
                let newWins = valuesThatLoseToNewOne.length + ((valuesThatTieNewOne.length)/ 2) 
                let winDiff = Math.abs(newWins - statValue.wins) -1
                
                statValue.increasedStatCalcs[pctIqrIncrease] = {
                    newValue,
                    newWins,
                    winDiff,
                    increaseAmount
                }
            })

            let sortedByWinDiff = statValues.sort((a, b) => {
                let aVal = a.increasedStatCalcs[pctIqrIncrease].winDiff
                let bVal = b.increasedStatCalcs[pctIqrIncrease].winDiff
                return bVal - aVal
            })
            sortedByWinDiff.forEach((value, index) => {
                let indexOfFirstValueWithSameValue = sortedByWinDiff.findIndex(v => v.increasedStatCalcs[pctIqrIncrease].winDiff === value.increasedStatCalcs[pctIqrIncrease].winDiff)
                value.increasedStatCalcs[pctIqrIncrease].rank = indexOfFirstValueWithSameValue + 1
                value.increasedStatCalcs[pctIqrIncrease].winDiffPct = indexOfFirstValueWithSameValue / statValues.length
            })
        })


    }

    function parseStatsFromFilesIntoStatDicts(completedMatchupFiles) {
        let fullLeagueStatsDictBuilder = {}
        let teamsDictBuilder = {}
        
        completedMatchupFiles.forEach(file => {
            Object.keys(file.teams).forEach((teamKey) => {
                let team = file.teams[teamKey]
                if (!teamsDictBuilder[teamKey]) {
                    teamsDictBuilder[teamKey] = {};
                    teamsDictBuilder[teamKey].stats = {};
                    teamsDictBuilder[teamKey].name = team.name;
                    teamsDictBuilder[teamKey].abbr = teamKey;
                    teamsDictBuilder[teamKey].isHidden = false;
                    teamsDictBuilder[teamKey].logoPath = getLogoPath(team);
                }

                Object.keys(team.stats).forEach((statKey) => {
                    if (!fullLeagueStatsDictBuilder[statKey]) {
                        fullLeagueStatsDictBuilder[statKey] = {
                            values: [],
                            name: statKey
                        };
                    }
                    fullLeagueStatsDictBuilder[statKey].values.push(
                    {
                        team: teamKey,
                        fileNumber: file.number,
                        value: Number.parseFloat(team.stats[statKey].value),
                        isTeamAvg: false,
                    })
                    
                    if (!teamsDictBuilder[teamKey].stats[statKey]) {
                        teamsDictBuilder[teamKey].stats[statKey] = {
                            values: [],
                            name: statKey,
                        };
                    }
                    teamsDictBuilder[teamKey].stats[statKey].values.push(
                    {
                        value: Number.parseFloat(team.stats[statKey].value),
                        fileNumber: file.number,
                        team: teamKey,
                        isTeamAvg: false,
                    });
                })
            })
        })

        return { fullLeagueStatsDictBuilder, teamsDictBuilder }
    }

    useEffect(() => {

        let dicts = parseStatsFromFilesIntoStatDicts(completedMatchupFiles)
        let fullLeagueStatsDictBuilder = dicts.fullLeagueStatsDictBuilder
        let teamsDictBuilder = dicts.teamsDictBuilder

        let teamsInLeague = Object.keys(teamsDictBuilder).length
        let numberCompletedWeeks = completedMatchupFiles.length

        // DEFINE BASIC DESCRIPTIVE STATISTICS FOR EACH STAT
        Object.keys(fullLeagueStatsDictBuilder).forEach((statKey) => {
            let statMetadata = STAT_METADATA[statKey]
            let statValues = [...fullLeagueStatsDictBuilder[statKey].values]
            // console.log('statKey', statKey, 'statValues', statValues)
            let sortedValues = statValues.sort((a, b) => statMetadata.lowerIsBetter ? a.value - b.value : b.value - a.value);
            // console.log('sortedValues1', statValues.map((v,i) => '' + i + '. ' + v.value))

            // console.log('sortedValues', sortedValues)
            let sum = sortedValues.reduce((acc, obj) => acc + obj.value, 0);
            let avg = sum / sortedValues.length;
            let min = Math.min(...sortedValues.map(v => v.value));
            let max = Math.max(...sortedValues.map(v => v.value));
            let range = max - min;
        
            let medIndex = Math.floor(sortedValues.length * .5);
            let bQtrIndex = Math.floor(sortedValues.length * .25);
            let tQtrIndex = Math.floor(sortedValues.length * .75);
            // console.log('len', sortedValues.length, 'medIndex', medIndex, 'bQtrIndex', bQtrIndex, 'tQtrIndex', tQtrIndex)
            // console.log('sortedValues', sortedValues.map((v,i) => '' + i + '. ' + v.value))


            let median = statValues[medIndex].value;
            let bottomQuarterValue = statValues[bQtrIndex].value;
            let topQuarterValue = statValues[tQtrIndex].value;
       
            // console.log('median', median, 'bottomQuarterValue', bottomQuarterValue, 'topQuarterValue', topQuarterValue)

            let iqr = Math.abs(topQuarterValue - bottomQuarterValue)


            let variance = sortedValues.reduce((acc, val) => acc + Math.pow(val.value - avg, 2), 0) / sortedValues.length;
            let stdev = Math.sqrt(variance);
            
            let cv = stdev / avg;

            let sumOfWins = 0
            let sumOfValues = 0
            sortedValues.forEach((value, index) => {
                sumOfValues += value.value

                let valuesThatLoseToThisOne = sortedValues.filter(v => v.value < value.value)
                let valuesThatTieThisOne = sortedValues.filter(v => v.value === value.value)
                if (statMetadata.lowerIsBetter) {
                    valuesThatLoseToThisOne = sortedValues.filter(v => v.value > value.value)
                }
                
                let numWins = valuesThatLoseToThisOne.length + ((valuesThatTieThisOne.length ) / 2)
                value.wins = numWins - .5
                let indexOfFirstValueWithSameValue = sortedValues.findIndex(v => v.value === value.value)
                value.rank = indexOfFirstValueWithSameValue + 1
                sumOfWins += numWins


                // win eff.
                // how much into range is the value
                // how many wins did this value get

                if (value.value === 0) {
                    value.winEfficiency = 0
                } else {

                    let rangeIntoValue = (value.value - min) / range
                    if (rangeIntoValue === 0) {
                        value.winEfficiency = 0
                    }
                    else {
                        value.winEfficiency = ((numWins - .5) / (rangeIntoValue)) / (teamsInLeague * numberCompletedWeeks)

                        // if (statMetadata.isRateStat) {
                        //     value.winEfficiency = (numWins - .5) / ((value.value * 100) / (sumOfValues))
                        // }
                    }

                }
            })

            

            sortedValues.forEach((value, index) => {

                let winEfficiencyRankForThisStat = sortedValues.findIndex(v => v.winEfficiency === value.winEfficiency)
                value.winEfficiencyRankForThisStat = winEfficiencyRankForThisStat
                value.winEfficiencyRankPctForThisStat = winEfficiencyRankForThisStat / sortedValues.length
            })

            let winsPerStat = sumOfWins / (teamsInLeague * numberCompletedWeeks)
            

            fullLeagueStatsDictBuilder[statKey].avg = avg
            fullLeagueStatsDictBuilder[statKey].sum = sum
            fullLeagueStatsDictBuilder[statKey].min = min
            fullLeagueStatsDictBuilder[statKey].max = max
            fullLeagueStatsDictBuilder[statKey].range = range
            fullLeagueStatsDictBuilder[statKey].median = median
            fullLeagueStatsDictBuilder[statKey].bottomQuarterValue = bottomQuarterValue
            fullLeagueStatsDictBuilder[statKey].topQuarterValue = topQuarterValue
            fullLeagueStatsDictBuilder[statKey].iqr = iqr
            fullLeagueStatsDictBuilder[statKey].variance = variance
            fullLeagueStatsDictBuilder[statKey].stdev = stdev;
            fullLeagueStatsDictBuilder[statKey].cv = cv;
            fullLeagueStatsDictBuilder[statKey].winsPerStat = winsPerStat;
            fullLeagueStatsDictBuilder[statKey].isRateStat = statMetadata.isRateStat;
            fullLeagueStatsDictBuilder[statKey].lowerIsBetter = statMetadata.lowerIsBetter;
            fullLeagueStatsDictBuilder[statKey].category = statMetadata.category;
            fullLeagueStatsDictBuilder[statKey].values = sortedValues;
        })

        addIncreasedStatCalcToNumbers(fullLeagueStatsDictBuilder, 20)


        let allStatValues = []
        Object.keys(fullLeagueStatsDictBuilder).forEach(statKey => {
            let statEntry = fullLeagueStatsDictBuilder[statKey]
            statEntry.values.forEach(statValue => {
                allStatValues.push({
                    ...statValue,
                    stat: statKey,
                    isTeamAvg: false,
                })
            })
        })

        // console.log("allStatValues", allStatValues.map(v => v.winEfficiency))
        let allStatValuesSortedByWinEfficiency = allStatValues.sort((a, b) => {
            let aVal = a.winEfficiency ?? 0; 
            let bVal = b.winEfficiency ?? 0; 
        
            return bVal - aVal;
        })
        Object.keys(fullLeagueStatsDictBuilder).forEach(statKey => {
            let statEntry = fullLeagueStatsDictBuilder[statKey]
            statEntry.values.forEach(statValue => {
                let winEfficiencyRank = allStatValuesSortedByWinEfficiency.findIndex(v => v.winEfficiency === statValue.winEfficiency)
                statValue.winEfficiencyRank = winEfficiencyRank
                statValue.winEfficiencyRankPct = winEfficiencyRank / allStatValuesSortedByWinEfficiency.length
            })
        })

        let allStatValuesSortedByWins = allStatValues.sort((a, b) => {
            let aVal = a.wins
            let bVal = b.wins
            return bVal - aVal
        })
        Object.keys(fullLeagueStatsDictBuilder).forEach(statKey => {
            let statEntry = fullLeagueStatsDictBuilder[statKey]
            statEntry.values.forEach(statValue => {
                let winRank = allStatValuesSortedByWins.findIndex(v => v.value === statValue.value)
                statValue.winRank = winRank
                statValue.winRankPct = winRank / allStatValuesSortedByWins.length
            })
        })

        let allStatValuesSortedByWinDiffAt10 = allStatValues.sort((a, b) => {
            let aVal = a.increasedStatCalcs[20].winDiff
            let bVal = b.increasedStatCalcs[20].winDiff
            return bVal - aVal
        })
        Object.keys(fullLeagueStatsDictBuilder).forEach(statKey => {
            let statEntry = fullLeagueStatsDictBuilder[statKey]
            statEntry.values.forEach(statValue => {
                let winRank = allStatValuesSortedByWinDiffAt10.findIndex(v => v.value === statValue.value)
                statValue.winRankAt10 = winRank
                statValue.winRankAt10Pct = winRank / allStatValuesSortedByWinDiffAt10.length
            })
        })

        let allStatValuesSortedByRankPct = allStatValues.sort((a, b) => {
            let aVal = a.increasedStatCalcs[20].winDiffPct
            let bVal = b.increasedStatCalcs[20].winDiffPct
            return bVal - aVal
        })
        Object.keys(fullLeagueStatsDictBuilder).forEach(statKey => {
            let statEntry = fullLeagueStatsDictBuilder[statKey]
            statEntry.values.forEach(statValue => {
                let winRank = allStatValuesSortedByRankPct.findIndex(v => v.increasedStatCalcs[20].winDiffPct === statValue.increasedStatCalcs[20].winDiffPct)
                statValue.globalWinDiffPct = winRank
                statValue.globalWinDiffPct = winRank / allStatValuesSortedByRankPct.length
                statValue.globalRank = winRank + 1
            })
        })

        // calculate team totals and averages for each stat
        Object.keys(teamsDictBuilder).forEach(teamKey => {
            let team = teamsDictBuilder[teamKey]
            team.averagesDict = {}
            Object.keys(team.stats).forEach(statKey => {
                let statEntry = team.stats[statKey]
                let statValues = statEntry.values
                let sum = statValues.reduce((acc, obj) => acc + obj.value, 0);
                let avg = sum / statValues.length;
                team.averagesDict[statKey] = avg
            })
        })
        // console.log('teamsDictBuilder', teamsDictBuilder)

        // inject team averages into value arrays
        Object.keys(fullLeagueStatsDictBuilder).forEach(statKey => {
            let statEntry = fullLeagueStatsDictBuilder[statKey]
            let statValues = statEntry.values
            Object.keys(teamsDictBuilder).forEach(teamKey => {
                let team = teamsDictBuilder[teamKey]
                let teamStatAverage = team.averagesDict[statKey]
                statValues.push({
                    team: teamKey,
                    value: teamStatAverage,
                    isTeamAvg: true
                })
            })
        })

        // console.log("fullLeagueStatsDictBuilder", fullLeagueStatsDictBuilder)
        // console.log("teamsDictBuilder", teamsDictBuilder)

        setFullLeagueStatsDict(fullLeagueStatsDictBuilder)
        setTeamsDict(teamsDictBuilder)
    }, []);

    function showAll() {
        let updatedTeamsDict = { ...teamsDict }
        Object.keys(updatedTeamsDict).forEach(teamKey => {
            updatedTeamsDict[teamKey].isHidden = false;
        })
        setTeamsDict(updatedTeamsDict)
    }
    function hideAll() {
        let updatedTeamsDict = { ...teamsDict }
        Object.keys(updatedTeamsDict).forEach(teamKey => {
            updatedTeamsDict[teamKey].isHidden = true;
        })
        setTeamsDict(updatedTeamsDict)
    }

    function expandAllStats() {
        let statBoxes = document.querySelectorAll('[id^="stat-box-"]');
        statBoxes.forEach((statBox) => {
            statBox.open = true;
        })
    }
    function collapseAllStats() {
        let statBoxes = document.querySelectorAll('[id^="stat-box-"]');
        statBoxes.forEach((statBox) => {
            statBox.open = false;
        })
    }

    function toggleTeam(team) {
        let updatedTeamsDict = { ...teamsDict }
        updatedTeamsDict[team.abbr].isHidden = !updatedTeamsDict[team.abbr].isHidden;
        setTeamsDict(updatedTeamsDict)
    }

    function getStyleStringForWinEfficiency(statValue) {

        let styleString = ''
        if (statValue.winEfficiencyRankPct < .25) { styleString += ` font-bold text-yellow-200` }

        return styleString
    }

    function getStatValueStyles(detailedValue,  statSummariesForStatWithNoTeamEntries) {

        let styleString = ''

        if (detailedValue.isTeamAvg) {
            return ''
        }

        let statToCheckVal = detailedValue.increasedStatCalcs[20].winDiffPct * 100;
        let overallToCheckVal = detailedValue.globalWinDiffPct * 100;
        let winEfficiencyStat = detailedValue.winEfficiencyRankPct * 100;

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

        if      (overallToCheckVal > 90)  { styleString += `border-accentShadeNegative-950` }
        else if (overallToCheckVal > 80)  { styleString += `border-accentShadeNegative-800` }
        else if (overallToCheckVal > 70)  { styleString += `border-accentShadeNegative-700` }
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

    return (
    <details open className="flex flex-col w-full py-4 px-0">
        <summary>
            <h2 className="mt-0 py-0">Fantasy Stat Summaries</h2>
        </summary>        
        <div className="flex flex-col gap-x-1 gap-y-1 flex-wrap w-full">
            <div className="flex flex-row w-full gap-x-1 gap-y-1">Each box is a posted-weekly stat total from a team.</div>
            <div className="flex flex-row w-full gap-x-1 gap-y-1">TLDR: if your logo is next to light blue boxes, or orange borders, you may want to target an increase in this stat.</div>
            <div className="flex flex-row w-full gap-x-1 gap-y-1">Top number is the stat value for a team in a completed week/matchup. </div>
            <div className="flex flex-row w-full gap-x-1 gap-y-1">Bottom-left value is WINS GAINED if you increase this stat by .2 of the IQR of the stat. </div>
            <div className="flex flex-row w-full gap-x-1 gap-y-1">Bottom-right value is WIN EFFICIENCY; aka having to earn less of a stat to beat more opponents = more efficient.</div>
            <div className="flex flex-row w-full gap-x-1 gap-y-1"><div className="rounded w-fit px-1 bg-accentShadePositive-700">Lighter Blue</div>: benefits more from small gains relative to other values in this stat. </div>
            <div className="flex flex-row w-full gap-x-1 gap-y-1"><div className="rounded border w-fit px-1 border-accentShadeNegative-800">Oranger Border</div>: benefits more from small gains relative to all values in ALL stats. </div>
            <div className="flex flex-row w-full gap-x-1 gap-y-1"><div className="text-yellow-200 font-bold">Yellow #</div>: This value has a high-performing WIN EFFICIENCY.</div>
            <div className="flex flex-row w-full gap-x-1 gap-y-1"><div className="font-bold">Team Logo</div>: team's average for this stat</div>
        </div>

        { teamsDict &&
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
                { Object.keys(teamsDict).map(teamKey => {
                    let team = teamsDict[teamKey];
                    if (team.isHidden) {
                        return <img onClick={() => toggleTeam(team)} key={teamKey} src={getLogoPath(team)} alt="logo" className="w-8 h-8 mb-auto mt-0 cursor-pointer hover:border-neutral-200 rounded-full border border-gray-700 border-radius-full opacity-25" />
                    }
                    return <img onClick={() => toggleTeam(team)} key={teamKey} src={getLogoPath(team)} alt="logo" className="w-8 h-8 mb-auto mt-0 cursor-pointer hover:border-neutral-200 rounded-full border border-gray-700 border-radius-full" />
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
        { fullLeagueStatsDict && <div className="w-full flex flex-col">
        {Object.keys(fullLeagueStatsDict).map((statKey, index) => {
            return <div key={index} className="flex flex-col w-full py-2 border border-gray-800 rounded px-2">
                <details id={`stat-box-`+statKey} open className="flex flex-col w-full">
                    <summary className="flex flex-col w-full gap-y-2 cursor-pointer pb-2">
                        <div className="flex flex-row gap-x-2 w-full flex-wrap gap-y-1">
                            <div className="text-lg pr-2 w-12 text-center">{statKey}</div>
                            <div className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                <div>AVG</div>
                                <div>{fullLeagueStatsDict[statKey].avg.toFixed(2)}</div>
                            </div>
                            <div className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                <div>CV</div>
                                <div>{fullLeagueStatsDict[statKey].cv.toFixed(2)}</div>
                            </div>
                            { Object.keys(fullLeagueStatsDict[statKey].values[0].increasedStatCalcs).map((iqrIncreaseKey, i) => {
                                return <div key={i} className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                    <div>{iqrIncreaseKey}% IQR</div>
                                    <div>{fullLeagueStatsDict[statKey].values[0].increasedStatCalcs[iqrIncreaseKey].increaseAmount.toFixed(2)}</div>
                                </div>
                            })  
                            }

                            <div className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                <div>v25%</div>
                                <div>{fullLeagueStatsDict[statKey].bottomQuarterValue.toFixed(2)}</div>
                            </div>
                            <div className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                <div>MED</div>
                                <div>{fullLeagueStatsDict[statKey].median.toFixed(2)}</div>
                            </div>
                            <div className="text-center text-sm mt-auto text-gray-500 flex flex-col w-fit">
                                <div>^25%</div>
                                <div>{fullLeagueStatsDict[statKey].topQuarterValue.toFixed(2)}</div>
                            </div>

                            <div className="text-xs text-blue-600 ml-auto mr-0 my-0 py-0">
                                [expand]
                            </div>
                        </div>
                    </summary>

                    <div className="flex flex-row gap-x-1 w-fit flex-wrap gap-y-1">
                        { fullLeagueStatsDict[statKey].values.sort((a,b) => STAT_METADATA[statKey].lowerIsBetter ? a.value - b.value : b.value - a.value).map((s, i) => {

                            if (s.isTeamAvg) {
                                if (teamsDict[s.team].isHidden) { return <></> }
                                return <div key={i} className={`flex flex-col w-14 h-fit py-0 text-sm text-neutral-300 border rounded-sm border-gray-800 gap-y-0 ` + getStatValueStyles(s, fullLeagueStatsDict[statKey])}>
                                    <div className="w-full mx-auto px-0 text-center text-neutral-300 flex flex-row" style={{fontSize: '0.7rem'}}>
                                        <></>
                                        <div className='mx-auto my-auto  text-sm font-bold z-10 [text-shadow:_0px_0px_10px_rgb(0_0_0)]'>
                                            {getValueString(statKey, s.value)}
                                        </div>
                                    </div>
                                    <div className="w-fit mx-auto -mt-1 z-10"> {s.team} </div>
                                    <img src={getLogoPathByTeamKey(s.team)} alt="logo" className="w-full h-10 mb-auto -mt-9 mx-auto opacity-75 rounded" />     
                                </div>
                            }
                            else {
                                return <div key={i} className={`flex flex-col w-14 h-fit py-0 text-sm rounded-sm border border-gray-800 gap-y-0 ` + getStatValueStyles(s, fullLeagueStatsDict[statKey])}>
                                    <div className="w-full mx-auto px-0 text-center text-neutral-400 flex flex-row" style={{fontSize: '0.7rem'}}>
                                        <img src={getLogoPathByTeamKey(s.team)} alt="logo" className="w-4 h-4 mb-auto mr-auto ml-auto mt-auto mb-0 opacity-100 rounded" />
                                        <div className='mx-auto my-auto text-neutral-300 text-sm font-bold z-10 '>
                                            {getValueString(statKey, s.value)}
                                        </div>
                                    </div>
                                    <div className="w-full mx-auto px-0 text-center text-neutral-400 flex flex-row" style={{fontSize: '0.7rem'}}>
                                        <div className="w-fit mx-auto"> {s.globalWinDiffPct.toFixed(2)} </div>
                                        <div className={`w-fit mx-auto font-bold ` + getStyleStringForWinEfficiency(s)}> {s.winEfficiency.toFixed(2)} </div>
                                    </div>  
                                </div>
                            }                            
                        })}
                    </div>
                </details>
                
            </div>
        })}</div>
    }
    </details>
    )
}
