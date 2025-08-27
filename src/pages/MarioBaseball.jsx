import { useEffect, useState } from 'react';
import MSSBCharacter from '../components/MarioBaseball/MSSBCharacter.jsx';
import { MSSB_CHARACTERS } from '../components/MarioBaseball/MssbCharacters.js';

export default function MarioBaseball({}) {

    const [characters] = useState(MSSB_CHARACTERS);

    return (
    <div>
        <h1>Mario Baseball</h1>
        <div className="content-container mssb-characters-page">
                <h1>Characters </h1>
                <div className="">
                    <div className="flex flex-row gap-x-2 mx-auto w-fit px-3 py-1 bg-gray-700 text-neutral-200 rounded-sm font-bold text-sm" style={{fontSize: "10px"}}>
                        <div className="text-center w-6"></div>
                        <div className="text-center w-32">Name</div>
                        <div className="text-center w-6">B</div>
                        <div className="text-center w-6">R</div>
                        <div className="text-center w-6">P</div>
                        <div className="text-center w-6">F</div>
                        <div className="text-center w-10">Ln</div>
                        <div className="text-center w-6">Z</div>
                        <div className="text-center w-10">Agi</div>
                        <div className="text-center w-10">Cov</div>
                        <div className="text-center w-10">RchO</div>
                        <div className="text-center w-10">RchI</div>
                        <div className="text-center w-6">Dv</div>
                        <div className="text-center w-6">Sz</div>
                        <div className="text-center w-6">Arm</div>
                        <div className="text-center w-6">Jmp</div>
                        <div className="text-center w-10">Chem</div>
                        <div className="text-center w-10">Stam</div>
                        <div className="text-center w-10">Curve</div>
                        <div className="text-center w-10">Velo</div>
                        <div className="text-center w-10">CVelo</div>
                        <div className="text-center w-10">ChgUp</div>
                    </div>  
                    {characters && characters.map((character, i) => (    
                        <div className={`flex flex-col gap-y-0`} key={character.Name}>
                            <MSSBCharacter character={character} i={i} />
                        </div>
                    ))}
                </div>
            </div>  
    </div>
    )
}


