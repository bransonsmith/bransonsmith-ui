

export default function GameStateInput({ type, value, name, onChange, label, options, wide }) {
    return (<>
        { type === 'select'
        ?   <div className="flex flex-col gap-2 w-1/5">
                <label className="text-xs text-gray-500 m-0">Game Type:</label>
                <select
                    value={value}
                    onChange={onChange}
                    name={name}
                    className="border p-1 rounded-md text-xs"
                >
                    {options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
            </div>
        : <>
            { wide 
            ?   <div className="flex flex-col gap-2 w-3/4">
                    <label className="text-xs text-gray-500 m-0">{label}</label>
                    <input
                        type={type}
                        value={value}
                        name={name}
                        onChange={onChange}
                        className="border p-1 rounded-md text-xs"
                    />
                </div>
            :   <div className="flex flex-col gap-2 w-1/6">
                    <label className="text-xs text-gray-500 m-0">{label}</label>
                    <input
                        type={type}
                        value={value}
                        name={name}
                        onChange={onChange}
                        className="border p-1 rounded-md text-xs"
                    />
                </div>
            }
        </>
        
        
        }
        </>
    );
}; 