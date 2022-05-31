import React from "react";
import { useSelector } from "react-redux";
import VideoJS from './VideoJS'
import { videoLoader } from "../../helpers/loaders";


const Video = () => {

  const carouselID = useSelector(state => state.selectedItem);
  const videoJsOptions = {
      autoplay: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      controls: true,
      responsive: true,
      aspectRatio: '16:9',
      youtube: { autohide: 1 , autoplay: false },
      poster: carouselID?.poster,
      sources: [{
        src: carouselID?.id,
        type: 'video/mp4'
      }]
    };
    
  if(carouselID?.format.includes("audio/")){
    // videoJsOptions.aspectRatio = '1:0';
    videoJsOptions.controlBar = {
      "fullscreenToggle": false,
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = 'audio/mp4'
    videoJsOptions.inactivityTimeout = 0;
  } else if(carouselID?.format.includes("youtube")){
    videoJsOptions.controlBar = {
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = 'video/youtube';
  } else if(carouselID?.format.includes("vimeo")){
    videoJsOptions.controlBar = {
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = 'video/vimeo'
  }

  return (
    <div className="">
      <div key={carouselID?.id}>
        {carouselID?.id ? (
              <VideoJS options={videoJsOptions} />
        ) : (
          <div className="videoLoader">{videoLoader()}</div>
        )}
      </div>
    </div>
  );
};


export default Video;