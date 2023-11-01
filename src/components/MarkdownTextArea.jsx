
import { marked } from 'marked';
import { useState } from 'react';

export default function MarkdownTextArea(props) {

    const [displayMarkdown, setDisplayMarkdown] = useState(false)

    const getMarkdownText = () => {
        const rawMarkup = marked(props.text, { sanitize: true });
        return { __html: rawMarkup };
    };

    return (<div>
            <div className="flex flex-row">
                <label className="mr-auto">{props.label}</label> 
                <button className="mr-auto p-2 w-36 h-fit mt-auto underline bg-inherit font-normal" onClick={() => setDisplayMarkdown(!displayMarkdown)}>
                    { displayMarkdown == false ? <>Preview Markdown</> : <>Edit Text</>}
                </button>
            </div>
            { displayMarkdown == false ?
                <div className="w-full flex flex-col">
                    <textarea className="w-full min-h-[336px] max-h-[80vh]" rows="16" value={props.text} onChange={(e) => props.setText(e.target.value)}/>
                </div> :
                <div
                    className="markdown-preview bg-inputBg p-2 text-sm rounded min-h-[336px] max-h-[80vh]"
                    dangerouslySetInnerHTML={getMarkdownText()}
                />
            }
    </div>
    )
}