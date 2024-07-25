import React, { useRef, useEffect, useState } from 'react';
import dashjs from 'dashjs';

export const DashPlayer = ({ url, carouselID }) => {

    const videoRef = useRef(null);
    const [mediaType, setMediaType] = useState(null);

    useEffect(() => {
        const player = dashjs.MediaPlayer().create();
    
        // Custom XHR loader to set withCredentials
        player.setXHRWithCredentialsForType("MPD", true);
        setMediaType(carouselID.type)
    
        player.initialize(videoRef.current, url, true);
    
        return () => {
          player.reset();
        };
      }, [url]);

    
    return (
        <div>
            <video className={mediaType === "Audio" ?  "dash-js video-js vjs-big-play-centered w-full dash-js-audio" : "dash-js video-js vjs-big-play-centered w-full dash-js-video" } ref={videoRef} controls autoPlay />
        </div>
    );
};

export default DashPlayer;
