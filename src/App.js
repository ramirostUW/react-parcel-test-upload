import React from "react";
//import WorldviewDemo from "./worldview-example";
import {csv} from "d3-fetch";
/*
    return (
        <div>
            <p>from App rerender</p>
            <p>now for a worldview demo! </p>
            <p>class on April 13</p>
            <p>blue</p>

            <div stype={{ width: "50vw", height: "50vh" }}>
                <WorldviewDemo />
            </div>
        </div>
    )*/
const App = () => {
    csv("https://raw.githubusercontent.com/colinmegill/react-parcel-starter/main/weather.csv").then((data) => console.log(data));
    //.then((response) => response.json())
    
    return (
        
        <div>
            <h1>Exploratory Data Analysis, Assignment 2, info 474 spring 2021</h1>
        </div>
    )
}

export default App;