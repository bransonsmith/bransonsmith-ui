import React from 'react';

const TeamsList = ({ teams }) => {
    return (
        <div className="w-full flex flex-col gap-4">
            {teams.map((team) => (
                <div key={team.id} className="border-2 p-4 rounded-md pt-0" style={{ borderColor: team.colorPrimary }}>
                    <h2 className="font-bold mb-2 mt-0" style={{ color: team.colorPrimary }}>
                        {team.colorName} Team
                    </h2>
                    <div className="flex flex-row flex-wrap gap-2">
                        {team.members.map((member) => (
                            <div
                                key={member.id}
                                className="py-1 px-1 rounded border-2 border-neutral-400 font-bold [text-shadow:_0px_0px_5px_rgb(5_5_5)]"
                                style={{ background: `linear-gradient(to right, ${team.colorPrimary}, ${team.colorSecondary})` }}
                            >
                                <p>{member.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeamsList;