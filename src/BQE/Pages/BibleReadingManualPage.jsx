import { useEffect, useRef, useState } from "react";
import { getChapter } from "../Services/EsvApiService";
import { BibleData } from "../Data/BQEData"
import BQEBookChapterSelector  from "../Components/BQEBookChapterSelector"
import { Helmet } from 'react-helmet';
import { isaiahScripture, peterScripture } from "../Services/groupPrayerScriptures"

export default function BibleReadingManualPage() {
    const ref = useRef();
    const paragraphRefs = useRef([]);

    const contrastModes = ['PHONE', 'BRIGHT', 'BRIGHT_XL']

    const [contrastMode, setContrastMode] = useState(contrastModes[0]);
    const [book, setBook] = useState('');
    const [chapter, setChapter] = useState(1);
    const [paragraphs, setParagraphs] = useState(getChapterParagraphs());
 

    function getChapterParagraphs() {
        let resp = isaiahScripture + '\n\n        \n\n    ---    \n\n' + peterScripture
        let newChapterParagraphs = resp
            .replace('(ESV)', '')
            .replace('\n\n', '\n')
            .split('    ')
            .filter(p => /\S/.test(p))
            .map(p => { return {chapter: 1, book: 'a', content: p} });
        return newChapterParagraphs
    }

    function nextContrastMode() {
        let currentIndex = contrastModes.indexOf(contrastMode)
        let nextIndex = currentIndex + 1
        if (nextIndex > contrastModes.length - 1) { nextIndex = 0 }
        setContrastMode(contrastModes[nextIndex])
    }

    return <div>
        <Helmet>
            <title>Group 3/7/2024 | Branson Smith</title>
            <meta name="description" content="Read large portions of the Bible continuously with this esv bible viewer." />
            <link rel="canonical" href={`https://www.bransonsmith.dev/biblereading`} />
        </Helmet>
        <div className='w-full max-w-[100%] sticky top-0 text-shadow shadow-md bg-defaultBg py-2 px-8 rounded-md flex flex-col'>
            <div className="text-stone-700 cursor-pointer ml-auto mr-10" onClick={nextContrastMode}> [Contrast] </div>
            <div className="text-slate-500 w-full flex flex-col">
                <span className="text-2xl font-bold mr-4 my-4">Isaiah 40:6-26</span>
                <span className="text-2xl font-bold mr-4 ">1 Peter 1:17-2:3</span>
            </div>
        </div>
        
        <div className="w-[100%] m-auto mt-8 p-0">
            <div className="text-lg font-serif text-justify flex flex-col w-[100%]">
                {paragraphs.map((paragraph, index) => {
                    return <span id={`${paragraph.book}-${paragraph.chapter}-${index}`} 
                        key={`${paragraph.book}-${paragraph.chapter}-${index}`}>
                        { contrastMode == 'PHONE' &&
                            <p className="p-0 m-auto mt-1 max-w-[500px] text-stone-500 font-sans font-monospace leading-8">
                                &nbsp;&nbsp; {paragraph.content}
                            </p>
                        }
                        { contrastMode == 'BRIGHT' &&
                            <p className="p-0 m-auto mt-2 max-w-[500px] text-slate-200 font-sans font-bold text-xl leading-8">
                                &nbsp;{paragraph.content}
                            </p>
                        }
                        { contrastMode == 'BRIGHT_XL' &&
                            <p className="p-0 m-auto mt-4 max-w-[700px] text-slate-200 font-sans font-bold text-2xl leading-10">
                                &nbsp;{paragraph.content}
                            </p>
                        }
                    </span>
                })}
            </div>
            <div ref={ref}></div>
        </div>
        
    </div>
}