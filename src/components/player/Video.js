import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import VideoJS from './VideoJS'
import { videoLoader } from "../../helpers/loaders";


const Video = () => {

  const carouselID = useSelector(state => state.selectedItem);
  const [isRange, setIsRange] = useState(false);
  const videoJsOptions = {
    autoplay: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    controls: true,
    responsive: true,
    aspectRatio: '16:9',
    youtube: { autohide: 1, autoplay: false },
    poster: carouselID?.poster,
    sources: [{
      src: carouselID?.id,
      type: 'video/mp4'
    }]
  };

  if (carouselID?.format?.includes("audio/")) {
    videoJsOptions.aspectRatio = '1:0';
    videoJsOptions.controlBar = {
      "fullscreenToggle": false,
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = carouselID.format
    videoJsOptions.inactivityTimeout = 0;
  } else if (carouselID?.format?.includes("youtube")) {
    videoJsOptions.controlBar = {
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = 'video/youtube';
  } else if (carouselID?.format?.includes("vimeo")) {
    videoJsOptions.controlBar = {
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = 'video/vimeo'
  } else if (carouselID?.format?.includes("application")) {
    videoJsOptions.sources[0].type = carouselID?.format
  }
  else {
    videoJsOptions.sources[0].type = carouselID?.format
  }

  useEffect(() => {
    const url = carouselID.id; // Replace with the URL of the file you want to check
    console.log('url',url)
    // Ensure the URL is properly formatted
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.error('Invalid URL format. URL should start with "http://" or "https://".');
      return;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Range': 'bytes=0-999'
      }
    })
    .then(response => {
      if (response.status === 206) {
        const contentRange = response.headers.get('Content-Range');
        if (contentRange) {
          console.log('Byte-range request supported:', contentRange);
        } else {
          console.log('Byte-range request not supported: Content-Range header missing.');
        }
      } else {
        console.log(`Byte-range request not supported: Server responded with status ${response.status}`);
        setIsRange(true)
      }
    })
    .catch(error => {
      console.error('Error making byte-range request:', error.message);
    });

  }, []);

console.log('carouselID',carouselID)
  return (
    <div className={carouselID?.format?.includes("audio/") ? "sticky_div" : "" } >
      {isRange ? <div className="text-danger">Byte-range request not supported</div> : ""}
      <div key={carouselID?.id}>
        {carouselID?.id ? (
          <VideoJS options={videoJsOptions} />
        ) : (
          <div className=""><h5 className="pl-4">No Media Found</h5></div>
        )}
      </div>
    </div>
  );
};

export default Video;
