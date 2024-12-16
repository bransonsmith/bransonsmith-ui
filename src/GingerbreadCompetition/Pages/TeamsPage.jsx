import { useEffect, useState } from "react";
import Challenge from "./ChallengeOnePage";
import style from "../Data/Style";
import { vantages } from "../Data/Vantages";
import { items } from "../Data/Items";
import { features } from "../Data/Features";

function namesToString(params) {
    let string = ''
    for (let index = 0; index < params.length; index++) {
        string += params[index];
        string += ', '
        
    }
    return string
}

function TeamsPage(props) {
    return (
        <div>
            <h3> {namesToString(props.names)} </h3>
            <Challenge data={style} text="Challenge 1"/>
            <Challenge data={vantages} text="Challenge 2" />
            <Challenge data={items} text="Challenge 3" />
            <Challenge data={features} text="Challenge 4" />   
        </div>
    );
}

export default TeamsPage;