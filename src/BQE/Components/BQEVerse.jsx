import { useState } from 'react'
import './BQEVerse.css'

export default function BQEVerse(props) {

    const [showCopyright, setShowCopyright] = useState(false)

    return <div className='bqe-verse' onClick={() => setShowCopyright(!showCopyright)}>
        <div className='bqe-verse-text'>{props.verse}</div>
        { props.reference
        ? <div className='bqe-verse-reference'>
            {props.reference}
        </div>
        : <span/>
        }
        <div className='esv-copyright'>
            { showCopyright
            ?<div className='esv-copyright-text'>
            Scripture quotations marked “ESV” are from the ESV® Bible 
            (The Holy Bible, English Standard Version®), 
            copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. 
            Used by permission. All rights reserved. The ESV text may not be quoted in any 
            publication made available to the public by a Creative Commons license. 
            The ESV may not be translated into any other language.

            Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible.
            </div>
            : <div/>
            }<div className='esv-copyright-title'>ESV Copyright</div>
        </div>
        
    </div>
}
