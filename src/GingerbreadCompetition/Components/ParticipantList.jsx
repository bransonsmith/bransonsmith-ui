import {useState} from 'react';

export default function ParticipantList ({ people, toggleParticipation, manageable }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <details open={!isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} className="w-full">
            <summary className="w-full flex items-center cursor-pointer">
                <h3 className="m-0">{people.filter(p => p.participating).length} Participants</h3>
                {isCollapsed 
                    ? <span className="ml-3 mr-auto rounded-full py-1 px-3 text-neutral-400 bg-contentBg border-neutral-800">expand</span> 
                    : <span className="ml-3 mr-auto rounded-full py-1 px-3 text-neutral-400 bg-contentBg border-neutral-800">hide</span>
                }
            </summary>
            <div className="flex flex-row flex-wrap gap-2 mt-2">
                {people.filter(person => manageable || person.participating).map((person) => (
                    <span key={person.id}>
                        {person.participating ? (
                            <div
                                onClick={manageable ? () => toggleParticipation(person) : null}
                                className="py-1 px-1 rounded border-2 border-neutral-400 font-bold [text-shadow:_0px_0px_5px_rgb(5_5_5)]"
                                style={{ background: `${person.background}` }}
                            >
                                <p>{person.name}</p>
                            </div>
                        ) : (
                            manageable && (
                                <div
                                    onClick={() => toggleParticipation(person)}
                                    className="py-1 px-1 rounded border-2 font-bold [text-shadow:_0px_0px_5px_rgb(5_5_5)] text-slate-700 bg-neutral-800 border-slate-700"
                                >
                                    <p>{person.name}</p>
                                </div>
                            )
                        )}
                    </span>
                ))}
            </div>
        </details>
    );
};
