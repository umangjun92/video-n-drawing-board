import React, { useRef, useState, useEffect } from "react";

import useDimensions from "../hooks/useDimensions";

const Colors = ["red", "blue", "green", "yellow", "black"];

export interface WhiteBoardProps {
    isDrawing: boolean;
    onStartDrawing: ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onDrawing: ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onFinishDrawing: () => void;
    startPos: { x: number; y: number };
    pointerPos: { x: number; y: number };
    onColorChange: (color: string) => void;
    color: string;
}

const WhiteBoard = ({
    isDrawing,
    onStartDrawing,
    onDrawing,
    onFinishDrawing,
    startPos,
    pointerPos,
    color,
    onColorChange
}: WhiteBoardProps) => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const { height: containerHeight, width: containerWidth } = useDimensions(canvasContainerRef);

    const _onColorChange = (e: React.MouseEvent) => {
        // console.log("color", (e.target as HTMLElement).style.backgroundColor);
        onColorChange((e.target as HTMLElement).style.backgroundColor);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            // canvas.width = window.innerWidth * 2;
            // canvas.height = window.innerHeight * 2;
            // canvas.style.width = `${window.innerWidth}px`;
            // canvas.style.height = `${window.innerHeight}px`;
            const context = canvas.getContext("2d");
            if (context) {
                context.scale(2, 2);
                context.lineCap = "round";
                context.strokeStyle = color;
                context.lineWidth = 5;
                contextRef.current = context;
            }
        }
    }, [canvasRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        console.log("containerHeight, ", containerHeight);
        console.log("containerwidth, ", containerWidth);
        if (canvas) {
            canvas.height = containerHeight /* * 2 */;
            canvas.style.height = `${containerHeight}px`;
            canvas.width = containerWidth /* * 2 */;
            canvas.style.width = `${containerWidth}px`;
            const context = canvas.getContext("2d");
            if (context) {
                // context.scale(2, 2);
                context.canvas.width = containerWidth;
                context.canvas.height = containerHeight;
                context.lineCap = "round";
                context.strokeStyle = color;
                context.lineWidth = 5;
                contextRef.current = context;
            }
        }
    }, [containerHeight, containerWidth]);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
        }
    }, [color]);

    useEffect(() => {
        if (contextRef.current) {
            if (isDrawing) {
                contextRef.current.beginPath();
                const { x, y } = pointerPos;
                contextRef.current.moveTo(x, y);
            } else {
                contextRef.current.closePath();
                return;
            }
        }
    }, [isDrawing]);

    useEffect(() => {
        if (contextRef.current && isDrawing) {
            const { x, y } = pointerPos;
            contextRef.current.lineTo(x, y);
            contextRef.current.stroke();
        }
    }, [pointerPos]);

    return (
        <div style={{ display: "flex" }}>
            <div ref={canvasContainerRef} style={{ height: "50vh", width: "calc(100% - 30px)" }}>
                <canvas
                    // height={containerHeight * 2}
                    // width={containerWidth * 2}
                    style={{
                        border: "1px solid grey"
                        // margin: "15px"
                        // height: "400px",
                        // width: "400px"
                        // height: `${containerHeight}px`,
                        // width: `${containerWidth - 50}px`
                    }}
                    onMouseDown={onStartDrawing}
                    onMouseUp={onFinishDrawing}
                    onMouseMove={onDrawing}
                    ref={canvasRef}
                />
            </div>
            <div style={{ marginLeft: "15px" }}>
                {Colors.map((c) => (
                    <div
                        key={c}
                        onClick={_onColorChange}
                        style={{
                            backgroundColor: c,
                            cursor: "pointer",
                            width: "15px",
                            height: "15px",
                            marginBottom: "5px",
                            border: c === color ? "1px solid black" : "none"
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default WhiteBoard;
