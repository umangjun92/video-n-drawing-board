import React, { useRef, useState, useEffect } from "react";

import useDimensions from "../hooks/useDimensions";

export interface WhiteBoardProps {}

const WhiteBoard = ({}: WhiteBoardProps) => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const { height: containerHeight, width: containerWidth } = useDimensions(canvasContainerRef);

    const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current?.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.lineTo(offsetX, offsetY);
        contextRef.current?.stroke();
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
                context.strokeStyle = "black";
                context.lineWidth = 5;
                contextRef.current = context;
            }
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        console.log("containerHeight, ", containerHeight);
        if (canvas) {
            canvas.height = containerHeight * 2;
            canvas.style.height = `${containerHeight}px`;
        }
    }, [containerHeight]);

    useEffect(() => {
        console.log("containerwidth, ", containerWidth);
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = containerWidth * 2;
            canvas.style.width = `${containerWidth - 50}px`;
        }
    }, [containerWidth]);

    return (
        <div ref={canvasContainerRef} style={{ height: "50vh", width: "100%" }}>
            <canvas
                style={{ border: "1px solid grey", margin: "15px" }}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
            />
        </div>
    );
};

export default WhiteBoard;
