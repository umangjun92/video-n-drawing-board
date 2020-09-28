import React, { useRef, useState, useEffect } from "react";

import useDimensions from "../hooks/useDimensions";

export interface WhiteBoardProps {
    isDrawing: boolean;
    onStartDrawing: ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onDrawing: ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onFinishDrawing: () => void;
    startPos: { x: number; y: number };
    pointerPos: { x: number; y: number };
}

const WhiteBoard = ({
    isDrawing,
    onStartDrawing,
    onDrawing,
    onFinishDrawing,
    startPos,
    pointerPos
}: WhiteBoardProps) => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const { height: containerHeight, width: containerWidth } = useDimensions(canvasContainerRef);

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
                context.strokeStyle = "red";
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
            canvas.height = containerHeight * 2;
            canvas.style.height = `${containerHeight}px`;
            canvas.width = containerWidth * 2;
            canvas.style.width = `${containerWidth}px`;
            const context = canvas.getContext("2d");
            if (context) {
                context.scale(2, 2);
                context.lineCap = "round";
                context.strokeStyle = "red";
                context.lineWidth = 5;
                contextRef.current = context;
            }
        }
    }, [containerHeight, containerWidth]);

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
        <div ref={canvasContainerRef} style={{ height: "50vh", width: "100%" }}>
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
    );
};

export default WhiteBoard;
