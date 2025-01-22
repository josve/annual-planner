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
    month: number;
}
const events: EventData[] = [
    {
        name: "Medlemsmöte - Kommunalt program",
        month: 0,
    },
    {
        name: "Sommarkampanj",
        month: 0
    },
    {
        name: "Höstkonferens",
        month: 0,
    }
];

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
    const monthArc = d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .padAngle(0.002); // small gap

    const monthData = months.map((m, i) => i); // 0..11
    const color1 = "#58CD83"; // RGB(88, 205, 131)
    const color2 = "#76A837"; // RGB(118, 168, 55)

    // Each month arc from i..(i+1), all green
    svg.selectAll("path.month-arc")
        .data(monthData)
        .enter()
        .append("path")
        .attr("transform", `translate(${centerX},${centerY})`)
        .attr("fill", (d, i) => (i % 2 === 0 ? color1 : color2)) // Alternating colors
        .attr("d", (d) => {
            const startAngle = monthToAngle(d);
            const endAngle = monthToAngle(d + 1);
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

    // 3) GOLD ARCS for events (startMonth to endMonth inclusive).
    //    We'll overlay them slightly inside the ring, so we see them clearly.
    const eventArc = d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius* 0.98)
        .padAngle(0.002); // small gap

    // Convert startMonth/endMonth to angles
    const eventData = events.map((ev) => {
        const startA = monthToAngle(ev.month);
        const endA = monthToAngle(ev.month + 1);
        return {
            ...ev,
            startAngle: Math.min(startA, endA),
            endAngle: Math.max(startA, endA)
        };
    });

    svg.selectAll("path.event-arc")
        .data(eventData)
        .enter()
        .append("path")
        .attr("transform", `translate(${centerX},${centerY})`)
        .attr("fill", "rgb(246,228,0)") // gold
        .attr("d", (d) =>
            eventArc({
                startAngle: d.startAngle,
                endAngle: d.endAngle
            })
        )    .on("mouseover", (event, d) => {
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
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("transform", (d) => {
            const midAngle = (d.startAngle + d.endAngle) / 2;
            // Position label halfway along the event arc's radial range
            const arcMidRadius = (innerRadius * 0.95 + outerRadius * 0.98) / 2;
            const x = centerX + arcMidRadius * Math.cos(midAngle);
            const y = centerY + arcMidRadius * Math.sin(midAngle);
            const deg = (midAngle * 180) / Math.PI + 90;
            return `translate(${x},${y}) rotate(${deg})`;
        })
        .call(wrap, 80) // 80 pixels max width
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
            <h1>Annual Wheel (D3) - Updated & Polished</h1>
            <p>
                A single green ring for months, gold arcs for events, radial month labels
                around the edge, and centered event labels. Larger inner circle for a more open design.
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