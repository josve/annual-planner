"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@mui/material"; // MUI button (optional)

import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

// ECharts must be dynamically imported to avoid SSR issues
const EChartsReact = dynamic(() => import("echarts-for-react"), { ssr: false });

// Define months in clockwise order, with Jan at index 0
const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Define your events with a startMonth (0-based index), endMonth (inclusive or exclusive), and a label
interface EventData {
    name: string;        // e.g. "Medlemsmöte - Kommunalt program"
    startMonth: number;  // 0 = Jan, 1 = Feb, etc.
    endMonth: number;    // Inclusive index for the last month
}

const events: EventData[] = [
    {
        name: "Medlemsmöte - Kommunalt program",
        startMonth: 0, // January
        endMonth: 2    // March (spans Jan, Feb, Mar)
    },
    {
        name: "Sommarkampanj",
        startMonth: 4, // May
        endMonth: 7    // August
    },
    {
        name: "Höstkonferens",
        startMonth: 9, // October
        endMonth: 10   // November
    }
];

// Helper function to convert a month index (0 to 11) into an angle (in degrees).
// We'll make Jan start at 90° (top). Then each month is 360/12 = 30° steps clockwise.
function monthToAngle(monthIndex: number) {
    // Starting from top (Jan at 90), going clockwise means subtract from 90
    // Each month is 30°, so angle = 90 - 30*month
    return 90 - 30 * monthIndex;
}

export default function Page() {
    const chartRef = useRef<any>(null);

    /**
     * ECharts: We'll build two "series":
     * 1) A "bar" series in the polar coordinate system to provide a green ring background for each month.
     * 2) A custom series that draws gold arcs for each event from startMonth to endMonth.
     */

        // 1) Green ring background: 12 segments, each for a month.
        //    We'll simply create 12 data points with value=1 so they occupy the same radius,
        //    coloring them green. The angle axis will label each month.
    const backgroundSeries = {
            type: "bar",
            coordinateSystem: "polar",
            data: new Array(12).fill(1),
            roundCap: true,
            name: "Year Background",
            itemStyle: {
                color: "#4caf50" // or any green you like
            },
            barCategoryGap: 0, // remove gaps between bars
        };

    // 2) Custom series for gold arcs (events).
    //    Each event is one "data" item. We will draw a single arc from startMonth to endMonth.
    //    ECharts "custom series" requires a `renderItem` function that returns shape definitions.
    const eventSeries = {
        type: "custom",
        coordinateSystem: "polar",
        // Our data = array of events
        data: events.map(e => ({
            ...e,
            // We'll store the midAngle for label positioning
            // (the average angle between startMonth and endMonth)
            midAngle: (monthToAngle(e.startMonth) + monthToAngle(e.endMonth)) / 2
        })),

        renderItem: (params: any, api: any) => {
            // Extract the event data
            const { startMonth, endMonth, name } = api.value(0);

            // Convert start/end months to angles
            const startAngle = monthToAngle(startMonth);
            const endAngle = monthToAngle(endMonth);

            // NOTE: Because we are going clockwise, if the "endAngle" is actually less than
            // the "startAngle", we can swap them or handle it so the arc draws properly.
            const actualStart = Math.min(startAngle, endAngle);
            const actualEnd   = Math.max(startAngle, endAngle);

            // For the "sector" shape in ECharts custom series, we specify:
            //  center, radius, startAngle, endAngle, etc.
            // We'll define a radial band from r0=65% to r=100%, for example,
            // so it sits above the green ring in the same polar coordinate.
            return {
                type: "sector",
                shape: {
                    cx: api.getWidth() / 2,      // center x
                    cy: api.getHeight() / 2,     // center y
                    r0: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65, // inner radius
                    r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.99,  // outer radius
                    startAngle: actualStart,
                    endAngle: actualEnd
                },
                style: {
                    fill: "#FFD700",   // gold color
                    stroke: "#FFD700", // outline color if needed
                }
            };
        },

        label: {
            show: true,
            position: "inside",
            color: "#000", // or "#fff", depending on your preference
            fontSize: 11,
            formatter: (params: any) => {
                return params.data?.name || "";
            },
            // ECharts doesn't do perfect radial text in custom arcs automatically,
            // but we can approximate by rotating the text angle to the arc's midpoint
            align: "center",
            rotate: (params: any) => {
                // midAngle is stored in data, offset a bit for clarity
                const midAngle = params.data.midAngle || 0;
                // For rotation, ECharts expects degrees in normal screen coords
                // but we are in a sense rotating around the center. We'll just return
                // midAngle (since it's already in degrees).
                return -midAngle;
            }
        },
        // This ensures the label is drawn above the sector
        labelLayout: (params: any) => {
            return {
                x: params.rect.width / 2,
                y: params.rect.height / 2
            };
        }
    };

    // Chart option
    const option = {
        // We can give it a title if desired
        title: {
            text: "Circular Timeline",
            left: "center"
        },
        polar: {
            // center and radius can be tweaked as desired
            center: ["50%", "50%"],
            radius: "100%"
        },
        angleAxis: {
            type: "category",
            data: months,
            startAngle: 90,   // Jan at top
            clockwise: true,  // move clockwise
            axisLabel: {
                color: "#000",
                fontSize: 12
            },
            // Hide the circle/ticks, only show labels
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
        },
        radiusAxis: {
            show: false
        },
        tooltip: {
            trigger: "item"
        },
        // We place multiple series:
        // 1) The green ring for the year background
        // 2) The custom arcs for events
        series: [backgroundSeries, eventSeries],
    };

    // Handlers for PDF/PPT export
    const handleExportPDF = () => {
        const instance = chartRef.current?.getEchartsInstance?.();
        if (!instance) return;

        const dataURL = instance.getDataURL({
            type: "png",
            pixelRatio: 2,
            backgroundColor: "#fff"
        });

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4"
        });
        pdf.addImage(dataURL, "PNG", 20, 20, 500, 300);
        pdf.save("annual-wheel.pdf");
    };

    const handleExportPPT = () => {
        const instance = chartRef.current?.getEchartsInstance?.();
        if (!instance) return;

        const dataURL = instance.getDataURL({
            type: "png",
            pixelRatio: 2,
            backgroundColor: "#fff"
        });

        const pptx = new PptxGenJS();
        const slide = pptx.addSlide();
        slide.addImage({
            data: dataURL,
            x: 1,
            y: 1,
            w: 8,
            h: 4
        });
        pptx.writeFile({ fileName: "annual-wheel.pptx" });
    };

    return (
        <main style={{ padding: "20px" }}>
            <h1>Circular Timeline (Annual Wheel)</h1>
            <p style={{ maxWidth: 700 }}>
                A circular timeline with months around the outer edge (January at top),
                green radial background, gold arcs for events, and an empty center.
            </p>

            {/* Chart */}
            <div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
                <EChartsReact
                    ref={chartRef}
                    option={option}
                    style={{ width: "100%", height: 600 }}
                />
            </div>

            {/* Buttons */}
            <div style={{ marginTop: 20, textAlign: "center" }}>
                <Button variant="contained" color="primary" onClick={handleExportPDF} style={{ marginRight: 10 }}>
                    Export to PDF
                </Button>
                <Button variant="contained" color="secondary" onClick={handleExportPPT}>
                    Export to PPT
                </Button>
            </div>
        </main>
    );
}