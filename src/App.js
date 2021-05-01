import React from "react";
import { useFetch } from "./hooks/useFetch";
//import WorldviewDemo from "./worldview-example";
//import {csv} from "d3-fetch";
import { scaleLinear } from "d3-scale";
import { extent, max, min, bin } from "d3-array";
import * as topojson from "topojson-client";
import world from '../land-50m';
//import {geoNaturalEarth1} from "d3-geo"
//import {geoNaturalEarth1} from "d3-geo-projection";
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

    //console.log("d3: ", d3.geoNaturalEarth1);
    /* THIS GOES IN APP.JS */  
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/colinmegill/react-parcel-starter/main/weather.csv"
    );
    const dataSmallSample = data.slice(0, 5000);

    const TMAXextent = extent(dataSmallSample, (d) => {
        return d.TMAX;
    });

    const land = topojson.feature(world, world.objects.land);
    const projection = d3.geoNaturalEarth1();
    const path = d3.geoPath(projection);
    const mapString = path(land);

    console.log("map", mapString);

    const maxValueOfMax = max( 
        dataSmallSample.map((measurement) => {
        return +measurement.TMAX;
    }));

    const minValueOfMax = min( 
        dataSmallSample.map((measurement) => {
        return +measurement.TMAX;
    }));

    //console.log(maxValueOfMax, minValueOfMax);
    //csv("https://raw.githubusercontent.com/colinmegill/react-parcel-starter/main/weather.csv").then((data) => console.log(data));
    //.then((response) => response.json())
    //console.log("from hook", loading, data);
    //console.log(loading);

    const chartSize = 500;
    const margin = 20;
    const axisTextAlignmentFactor = 3;
    const histogramLeftPadding = 20;
    const yScale = scaleLinear()
        .domain(TMAXextent)
        .range ([chartSize - margin, chartSize - 350]);

    _bins = bin().thresholds(30);
    tmaxBins = _bins(
        data.map((d) => {
            return +d.TMAX;
        })
    );

    
    return (
        
        <div>
            <h1>Exploratory Data Analysis, Assignment 2, info 474 sp 2021</h1>
            <p>{loading && "Loading data!"}</p>

            <h3> Working with Geo Data </h3>
            <svg width={1000} 
                height={600} 
                style={{ border: "1px solid black" }}>
                <path d={mapString} fill="rgb(200, 200, 200)"/>
                {dataSmallSample.map((measurement) => {
                    return <circle 
                        transform={
                            `translate(
                                ${projection(
                                    [measurement.longitude, measurement.latitude]
                                    ) })`} r="1.5"/>
                })}
            </svg>
            <h3>Binning</h3>
            <svg width={chartSize} height={chartSize} style={{ border: "1px solid black" }}>
                {tmaxBins.map((bin, index) => {
                    const binheight = bin.length;
                    return (
                        <rect 
                        y={chartSize - 50 - binheight} 
                        width="10" 
                        height={binheight} 
                        x={histogramLeftPadding + index * 11 }/>
                        //<rect key={index} x={index * 11} y={chartSize} width="10" height={bin.length}/>
                    );
                })}
            </svg>
            
            <h3>D3 Scales</h3>
            <svg
             width={chartSize}
            height={chartSize} 
            style={{border: "1px solid black"}}>  <text 
                x={chartSize/2 - 12}
                y={yScale(0 ) + axisTextAlignmentFactor} 
                textAnchor="end"
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}>
                    0
                </text>

                <text 
                x={chartSize/2 - 12} 
                y={yScale(100) + axisTextAlignmentFactor/*chartSize - margin - 100 + axisTextAlignmentFactor*/}
                textAnchor="end"
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}>
                    100
                </text>

                <line
                    x1={chartSize/2 - 10}
                    y1={yScale(100)}
                    x2={chartSize/2 - 5}
                    y2={yScale(100)}
                    stroke={"black"}
                />

                <line
                    x1={chartSize/2 - 10}
                    y1={yScale(0)}
                    x2={chartSize/2 - 5}
                    y2={yScale(0)}
                    stroke={"black"}
                />

                {dataSmallSample.map((measurement, index) => {   
                    const highlight = measurement.station ==="KALISPELL GLACIER AP";
                    return <line 
                    key={index} 
                    x1={chartSize/2}
                    //y1={chartSize - margin - measurement.TMAX}
                    y1={yScale(measurement.TMAX)}
                    x2={chartSize/2 + 20}
                    //y2={chartSize - margin - measurement.TMAX}
                    y2={yScale(measurement.TMAX)}
                    stroke={highlight ? "red" : "steelblue"}
                    strokeOpacity={highlight ? 1 : 0.2}
                    /*cx={highlight ? chartSize/2 : chartSize/2 - 20} 
                    cy={chartSize - margin - measurement.TMAX} 
                    r="3"
                    fill="none"
                    stroke={highlight ?  "red" : "steelblue"}
                    stroke-opacity="0.2"*//>
                })}
            </svg>

            <h3>Scatterplot</h3>
            <svg
            width={chartSize}
            height={chartSize} 
            style={{border: "1px solid black"}}>
                {dataSmallSample.map((measurement, index) => {   
                    const highlight = measurement.station ==="KALISPELL GLACIER AP";
                    return <circle 
                    key={index} 
                    cx={100 - measurement.TMIN} 
                    cy={chartSize - margin - measurement.TMAX} 
                    r="3"
                    fill="none"
                    stroke={highlight ?  "red" : "steelblue"}
                    strokeOpacity="0.2"/>
                })}
            </svg>

            <h3>Barcode Plot: Rendering circles :) this shows a distribution of TMAX</h3>
            <svg
             width={chartSize}
            height={chartSize} 
            style={{border: "1px solid black"}}>  <text 
                x={chartSize/2 - 12} 
                textAnchor="end"
                y={chartSize - margin + axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}>
                    0
                </text>

                <text 
                x={chartSize/2 - 12} 
                textAnchor="end"
                y={chartSize - margin - 100 + axisTextAlignmentFactor}
                style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}>
                    100
                </text>

                <line
                    x1={chartSize/2 - 10}
                    y1={chartSize - margin - 100}
                    x2={chartSize/2 - 5}
                    y2={chartSize - margin - 100}
                    stroke={"black"}
                />

                <line
                    x1={chartSize/2 - 10}
                    y1={chartSize - margin}
                    x2={chartSize/2 - 5}
                    y2={chartSize - margin}
                    stroke={"black"}
                />

                {dataSmallSample.map((measurement, index) => {   
                    const highlight = measurement.station ==="KALISPELL GLACIER AP";
                    return <line 
                    key={index} 
                    x1={chartSize/2}
                    y1={chartSize - margin - measurement.TMAX}
                    x2={chartSize/2 + 20}
                    y2={chartSize - margin - measurement.TMAX}
                    stroke={highlight ? "red" : "steelblue"}
                    strokeOpacity={highlight ? 1 : 0.2}
                    /*cx={highlight ? chartSize/2 : chartSize/2 - 20} 
                    cy={chartSize - margin - measurement.TMAX} 
                    r="3"
                    fill="none"
                    stroke={highlight ?  "red" : "steelblue"}
                    stroke-opacity="0.2"*//>
                })}
            </svg>

            <h3>Rendering circles :) this shows a distribution of TMAX</h3>
            <svg
            width={chartSize}
            height={chartSize} 
            style={{border: "1px solid black"}}>
                {dataSmallSample.map((measurement, index) => {   
                    const highlight = measurement.station ==="KALISPELL GLACIER AP";
                    return <circle 
                    key={index} 
                    cx={chartSize/2} 
                    cy={chartSize - margin - measurement.TMAX} 
                    r="3"
                    fill="none"
                    stroke={"steelblue"}
                    strokeOpacity="0.2"/>
                })}
            </svg>
        </div>
    )
}

export default App;