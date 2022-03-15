import React, { useEffect, useState } from 'react'
import Video from './Video'
import { playerLoader } from '../../helpers/loaders'


const Player = (props) => {
  const [label, setLabel] = useState('');
  const [dataError, setDataError] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    try {
      setLabel(props.data.label?.en);
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
      <div className='video-details'>
        <div>
          <h1 data-testid='resolved'>{label}</h1>
        </div>
      </div>
    </div>
  );
}

export default Player;
