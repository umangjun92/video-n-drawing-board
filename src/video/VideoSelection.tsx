import React from "react";

const videos = ["tgbNymZ7vqY", "W7qWa52k-nE", "B1E7h3SeMDk"];

export interface VideoSelectionProps {
    onSelectVideo: (url: string) => void;
}

const VideoSelection = ({ onSelectVideo }: VideoSelectionProps) => {
    const onClickVideo = (videoId: string) => {
        onSelectVideo(`https://www.youtube.com/embed/${videoId}`);
    };
    return (
        <div>
            {videos.map((videoId, i) => (
                <img
                    key={i}
                    style={{ cursor: "pointer" }}
                    src={`http://img.youtube.com/vi/${videoId}/0.jpg`}
                    // src={videoId}
                    onClick={(e) => {
                        onClickVideo(videoId);
                    }}
                />
            ))}
        </div>
    );
};

export default VideoSelection;
