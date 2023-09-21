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
        style={{ marginTop: '1.25rem', padding: '0.5rem' }}
        className="flex space-x-4 p-2 hover:bg-gray-50 transcript_item"
        ref={(el) => (textRefs.current[props.index] = el)}
      >
        <span onClick={handleTranscriptTextClick}
        starttime={props.point.starttime} style={{ cursor: 'pointer', fontWeight: '600' }} className="cursor-pointer hover:underline hover:text-blue-800 w-1/4 transcript_time">
          {moment.utc(props.point.starttime * 1000).format('HH:mm:ss')}
        </span>
        <span onClick={handleTranscriptTextEndTimeClick}
        endtime={props.point.endtime} style={{ cursor: 'pointer', fontWeight: '600' }} className="cursor-pointer hover:underline hover:text-blue-800 w-1/4 transcript_time">
          {moment.utc(props.point.endtime * 1000).format('HH:mm:ss')}
        </span>
        <div className="w-3/4 transcript_text">{ReactHtmlParser(props.point.text)}</div>
        <hr />
      </div>
    </>
  );
};

export default TranscriptData;
