import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'JohnUnparsedText.txt');
const text = fs.readFileSync(filePath, 'utf-8');
const lines = text.split(/\r?\n/);

const pericopes = [];
let currentPericope = null;
let currentChapter = 0;
let currentTitle = ''
let firstNumberInLastLine = 0
let lastNumberInLastLine = 0

for (let i = 0; i < lines.length; i++) {

//   if (i > 25) break

  let line = lines[i].trim();
//   console.log("Handling: ", line)
  if (line === '') {
    // console.log('Line is empty.');
  }
  else {

    let lineSplit = line.split(' ')
    let firstWord = lineSplit[0]
    if (firstWord === "Chapter")
    {
        currentChapter = parseInt(line.match(/\d+/)[0], 10);
        // console.log('Updated currentChapter to ', currentChapter)
    }
    else if (isNaN(parseInt(firstWord)))
    {
        if (currentTitle) // save pericope
        {
            currentPericope['title'] = currentTitle
            currentPericope['endChapter'] = currentChapter
            currentPericope['endVerse'] = lastNumberInLastLine
            pericopes.push(currentPericope)
            // console.log('Saved pericope: ', currentTitle)
            currentPericope = null
        }
        currentTitle = line
        currentPericope = {
            title: currentTitle,
            tags: []
        }
        // console.log('Starting pericope: ', currentTitle)
    }
    else {
        firstNumberInLastLine = parseInt(firstWord)
        let lastNumberMatch = line.match(/(\d+)(?!.*\d)/);
        lastNumberInLastLine = lastNumberMatch ? parseInt(lastNumberMatch[1], 10) : 0;
       
        if (!currentPericope.startChapter)
        {
            currentPericope = {
                'title' : currentTitle,
                'startChapter' : currentChapter,
                'startVerse' : firstNumberInLastLine
            }
        }
    }
  }

  
  
 
}

currentPericope['title'] = currentTitle
currentPericope['endChapter'] = currentChapter
currentPericope['endVerse'] = lastNumberInLastLine
pericopes.push(currentPericope)

pericopes.forEach((p, index) => {
  p.index = index + 1
  if (!p['title']) { console.log('Issue: ', p); return; }
  if (!p['endChapter'] || !p['startChapter']) { 
    console.log(`Issue: ${p.title} - Chapter numbers are missing`); 
    return;
  }
  if (!p['endVerse'] || !p['startVerse']) { 
    console.log(`Issue: ${p.title} - Verse numbers are missing`); 
    return;
  }

  const previousPericope = pericopes[index - 1];
  


  // Check that chapter and verse numbers are in ascending order within each pericope
if (previousPericope && ((p.startChapter < previousPericope.endChapter) || (p.startChapter === previousPericope.endChapter && p.startVerse < previousPericope.endVerse))) {
    console.log(`Incorrect order: ${p.title} starts before or at the end of previous pericope`);
  }
});

const outputPath = path.join(__dirname, 'JohnParsedText.json');
fs.writeFileSync(outputPath, JSON.stringify(pericopes, null, 2), 'utf-8');
console.log(`Wrote ${pericopes.length} pericopes to JohnParsedText.json`);