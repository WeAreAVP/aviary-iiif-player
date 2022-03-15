import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactHtmlParser from 'react-html-parser';
import { isType, getHHMMSSFromSeconds } from '../../helpers/utils'

const TranscriptData = (props) => {

  const dispatch = useDispatch();
  let player = null;
  let textRefs = React.useRef([]);

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

  React.useEffect(() => {
    const domPlayer = document.getElementById("aviary-iiif-media-player");
    if (!domPlayer) {
      console.error( "Cannot find player on page. Transcript synchronization is disabled.");
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
  }, []);


  return (
    <>
      <div
        style={{ marginTop: '1.25rem', padding: '0.5rem' }}
        className="flex space-x-4 p-2 hover:bg-gray-200 transcript_item"
        onClick={handleTranscriptTextClick}
        starttime={props.point.starttime}
        endtime={props.point.endtime}
        ref={(el) => (textRefs.current[props.index] = el)}
      >
        <span style={{ cursor: 'pointer', fontWeight: '600' }} className="cursor-pointer hover:underline hover:text-blue-800 w-1/4 transcript_time">
          {getHHMMSSFromSeconds(props.point.starttime)}
        </span>
        <div className="w-3/4 transcript_text">{ReactHtmlParser(props.point.text)}</div>
        <hr />
      </div>
    </>
  );
};

export default TranscriptData;