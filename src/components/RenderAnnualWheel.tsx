// components/RenderAnnualWheel.tsx

"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { AnnualWheelWithEvents } from "@/types/AnnualWheel";
import { Event } from "@/types/Event";
import {Box, Button} from "@mui/material";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";
import { Canvg } from 'canvg';
import {monthEnumToNumber} from "@/lib/dates";

interface Props {
    annualWheel: AnnualWheelWithEvents;
}

interface EventDataWithCount extends Event {
    itemCount?: number; // Optional property to hold the count
    index?: number
    month?: number;
}

function svgToDataUrl(svgElement: SVGSVGElement): string {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const base64 = window.btoa(unescape(encodeURIComponent(svgString)));
    return "data:image/svg+xml;base64," + base64;
}

const RenderAnnualWheel: React.FC<Props> = ({ annualWheel }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (svgRef.current) {
            drawAnnualWheel(svgRef.current, 700, 700, annualWheel);
        }
    }, [annualWheel]);

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

    const handleExportSVG = () => {
        if (!svgRef.current) return;
        const svgElement = svgRef.current;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "annual-wheel.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Box>
        <div style={{ textAlign: "center" }}>
            <svg ref={svgRef} viewBox="0 0 700 700" width="100%" height="100%" />
            <div
                id="tooltip"
                style={{
                    position: "absolute",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    pointerEvents: "none",
                    opacity: 0,
                    transition: "opacity 0.3s",
                }}
            ></div>
        </div>
            <Box mt={4}>
                <Button variant="contained" color="primary" href="/" style={{marginRight: 10}}>
                    Tillbaka hem
                </Button>
                <Button variant="contained" color="secondary" onClick={handleExportPDF} style={{marginRight: 10}}>
                    Spara som PDF
                </Button>
                <Button variant="contained" color="secondary" onClick={handleExportPPT}  style={{marginRight: 10}}>
                    Spara som Powerpoint
                </Button>
                <Button variant="contained" color="secondary" onClick={handleExportSVG}>
                    Spara som SVG
                </Button>
            </Box>
        </Box>

            );
};

export default RenderAnnualWheel;


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

/**
 * Draw the D3-based "annual wheel" into an <svg> element.
 */
function drawAnnualWheel(svgEl: SVGSVGElement, width: number, height: number, annualWheel: AnnualWheelWithEvents) {
    // Clear previous render
    const svgRoot = d3.select(svgEl);
    svgRoot.selectAll("*").remove();

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

    const months = [
        "Januari", "Februari", "Mars", "April", "Maj", "Juni",
        "Juli", "Augusti", "September", "Oktober", "November", "December"
    ];

    const totalMonths = 12;
    const radiansPerMonth = (2 * Math.PI) / totalMonths;
    const radiansPerQuarter = radiansPerMonth / 4;

    // Generate monthData split into quarters
    const monthDataWithQuarters: any = [];
    for (let m = 0; m < totalMonths; m++) {
        for (let q = 0; q < 4; q++) {
            monthDataWithQuarters.push({ month: m, quarter: q });
        }
    }

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
        .attr("d", (d: any) => {
            const startAngle = monthToAngle(d.month) + d.quarter * radiansPerQuarter;
            const endAngle = startAngle + radiansPerQuarter;
            return topArc({ startAngle, endAngle });
        });

    const innerArc = d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius * 0.98);

    // Each quarter arc
    svg.selectAll("path.month-arc-3")
        .data(monthDataWithQuarters)
        .enter()
        .append("path")
        .attr("class", "month-arc-3")
        .attr("transform", `translate(${centerX},${centerY})`)
        .attr("fill", "rgb(83,160,69)") // Single green color
        .attr("d", (d: any) => {
            const startAngle = monthToAngle(d.month) + d.quarter * radiansPerQuarter;
            const endAngle = startAngle + radiansPerQuarter;
            return innerArc({ startAngle, endAngle });
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
        .attr("fill", "rgba(83,160,69, 0.5)") // Single green color with transparency
        .attr("d", (d: any) => {
            const startAngle = monthToAngle(d.month) + d.quarter * radiansPerQuarter;
            const endAngle = startAngle + radiansPerQuarter;
            return monthArc({ startAngle, endAngle });
        });

    // 2) Place Month Labels around the outer edge
    //    We'll position them slightly outside the ring
    const labelRadius = outerRadius + 20;
    svg.selectAll("text.month-label")
        .data(months)
        .enter()
        .append("text")
        .attr("class", "month-label")
        .attr("font-size", 14)
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .attr("transform", (d, i) => {
            // Calculate angle at the center of the month arc
            const angle = monthToAngle(i + 0.5); // Center of the month
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            // Rotate so labels appear upright
            const deg = (angle * 180) / Math.PI + 90;
            return `translate(${x},${y}) rotate(${deg})`;
        })
        .attr("dy", "0.35em")
        .text((d) => d);

    // 3) Process Annual Wheel Data
    const events = annualWheel.events;

    const eventsWithCount: EventDataWithCount[] = addItemCountToEvents(events);

    // 4) Draw Event Arcs
    const eventArc = d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .padAngle(0.002); // small gap

    // Convert startMonth/endMonth to angles
    const eventData = eventsWithCount.map((ev) => {
        const startA = monthToAngle(monthEnumToNumber(ev.eventMonth)) + (Math.PI / 2);
        const endA = monthToAngle(monthEnumToNumber(ev.eventMonth) + 1) + (Math.PI / 2);
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
        .attr("fill", "rgba(83,160,69, 1)") // Solid green color
        .attr("d", (d: any) =>
            eventArc({
                startAngle: d.startAngle,
                endAngle: d.endAngle
            })
        )
        .on("mouseover", (event: any, d: any) => {
            tooltip
                .style("opacity", 1)
                .html(`<strong>${d.name}</strong>`)
                .style("left", `${event.pageX}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        });

    // 5) Event Labels, placed at the midpoint angle
    svg.selectAll("text.event-label")
        .data(eventData)
        .enter()
        .append("text")
        .attr("class", "event-label")
        .attr("font-size", 12)
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("transform", (d: any) => {
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
        .text((d: any) => d.name);
}

/**
 * Adds an `itemCount` property to each event based on the number of events in the same month.
 * @param events - Array of events to process.
 * @returns A new array of events with the `itemCount` property added.
 */
function addItemCountToEvents(events: Event[]): EventDataWithCount[] {
    // Step 1: Count the number of events in each month
    const monthCounts: Record<number, number> = {};
    const newEvents: EventDataWithCount[] = [];
    events.forEach(event => {
        const month = monthEnumToNumber(event.eventMonth);
        newEvents.push({
            ...event,
            month: month,
        });

        if (monthCounts[month]) {
            monthCounts[month] += 1;
        } else {
            monthCounts[month] = 1;
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
    const updatedEvents = newEvents.map(event => ({
        ...event,
        itemCount: monthCounts[event.month!],
        index: getIndex(event.month!)
    }));

    return updatedEvents;
}