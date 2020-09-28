import React, { useState, useEffect } from "react";
import VideoSelection, { VideoSelectionProps } from "./VideoSelection";
import VideoPlayer from "./VideoPlayer";

export interface VideoScreenProps {
    onSelectVideo: (url: string) => void;
    selectedVideoUrl: string;
    isHost: boolean;
    videoMode: "selection" | "player";
    onClickBackToSelection: () => void;
}

const VideoScreen = ({
    onSelectVideo,
    selectedVideoUrl,
    isHost,
    videoMode,
    onClickBackToSelection
}: VideoScreenProps) => {
    // const [mode, setMode] = useState<"selection" | "player">("selection");

    // useEffect(() => {
    //     selectedVideoUrl && setMode("player");
    // }, [selectedVideoUrl]);

    return videoMode === "selection" && isHost ? (
        <VideoSelection onSelectVideo={onSelectVideo} />
    ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <button
                onClick={onClickBackToSelection}
                style={{ width: "fit-content", marginBottom: "10px" }}
                hidden={!isHost}
            >
                {"< Back to Video Selection"}
            </button>
            <VideoPlayer url={selectedVideoUrl} />
        </div>
    );
};

export default VideoScreen;
