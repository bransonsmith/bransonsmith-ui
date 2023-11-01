import { useState } from 'react';
import MarkdownTextArea from './MarkdownTextArea';

export default function DndForm() {

    const [summary, setSummary] = useState('');
    const [displayMarkdown, setDisplayMarkdown] = useState(false)

    return (<div className="max-w-screen-sm m-auto p-[min(48px,4vw)] bg-contentBg">
        <div id="session-form" className="w-full flex flex-col ">
          <h1>Dnd Session Summary</h1>
          <div className="w-full flex flex-row flex-wrap">
            <div className="w-16 flex flex-col mr-6">
              <label className="mr-auto">Number</label>
              <input className="mr-auto w-16"  type="number" id="sessionNumber" name="sessionNumber" required/>
            </div>
            <div className="w-48 flex flex-col mr-6">
              <label className="mr-auto">Date</label>
              <input className="mr-auto w-48" type="date" id="sessionDate" name="sessionDate" required/>
            </div>
            <div className="w-48 flex flex-col mr-6">
              <label className="mr-auto">Author</label>
              <input className="mr-auto w-48"  type="text" id="sessionAuthor" name="sessionAuthor"/>
            </div>
          </div>
            
          <MarkdownTextArea text={summary} setText={setSummary} label={'Session Summary'}/>

            <div className="w-full flex flex-col">
              <label className="mr-auto"  >Notes</label>
              <textarea rows="4" className="m-auto w-full" id="sessionNotes" name="sessionNotes"></textarea>
            </div>
            <button className="mr-auto p-2 w-36 my-10 rounded" onClick={() => console.log(summary)}>
                Submit
            </button>
        </div>
    </div>)
}