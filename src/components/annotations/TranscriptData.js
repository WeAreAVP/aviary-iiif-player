import React, { useEffect } from "react";
import ReactHtmlParser from 'react-html-parser';
import { getHHMMSSFromSeconds } from '../../helpers/utils'
import moment from 'moment'

const TranscriptData = (props) => {
  let player = null;
  let textRefs = React.useRef([]);

  useEffect(() => {
    const domPlayer = document.getElementById("aviary-iiif-media-player");
    if (!domPlayer) {
      console.error("Cannot find player on page. Transcript synchronization is disabled.");
    } else {
      player = domPlayer.player;
      player.on('timeupdate', function (e) {
        if (e == null || e.target == null) {
          return;
        }
        const currentTime = this.currentTime();
        textRefs.current.map((tr) => {
          if (tr) {
            const start = tr.getAttribute('starttime');
            const end = tr.getAttribute('endtime');
            if (currentTime >= start && currentTime <= end) {
              props.autoScrollAndHighlight(currentTime, tr);
            } else {
              // remove highlight
              tr.classList.remove('active');
            }
          }
        });
      });
    }
    // Clean up state on component unmount
    return () => {
      player = null;
    };
  });

  const handleTranscriptTextClick = (e) => {
    e.preventDefault();
    if (player) {
      player.currentTime(e.currentTarget.getAttribute('starttime'));
    }

    textRefs.current.map((tr) => {
      if (tr && tr.classList.contains('active')) {
        tr.classList.remove('active');
      }
    });
    e.currentTarget.classList.add('active');
  };
  const handleTranscriptTextEndTimeClick = (e) => {
    e.preventDefault();
    if (player) {
      player.currentTime(e.currentTarget.getAttribute('endtime'));
    }

    textRefs.current.map((tr) => {
      if (tr && tr.classList.contains('active')) {
        tr.classList.remove('active');
      }
    });
    e.currentTarget.classList.add('active');
  };

  return (
    <>
      <div
        style={{ padding: '0px 0.5rem 0px 0.5rem' }}
        className="flex space-x-4 hover:bg-gray-50 transcript_item"
        ref={(el) => (textRefs.current[props.index] = el)}
        starttime={props.point.starttime} endtime={props.point.endtime}
      >
        <div>
          {
            props.point.starttime ? <div onClick={handleTranscriptTextClick}
            starttime={props.point.starttime} style={{ cursor: 'pointer', fontWeight: '600' }} className="cursor-pointer hover:underline hover:text-blue-800 w-1/5 transcript_time">
              {moment.utc(props.point.starttime * 1000).format('HH:mm:ss')}
            </div> : ''
          }
          {
            props.point.endtime ? <div onClick={handleTranscriptTextEndTimeClick}
            endtime={props.point.endtime} style={{ cursor: 'pointer', fontWeight: '600' }} className="cursor-pointer hover:underline hover:text-blue-800 w-1/5 transcript_time">
              {moment.utc(props.point.endtime * 1000).format('HH:mm:ss')}
            </div> : ''
          }
          
        </div>
        <div className="w-4/5 transcript_text">{ReactHtmlParser(props.point.text)}
        <div>{props.point?.child && props.point?.child?.length>0 ? 
        props.point?.child.map(function(object, i){
          return (<div className="flex border-b-2" key={i}>
          <div className="first">
          {
            object.starttime ? <div onClick={handleTranscriptTextClick}
            starttime={object.starttime} style={{ cursor: 'pointer', fontWeight: '600' }} className="cursor-pointer hover:underline hover:text-blue-800 w-1/5 transcript_time">
              {moment.utc(object.starttime * 1000).format('HH:mm:ss')}
            </div> : ''
          }
          {
            object.endtime ? <div onClick={handleTranscriptTextEndTimeClick}
            endtime={object.endtime} style={{ cursor: 'pointer', fontWeight: '600' }} className="cursor-pointer hover:underline hover:text-blue-800 w-1/5 transcript_time">
              {moment.utc(object.endtime * 1000).format('HH:mm:ss')}
            </div> : ''
          }
          </div>
            <div className="inline-flex ml-2">{object.text}</div>
            
            </div>);
        })
        : "" }</div>
        </div>
        
        <hr />
      </div>
    </>
  );
};

export default TranscriptData;
