

export default function BlindLevelTable({ levels, chips, currentLevel, elapsedSeconds, formatTime }) {

    return <div className="flex flex-col w-fit mx-auto mb-auto">
        <div className="mb-2 text-gray-600 font-bold text-2xl">BLIND LEVELS</div>
        <div className="w-fit flex flex-col border border-gray-400">
            <div className="flex flex-row font-bold border-b border-gray-600 gap-1 p-1 text-gray-400 px-2">
                <div className="w-4">#</div>
                <div className="w-16"><div className="w-fit ml-auto">SB</div></div>
                <div>/</div>
                <div className="w-16"><div className="w-fit mr-auto">BB</div></div> 
                <div className="w-16"><div className="w-fit mr-auto">Start</div></div> 
                <div className="w-8"></div> 
            </div>
            {levels && levels.map((level, i) => {
                if (level.Level === 0 && currentLevel && level.StartSeconds === currentLevel.StartSeconds) {
                    return (
                        <div key={i} className="flex text-lg flex-row border-2 border-gray-400 text-gray-400 gap-1 p-1 px-2 font-bold">
                            <div className="w-4"></div>
                            <div className="w-32"><div className="w-fit ml-auto">{level.SB}</div></div>
                            <div className="w-1"></div>
                            <div className="w-0"><div className="w-fit mr-auto">{level.BB}</div></div>
                            <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                            { level.removeChip &&
                                <div className="w-6 flex ml-auto">
                                    <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                </div> 
                            }
                            { level.RebuyAllowed &&
                                <div className="w-6 flex ml-auto">
                                    <div className="ml-auto my-auto text-accent-600">rb</div>
                                </div> 
                            }
                        </div>
                    )
                }
                if (elapsedSeconds > 0 && currentLevel && level.StartSeconds === currentLevel.StartSeconds) {
                    return (
                        <div key={i} className="flex text-lg flex-row border-2 border-gray-400 font-bold gap-1 p-1 px-2">
                            <div className="w-4">{level.Level}</div>
                            <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                            <div>/</div>
                            <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                            <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                            { level.removeChip &&
                                <div className="w-6 flex ml-auto">
                                    <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                </div> 
                            }
                            { level.RebuyAllowed &&
                                <div className="w-6 flex ml-auto">
                                    <div className="ml-auto my-auto text-accent-600">rb</div>
                                </div> 
                            }
                        </div>
                    )
                }
                else if (level.Level === 0) {
                    return (
                        <div key={i} className="flex text-lg flex-row border-b-2 border-t border-gray-500 text-gray-400 gap-1 p-1 px-2">
                            <div className="w-4"></div>
                            <div className="w-32"><div className="w-fit ml-auto">{level.SB}</div></div>
                            <div className="w-1"></div>
                            <div className="w-0"><div className="w-fit mr-auto">{level.BB}</div></div>
                            <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                            { level.removeChip &&
                                <div className="w-6 flex ml-auto">
                                    <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                </div> 
                            }
                            { level.RebuyAllowed &&
                                <div className="w-6 flex ml-auto">
                                    <div className="ml-auto my-auto text-accent-600">rb</div>
                                </div> 
                            }
                        </div>
                    )
                }
                else if (elapsedSeconds > 0 && currentLevel && level.StartSeconds < currentLevel.StartSeconds) {
                    return (
                        <div key={i} className="flex text-lg flex-row border-b border-gray-600 text-gray-500 gap-1 p-1 px-2">
                            <div className="w-4">{level.Level}</div>
                            <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                            <div>/</div>
                            <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                            <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                            { level.removeChip &&
                                <div className="w-6 flex ml-auto">
                                    <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                </div> 
                            }
                            { level.RebuyAllowed &&
                                <div className="w-6 flex ml-auto">
                                    <div className="ml-auto my-auto text-accent-600">rb</div>
                                </div> 
                            }
                        </div>
                    )
                }
                else  {
                    return (
                        <div key={i} className="flex text-lg flex-row border-b border-gray-600 text-gray-500 gap-1 p-1 px-2">
                            <div className="w-4">{level.Level}</div>
                            <div className="w-16"><div className="w-fit ml-auto">{level.SB}</div></div>
                            <div>/</div>
                            <div className="w-16"><div className="w-fit mr-auto">{level.BB}</div></div>
                            <div className="w-16"><div className="w-fit mr-auto">{formatTime(level.StartSeconds)}</div></div> 
                            { level.removeChip &&
                                <div className="w-6 flex ml-auto">
                                    <div className="w-4 h-4 rounded-full ml-auto my-auto" style={{backgroundColor: chips.find(c => c.name === level.removeChip).color}}></div>
                                </div> 
                            }
                            { level.RebuyAllowed &&
                                <div className="w-6 flex ml-auto">
                                    <div className="ml-auto my-auto text-accent-600">rb</div>
                                </div> 
                            }
                        </div>
                    )
                }
            })}
        </div>
    </div>
}