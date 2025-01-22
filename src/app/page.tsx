"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";
import { Canvg } from 'canvg';

// 12 months, index 0 = January, up to index 11 = December
const months = [
    "Januari", "Februari", "Mars", "April", "Maj", "Juni",
    "Juli", "Augusti", "September", "Oktober", "November", "December"
];

// Example events with a startMonth and endMonth (inclusive).
// Adjust or load from your backend as needed.
interface EventData {
    name: string;
    month: number; // 0-based index (0=January)
    itemCount?: number; // Optional property to hold the count
    index?: number
}

const events: EventData[] = [
    {
        name: "Medlemsmöte - Kommunalt program",
        month: 0,
    },
    {
        name: "Sommarkampanj",
        month: 2
    },
    {
        name: "Något coolt",
        month: 2
    },

{
    name: "Höstkonferens",
    month: 4,
},
{
    name: "Höstkonferens",
    month: 4,
},
{
    name: "Höstkonferens",
    month: 4,
},
{
    name: "Höstkonferens",
    month: 4,
},
{
    name: "Höstkonferens",
    month: 9,
},
{
    name: "Höstkonferens",
    month: 9,
}
,
{
    name: "Höstkonferens",
    month: 9,
}




];

/**
 * Adds an `itemCount` property to each event based on the number of events in the same month.
 * @param events - Array of events to process.
 * @returns A new array of events with the `itemCount` property added.
 */
function addItemCountToEvents(events: EventData[]): EventData[] {
    // Step 1: Count the number of events in each month
    const monthCounts: Record<number, number> = {};
    events.forEach(event => {
        if (monthCounts[event.month]) {
            monthCounts[event.month] += 1;
        } else {
            monthCounts[event.month] = 1;
        }
    });

    const currentIndex: Record<number, number> = {};


    function getIndex(month: number) {
        let index = currentIndex[month];
        if (index == undefined) {
            currentIndex[month] = 0;
            index = -1;
        }
        index++;
        currentIndex[month] = index;
        return index;
    }

    // Step 2: Assign the `itemCount` to each event
    const updatedEvents = events.map(event => ({
        ...event,
        itemCount: monthCounts[event.month],
        index: getIndex(event.month)
    }));

    return updatedEvents;
}

// Convert <svg> to Base64 data URL (SVG).
function svgToDataUrl(svgElement: SVGSVGElement): string {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const base64 = window.btoa(unescape(encodeURIComponent(svgString)));
    return "data:image/svg+xml;base64," + base64;
}

/**
 * Convert a month index (0-11) to an angle in radians.
 * - We want Jan at 12 o'clock, so we start at -90 degrees (-π/2).
 * - Each month is 2π / 12 = π/6 radians.
 */
function monthToAngle(monthIndex: number): number {
    const offset = -Math.PI / 2; // 12 o'clock
    const radiansPerMonth = (2 * Math.PI) / 12;
    return monthIndex * radiansPerMonth + offset;
}

function wrap(text: d3.Selection<SVGTextElement, any, any, any>, width: number) {
    text.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word: string | undefined;
        let line: string[] = [];
        const lineHeight = 1.1; // ems
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null)
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", `${dy}em`);
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if ((tspan.node() as any).getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", `${lineHeight}em`)
                    .text(word);
            }
        }
    });
}

/**
 * Draw the D3-based "annual wheel" into an <svg> element.
 */
