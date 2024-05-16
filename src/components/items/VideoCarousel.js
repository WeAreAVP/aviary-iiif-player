import React, { useEffect, useState } from 'react'
import File from "./File";
import { videoLoader } from "../../helpers/loaders";
import { getVideos } from '../../helpers/utils';
import Slider from "react-slick";

const VideoCarousel = (props) => {
  const [videos, setVideos] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1
  };
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
    <>
    {videos.length > 1 ?  <div className='slider-cover'>
      <div className='heading-div'> 
        <h3>Contents</h3>
        <h5>Viewing {updateCount + 1} of {videos.length}</h5>
        </div>
        <div className="slider-container">

        <Slider {...settings}>
          {
            videos.map((video,index) => (
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }} className="list flex items-center space-x-2" key={"video-" + video.videoCount} onClick={()=>setUpdateCount(index)}>
                <File {...video} key={"video-" + video.videoCount} />
              </div>
            ))
          }
          </Slider>
      </div>
      </div> : ""}
    
    </>
    

  );
};

export default VideoCarousel;