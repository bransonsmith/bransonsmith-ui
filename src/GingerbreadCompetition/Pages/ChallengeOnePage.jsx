import { useState } from 'react';

//chose a random style and display, make sure that it is not the same
function randomStyle(dataArray) {
    
    return dataArray[Math.floor(Math.random() * dataArray.length)]
    
}

function Challenge(params) {
    const [buttonText, setButtonText] = useState(params.text);
    const textData = [...params.data];

    const handleClick = () => {
        let newStyle;
        do {
            newStyle = randomStyle(textData)
        } while (newStyle === buttonText);
        setButtonText(newStyle);
    };
    return (
        <button onClick={handleClick}
            className="flex-row fill-row breath bg-contentBg text-red-300 border-2 rounded border-white shadow-lg shadow-black text-lg">
            {buttonText}
        </button>        
    )    
}

export default Challenge;