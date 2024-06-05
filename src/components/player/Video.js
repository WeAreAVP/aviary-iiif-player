import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import VideoJS from './VideoJS'
import { videoLoader } from "../../helpers/loaders";
import Login from '../auth/login';

const Video = () => {
  const [service, setService] = useState({});
  const [authToken, setAuthToken] = useState({});
  const [skipAuth, setSkipAuth] = useState(false);

  const carouselID = useSelector(state => state.selectedItem);
    useEffect(() => {
      if(carouselID?.service)
        setService(carouselID?.service[0]);

  }, [carouselID])

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
  console.log('carouselID',carouselID)
  return (service && Object.keys(authToken).length === 0 && skipAuth === false ? <Login service={service} setAuth={setAuthToken} skipAuth={setSkipAuth} /> :
    <div className={carouselID?.format?.includes("audio/") ? "sticky_div" : "" } >
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
