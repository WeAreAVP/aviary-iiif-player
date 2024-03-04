import React, { useEffect, useState } from 'react'
import Video from './Video'
import { playerLoader } from '../../helpers/loaders'
import queryString from 'query-string';
import VideoCarousel from "../items/VideoCarousel";
import { Tooltip } from 'react-tooltip'

const Player = (props) => {
  const [label, setLabel] = useState('');
  const [dataError, setDataError] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const parsed = queryString.parse(location.search);

  useEffect(() => {
    try {
      setLabel(props.label);
      setIsFetching(false);
    } catch (err) {
      setDataError(true)
      setIsFetching(false)
    }
  }, [props]);

  if (isFetching) return playerLoader();
  if (dataError) return <span>Annotation structure is not correct</span>;

  return (
    <div className="">
      <Video />
      <Tooltip id="my-tooltip" offset="5"/>
      <div className='video-details'>
        <div>
          <h1 data-testid='resolved'>{label}</h1>
        </div>
      </div>
      {parsed.items !== 'false' && props.data.items && props.data.items.length > 0 ? <VideoCarousel data={props.data} /> : "" }
    </div>
  );
}

export default Player;
