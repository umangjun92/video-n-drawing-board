import React from "react";

export interface VideoPlayerProps {
    url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
    return url ? <iframe src={url} height={"200vh"} /> : <div>No Video being currently played in this room</div>;
};

export default VideoPlayer;
