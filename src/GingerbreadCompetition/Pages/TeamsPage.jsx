import { useEffect, useState } from "react";

function TeamsPage(teamCount) {
    return (
        <div>
            <h3> Names</h3>
            <button className="flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-lg"> Challenge 1</button> 
            <button className="flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-lg"> Challenge 2</button> 
            <button className="flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-lg"> Challenge 3</button> 
            <button className="flex-row fill-row breath bg-contentBg text-defaultText border-2 rounded border-accent-300 shadow-lg shadow-black text-lg"> Challenge 4</button> 
        </div>
    );
}

export default TeamsPage;