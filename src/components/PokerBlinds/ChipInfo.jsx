


export default function ChipInfo({ chips }) {
    return <div className="flex flex-col w-fit mr-0 mb-auto bl-auto">
        {/* <div className="mb-2 text-gray-600 font-bold text-2xl">Chips</div> */}
        <div className="w-52 flex flex-row flex-wrap gap-4 mx-auto mt-0">
            {chips && chips.map((chip) =>    
            <div key={chip.color} className="relative w-24 h-24">
                <div
                    className="text-outlined-dark absolute w-24 h-24 font-bold text-center pt-4 text-4xl rounded-full border-8 border-contentBg shadow-xl shadow-contentBg [text-shadow:_0px_0px_6px_rgb(0_0_0)]"
                    style={{ background: chip.color, color: chip.text }}
                >
                    {chip.value}
                </div>
                {[...Array(8)].map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const radius = 46;
                    let leftAdjust = 0;
                    let topAdjust = 0;
                    // if (i === 7) { leftAdjust =  .5; topAdjust = -.5; }
                    // if (i === 5) { leftAdjust = -.5; topAdjust = -.5; }
                    // if (i === 3) { leftAdjust = -.5; topAdjust =  .5; }
                    // if (i === 1) { leftAdjust =  .5; topAdjust =  .5; }
                    return {
                        transform: `rotate(${i * 45}deg)`,
                        left: `${radius + Math.cos(angle) * radius + leftAdjust}%`,
                        top: `${radius + Math.sin(angle) * radius + topAdjust}%`
                    };
                }).map((style, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2"
                        style={{ ...style, color: chip.detail, backgroundColor: chip.detail }}
                    >
                        {/* {i} */}
                        {/* <div className="w-1 h-1 border-2 rotate-45" style={{ borderColor: chip.text }} /> */}
                    </div>
                ))}
            </div>)}
        </div>
        <div className="flex flex-col w-full mt-8 ml-auto mr-0">
            <div className="flex flex-row w-full gap-1">
                { chips && chips.filter(c => c.quantity > 0).sort((a, b) => b.quantity - a.quantity).map((chip) => {
                    return <div key={chip.value} style={{backgroundColor: chip.color, color: chip.detail, height: "" + (chip.quantity * 8) + 'px'}} className="rounded p-0 mt-auto font-bold text-3xl w-16 text-center flex">
                        { chip.quantity == 1
                            ? <div className="-my-6 mx-auto p-0 [text-shadow:_0px_0px_4px_rgb(0_0_0)]">{chip.quantity}</div>
                            : <>{chip.quantity == 4
                                ? <div className="-my-1 mx-auto p-0 [text-shadow:_0px_0px_4px_rgb(0_0_0)]">{chip.quantity}</div>
                                : <div className="mt-auto mx-auto p-0 [text-shadow:_0px_0px_4px_rgb(0_0_0)]">{chip.quantity}</div>
                            }</>
                        }
                        <div className="w-1 flex flex-col gap-1 mr-0 mt-0.5 rounded-full" style={{}}>
                            { Array(chip.quantity).fill().map((_, i) => {
                                return <div  key={i} className="w-fit flex flex-row">
                                        <div className="w-1 h-1 ml-auto" style={{backgroundColor: chip.detail}}></div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                })}
            </div>
            <div className="text-gray-300 font-bold text-2xl mt-1">START STACK: {chips && chips.reduce((acc, cur) => acc + cur.quantity * cur.numValue, 0)}</div>
        </div>
    </div>
}