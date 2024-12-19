import { useEffect, useState } from 'react';

const TeamsList = ({ teams, showtime }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getTimeRemaining = (startTime, showAtMinutes) => {
        const revealTime = new Date(startTime.getTime() + showAtMinutes * 60000);
        const timeDiff = revealTime - currentTime;
        if (timeDiff <= 0) {
            return "Any moment now...";
        }
        const minutes = Math.floor(timeDiff / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {teams.map((team) => (
                <div key={team.id} className="border-2 p-4 rounded-md pt-2" style={{ borderColor: team.colorPrimary }}>
                    <h1 className="font-bold mb-2 mt-0 [text-shadow:_0px_0px_1px_rgb(0_0_0)]" 
                        style={{ color: team.colorSecondary, letterSpacing: "1px" }}
                        >{team.colorName} Team
                    </h1>
                    <div className="flex flex-row flex-wrap gap-2">
                        {team.members.map((member) => (
                            <div
                                key={member.id}
                                className="py-1 px-1 rounded border-2 border-neutral-400 font-bold [text-shadow:_0px_0px_5px_rgb(5_5_5)]"
                                style={{ background: `linear-gradient(45deg, ${team.colorPrimary}, ${team.colorSecondary})` }}
                            >
                                <p>{member.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        {team.challenges.sort((a, b) => a.showAtMinutes - b.showAtMinutes).map((challenge) => (
                            <div key={challenge.type} className="flex flex-row items-center gap-2">
                                <span className="text-gray-500 text-sm font-bold w-1/2 ml-auto text-right pr-3">{challenge.type}:</span>

                                { showtime && showtime.showChallenges && showtime.showChallenges[challenge.type]
                                    ? <span className="font-bold w-1/2">{challenge.name}</span>
                                    : <span className="font-bold w-1/2">???</span>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeamsList;