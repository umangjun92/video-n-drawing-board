import React, { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { Operation } from "react-drawing-board/lib/SketchPad";
import DrawingBoard from "react-drawing-board";

import "./App.css";
import WhiteBoard, { WhiteBoardProps } from "./white-board/WhiteBoard";
import { start } from "repl";
import White from "./white-board/White";

let socket: typeof Socket;

export const initiateSocket = (room: string, roomInfo: RoomInfo | null, cb: Function) => {
    socket = io("http://localhost:8000");
    console.log(`Connecting socket...`);
    if (socket && room) {
        socket.emit("join", room);
        cb(null, socket.id);
    }
};
export const onConnected = (cb: Function) => {
    socket.on("connected", (id: string) => {
        cb(null, id);
    });
};
// export const onAskRoomInfo = (roomInfo: RoomInfo | null) => {
//     socket.on("askRoomInfo", (newRoomInfo: RoomInfo | null) => {
//         console.log("askRoomInfo");
//         socket.emit("roomInfoReceived", { ...roomInfo, ...newRoomInfo });
//     });
// };
export const disconnectSocket = (roomId: string) => {
    console.log("Disconnecting socket...");
    if (socket) {
        socket.emit("leave", roomId);
        // socket.close();
    }
};
export const subscribeForRoomInfo = (cb: Function) => {
    if (!socket) return true;
    socket.on("roomUpdated", (roomInfo: RoomInfo) => {
        return cb(null, roomInfo);
    });
};
export const subscribeToChat = (cb: Function) => {
    if (!socket) return true;
    socket.on("chat", (msg: any) => {
        return cb(null, msg);
    });
};

export const sendMessage = (room: string, message: any) => {
    if (socket) {
        socket.emit("chat", { message, room });
    }
};

export const subscribeToStartDrawing = (cb: Function) => {
    if (!socket) return true;
    socket.on("startDrawing", ({ xPos, yPos }: any) => {
        return cb(null, { xPos, yPos });
    });
};

export const subscribeToDrawing = (cb: Function) => {
    if (!socket) return true;
    socket.on("drawing", ({ xPos, yPos }: any) => {
        return cb(null, { xPos, yPos });
    });
};

export const subscribeToFinishDrawing = (cb: Function) => {
    if (!socket) return true;
    socket.on("finishDrawing", (msg: any) => {
        return cb(null, msg);
    });
};

export const dispatchStartDrawing = (roomId: string, xPos: number, yPos: number) => {
    if (socket) {
        socket.emit("startDrawing", { roomId, xPos, yPos });
    }
};

export const sendDrawingStroke = (roomId: string, xPos: number, yPos: number) => {
    if (socket) {
        socket.emit("drawing", { roomId, xPos, yPos });
    }
};

export const dispatchFinishDrawing = (roomId: string) => {
    if (socket) {
        socket.emit("finishDrawing", { roomId });
    }
};

interface RoomInfo {
    roomId: string;
    host: string;
    mode: "video" | "whiteboard";
    videoURL: "string";
    videoPos: number;
    users: string[];
    chat: string[];
}

function App() {
    // const rooms = ["A", "B", "C"];
    const [connectionId, setConnectionId] = useState("");
    const [room, setRoom] = useState(window.location.pathname.slice(1));
    const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<any[]>([]);
    const [operations, setOperations] = useState<Operation[]>([]);
    const [mode, setMode] = useState("v");

    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<WhiteBoardProps["startPos"]>({ x: 0, y: 0 });
    const [pointerPos, setPointerPos] = useState<WhiteBoardProps["pointerPos"]>({ x: 0, y: 0 });

    const initiateSocket = useCallback(
        (room: string, cb: Function) => {
            socket = io("http://localhost:8000");
            console.log(`Connecting socket...`);
            if (socket && room) {
                socket.emit("join", room);
                cb(null, socket.id);
            }
        },
        [roomInfo]
    );

    const startDrawing: WhiteBoardProps["onStartDrawing"] = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        // setPointerPos({ x: offsetX, y: offsetY });
        // setIsDrawing(true);
        dispatchStartDrawing(room, offsetX, offsetY);
    };

    const finishDrawing: WhiteBoardProps["onFinishDrawing"] = () => {
        // setIsDrawing(false);
        dispatchFinishDrawing(room);
    };

    const draw: WhiteBoardProps["onDrawing"] = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { offsetX, offsetY } = nativeEvent;
        // setPointerPos({ x: offsetX, y: offsetY });
        sendDrawingStroke(room, offsetX, offsetY);
    };

    // const subscribeForRoomInfo = useCallback(
    //     (cb: Function) => {
    //         if (!socket) return true;
    //         socket.on("roomUpdated", (newRoomInfo: any) => {
    //             return cb(null, {...roomInfo, ...newRoomInfo});
    //         });
    //     },
    //     [roomInfo]
    // );

    useEffect(() => {
        // setRoom(window.location.pathname.slice(1));
        room && roomInfo && setRoomInfo({ ...roomInfo, roomId: room });
        if (room) initiateSocket(room, (id: string) => setConnectionId(id));

        onConnected((err: any, _connectionId: string) => {
            setConnectionId(_connectionId);
        });
        subscribeToChat((err: any, data: any) => {
            if (err) return;
            setChat((oldChats: any[]) => [data, ...oldChats]);
        });
        subscribeForRoomInfo((err: any, _roomInfo: any) => {
            if (err) return;
            setRoomInfo((state) => {
                return { ...state, ..._roomInfo, roomId: room };
            });
        });
        subscribeToStartDrawing((err: any, { xPos, yPos }: any) => {
            setIsDrawing(true);
            setPointerPos({ x: xPos, y: yPos });
        });
        subscribeToDrawing((err: any, { xPos, yPos }: any) => {
            setPointerPos({ x: xPos, y: yPos });
        });
        subscribeToFinishDrawing((err: any) => {
            setIsDrawing(false);
        });

        // onAskRoomInfo(roomInfo);
        return () => {
            disconnectSocket(room);
        };
    }, [room]);

    useEffect(() => {
        console.log("room info changes", roomInfo);
        const onAskRoomInfo = () => {
            console.log("askRoomInfo", roomInfo);
            socket.emit("roomInfoReceived", roomInfo || { roomId: room });
        };

        socket.on("askRoomInfo", onAskRoomInfo);

        if (roomInfo?.host === connectionId) {
            setMode(roomInfo.mode);
        }

        setChat(roomInfo?.chat || []);

        return () => {
            socket.off("askRoomInfo", onAskRoomInfo);
        };
    }, [roomInfo]);

    useEffect(() => {
        roomInfo && setRoomInfo({ ...roomInfo, chat });
    }, [chat]);

    useEffect(() => {
        if (roomInfo?.host === connectionId) {
        }
    }, [connectionId]);

    useEffect(() => {
        if (roomInfo?.host === connectionId) {
            socket.emit("roomInfoReceived", { ...roomInfo, mode });
        }
    }, [mode]);

    return (
        <div className="App" style={{ height: "100%", padding: "10px" }}>
            <h4>Room: {room}</h4>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <div># of connections: {roomInfo?.users?.length}</div>
                    <div>{roomInfo?.host === connectionId ? "You are the Host" : "You are not the host"}</div>
                </div>
                {roomInfo?.host === connectionId ? (
                    <select onChange={(e) => setMode(e.target.value)} value={mode}>
                        <option value="Video">Video</option>
                        <option value="WhiteBoard">WhiteBoard</option>
                    </select>
                ) : (
                    <div>Current mode: {roomInfo?.mode}</div>
                )}
            </div>
            {/* <h1>Live Chat:</h1> */}
            {/* <input type="text" name="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={() => sendMessage(room, message)}>Send</button> */}
            {/* {chat.map((m: any, i) => (
                <p key={i}>{m}</p>
            ))} */}
            <div style={{ marginTop: "10px" }}>
                <WhiteBoard
                    isDrawing={isDrawing}
                    onStartDrawing={startDrawing}
                    onDrawing={draw}
                    onFinishDrawing={finishDrawing}
                    pointerPos={pointerPos}
                    startPos={startPos}
                />
            </div>
            {/* <White /> */}
            {/* <DrawingBoard
                userId="user1" // identify for different players.
                operations={operations}
                onChange={(newOperation, afterOperation) => {
                    console.log(`TODO: send`, newOperation);
                    setOperations(afterOperation);
                }}
            /> */}
        </div>
    );
}

export default App;
