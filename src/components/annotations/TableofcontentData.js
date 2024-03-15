import React, { useEffect } from "react";
import ReactHtmlParser from 'react-html-parser';
import { getHHMMSSFromSeconds } from '../../helpers/utils'
import moment from 'moment'

const TableofcontentData = (props) => {
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

  const handleTranscriptTextClick = (e,index) => {
    e.preventDefault();
    
    if (player) {
      const video = document.getElementById("item-"+index);
      if(video && video.getAttribute('src') !== player.src())
      {
        player.src({ src: video.getAttribute('src'), type: video.getAttribute('type') });
        player.play();
        player.currentTime(e.currentTarget.getAttribute('starttime'));
      }

      player.currentTime(e.currentTarget.getAttribute('starttime'));
    }
    textRefs.current.map((tr) => {
      if (tr && tr.classList.contains('active')) {
        tr.classList.remove('active');
      }
    });
    e.currentTarget.classList.add('active');
  };
  const handleTranscriptTextEndTimeClick = (e,index) => {
    e.preventDefault();
    
    if (player) {
      const video = document.getElementById("item-"+index);
      if(video && video.getAttribute('src') !== player.src())
      {
        player.src({ src: video.getAttribute('src'), type: video.getAttribute('type') });
        player.play();
        player.currentTime(e.currentTarget.getAttribute('endtime'));
      }
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
        starttime={props.point.starttime} endtime={props.point.endtime}
      >
        <div className="flex flex-col w-full">
          <b className="">{props.point.file}</b>
          <div className="flex">
          <div className="transcript_text w-1/4 italic" style={{ fontWeight: '500', fontSize: '90%' }}>{ReactHtmlParser(props.point.text)}</div>
          <div className="flex flex-col w-3/4 pl-1">
            <div className="flex">
              <div onClick={(e)=>handleTranscriptTextClick(e,props.index)}
              starttime={props.point.starttime} style={{ cursor: 'pointer', fontWeight: '500' }} className="cursor-pointer hover:underline hover:text-blue-800 transcript_time pr-1">
                {moment.utc(props.point.starttime * 1000).format('HH:mm:ss')}
              </div>
              { props.point.endtime ? <span>&#8212;</span> : "" }
              {
                props.point.endtime ? <div onClick={(e)=>handleTranscriptTextEndTimeClick(e,props.index)}
                endtime={props.point.endtime} style={{ cursor: 'pointer', fontWeight: '500' }} className="cursor-pointer hover:underline hover:text-blue-800 transcript_time pl-1">
                  {moment.utc(props.point.endtime * 1000).format('HH:mm:ss')}
                </div> : ''
              }
            </div>
            <div>{props.point?.child && props.point?.child?.length>0 ? 
              props.point?.child.map(function(object, i){
                return (<div className="flex flex-col " key={i}>
                  <div className="inline-flex"><b>{object.text}</b></div>
                  <div className="first flex">
          <div className="transcript_text mr-2 italic"><small>{ReactHtmlParser(props.point.text)}</small></div>

                  <div onClick={(e)=>handleTranscriptTextClick(e,props.index)}
                starttime={object.starttime} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '90%', lineHeight: '28px' }} className="cursor-pointer hover:underline hover:text-blue-800 transcript_time pr-1">
                  {moment.utc(object.starttime * 1000).format('HH:mm:ss')}
                </div>
                { object.endtime ? <span>&#8212;</span> : "" }
                {
                  object.endtime ? <div onClick={(e)=>handleTranscriptTextEndTimeClick(e,props.index)}
                  endtime={object.endtime} style={{ cursor: 'pointer', fontWeight: '500', fontSize: '90%', lineHeight: '28px' }} className="cursor-pointer hover:underline hover:text-blue-800 transcript_time pl-1">
                    {moment.utc(object.endtime * 1000).format('HH:mm:ss')}
                  </div> : ''
                }
                </div>
                  
                  </div>);
              })
              : "" }
            </div>
            
          </div>
        </div>
        </div>
        
        
        
        <hr />
      </div>
    </>
  );
};

export default TableofcontentData;