function drawAnnualWheel(svgEl: SVGSVGElement, width: number, height: number) {
    // Clear previous render
    const svgRoot = d3.select(svgEl);
    svgRoot.selectAll("*").remove();

    const eventsWithCount = addItemCountToEvents(events);

    // Define margin, so we don't get clipped text.
    const margin = 50;
    const w = width - margin * 2;
    const h = height - margin * 2;

    // Create an inner <g> to handle margin offset
    const svg = svgRoot
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin},${margin})`);

    const centerX = w / 2;
    const centerY = h / 2;

    const tooltip = d3.select("#tooltip");

    // Outer radius for arcs (slightly smaller than half of w/h)
    const outerRadius = Math.min(w, h) / 2;
    // Make a larger inner circle to match the "open center" design
    const innerRadius = outerRadius * 0.3; // 60% of outer radius

    // 1) Draw a SINGLE GREEN RING (with 12 arcs if you want month division visible).
    //    If you want absolutely no division lines, you can create one arc from 0 to 2π.

    const monthData = months.map((m, i) => i); // 0..11

    const quarterPerMonth = 4;
    const totalMonths = 12;
    const radiansPerMonth = (2 * Math.PI) / totalMonths;
    const radiansPerQuarter = radiansPerMonth / quarterPerMonth;

    // Generate monthData split into quarters
    const monthDataWithQuarters: any = [];
    for (let m = 0; m < totalMonths; m++) {
        for (let q = 0; q < quarterPerMonth; q++) {
            monthDataWithQuarters.push({ month: m, quarter: q });
        }
    }
    // Single green color
    const singleGreen = "rgb(255,185,166)"; // RGB(83, 160, 69) Hex: #53A045

    const topArc = d3.arc<any>()
        .innerRadius(outerRadius * 0.98)
        .outerRadius(outerRadius)
        .padAngle(0.002); // small gap

    // Each quarter arc
    svg.selectAll("path.month-arc-2")
        .data(monthDataWithQuarters)
        .enter()
        .append("path")
        .attr("class", "month-arc-2")
        .attr("transform", `translate(${centerX},${centerY})`)
        .attr("fill", "rgb(83,160,69)") // Single green color
        .attr("d", (d) => {
            const startAngle = monthToAngle(d.month) + d.quarter * radiansPerQuarter;
            const endAngle = startAngle + radiansPerQuarter;
            return topArc({ startAngle, endAngle });
        });

    // Define the arc generator
    const monthArc = d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 0.98)
        .padAngle(0.002); // small gap

    // Each quarter arc
    svg.selectAll("path.month-arc")
        .data(monthDataWithQuarters)
        .enter()
        .append("path")
        .attr("class", "month-arc")
        .attr("transform", `translate(${centerX},${centerY})`)
        .attr("fill", "rgba(83,160,69, 0.5)") // Single green color
        .attr("d", (d) => {
            const startAngle = monthToAngle(d.month) + d.quarter * radiansPerQuarter;
            const endAngle = startAngle + radiansPerQuarter;
            return monthArc({ startAngle, endAngle });
        });



    // 2) Place Month Labels around the outer edge
    //    We'll position them slightly outside the ring
    const labelRadius = outerRadius + 20;
    svg.selectAll("text.month-label")
        .data(monthData)
        .enter()
        .append("text")
        .attr("class", "month-label")
        .attr("font-size", 14)
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .attr("transform", (d) => {
            // Calculate angle at the center of the month arc
            const angle = monthToAngle(d + 0.5); // Center of the month
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            // Rotate so labels appear upright
            const deg = (angle * 180) / Math.PI + 90;
            return `translate(${x},${y}) rotate(${deg})`;
        })
        .attr("dy", "0.35em")
        .text((d) => months[d]);

    const eventArc = d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .padAngle(0.002); // small gap

    // Convert startMonth/endMonth to angles
    const eventData = eventsWithCount.map((ev) => {
        const startA = monthToAngle(ev.month) + (Math.PI / 2);
        const endA = monthToAngle(ev.month + 1) + (Math.PI / 2);
        const diff = (endA - startA) / ev.itemCount!;
        const adjStart = startA + (diff * ev.index!);
        const adjEnd = adjStart + diff;
        return {
            ...ev,
            startAngle: Math.min(adjStart, adjEnd),
            endAngle: Math.max(adjStart, adjEnd)
        };
    });

    svg.selectAll("path.event-arc")
        .data(eventData)
        .enter()
        .append("path")
        .attr("transform", `translate(${centerX},${centerY})`)
        .attr("fill", "rgba(83,160,69, 1)") // gold
        .attr("d", (d) =>
            eventArc({
                startAngle: d.startAngle,
                endAngle: d.endAngle
            })
        )    .on("mouseover", (event: any, d: any) => {
        tooltip
            .style("opacity", 1)
            .html(`<strong>${d.name}</strong>`)
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY - 28}px`);
    })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        });;

    // 4) Event Labels, placed at the midpoint angle
    svg.selectAll("text.event-label")
        .data(eventData)
        .enter()
        .append("text")
        .attr("class", "event-label")
        .attr("font-size", 12)
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("transform", (d) => {
            const midAngle = (d.startAngle + d.endAngle) / 2;
            // Typically, for a donut, place it halfway between inner & outer:
            const arcMidRadius = (innerRadius + outerRadius) / 2;

            const x = centerX + arcMidRadius * Math.cos(midAngle - (Math.PI / 2));
            const y = centerY + arcMidRadius * Math.sin(midAngle - (Math.PI / 2));

            // If you want text tangent to the arc:
            let angle = (midAngle * 180) / Math.PI - 90;
            if (angle > 90 || angle < -90) {
                angle += 180;
            }

            return `translate(${x},${y}) rotate(${angle})`;
        })
        .text((d) => d.name);
}

export default function Page() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (svgRef.current) {
            // Draw the updated annual wheel
            drawAnnualWheel(svgRef.current, 700, 700);
        }
    }, []);


    const handleExportPDF = async () => {
        if (!svgRef.current) return;
        const svgElement = svgRef.current;

        // Serialize the SVG
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        // Create a canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const width = svgElement.clientWidth;
        const height = svgElement.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Render the SVG onto the canvas using canvg
        const v = await Canvg.fromString(context!, svgString);
        await v.render();

        // Get the PNG data URL
        const pngDataUrl = canvas.toDataURL("image/png");

        // Create PDF and add the PNG image
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4"
        });
        pdf.addImage(pngDataUrl, "PNG", 20, 20, 500, 500);
        pdf.save("annual-wheel.pdf");
    };

    // Export to PowerPoint
    const handleExportPPT = () => {
        if (!svgRef.current) return;
        const svgDataUrl = svgToDataUrl(svgRef.current);

        const pptx = new PptxGenJS();
        const slide = pptx.addSlide();
        slide.addImage({
            data: svgDataUrl,
            x: 1,
            y: 1,
            w: 8,
            h: 6
        });
        pptx.writeFile({ fileName: "annual-wheel.pptx" });
    };

    return (
        <main style={{padding: 20}}>
            <h1>Årshjul 2025</h1>
            <p>
                Detta är ett årshjul
            </p>
            <div style={{textAlign: "center"}}>
                <svg ref={svgRef} viewBox="0 0 700 700" width="100%" height="auto"/>
                <div id="tooltip" style={{
                    position: "absolute",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    pointerEvents: "none",
                    opacity: 0,
                    transition: "opacity 0.3s"
                }}></div>
            </div>
            <div style={{marginTop: 20, textAlign: "center"}}>
                <Button variant="contained" color="primary" onClick={handleExportPDF} style={{marginRight: 10}}>
                    Export to PDF
                </Button>
                <Button variant="contained" color="secondary" onClick={handleExportPPT}>
                    Export to PPT
                </Button>
            </div>
        </main>
    );
}