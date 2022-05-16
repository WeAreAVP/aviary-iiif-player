import React, { useEffect, useState } from 'react'
import File from "./File";
import { videoLoader } from "../../helpers/loaders";
import { getVideos } from '../../helpers/utils';

const VideoCarousel = (props) => {
  const [videos, setVideos] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    try {
      setVideos(getVideos(props.data));
      setIsFetching(false);
    } catch (err) {
      console.log(err)
      setDataError(true);
      setIsFetching(false);
    }
  }, [props]);

  if (isFetching) return videoLoader();
  if (dataError) return <span>Structure is not correct</span>;
  if (videos.length <= 0) return <span>No media item available.</span>;
  
  return (
    <div className="custom-height-playlist">
      {
        videos.map((video) => (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }} className="list flex items-center space-x-2" key={"video-"+video.videoCount}>
            <File {...video} key={"video-" + video.videoCount} />
          </div>
        ))
      }
    </div>

  );
};

export default VideoCarousel;