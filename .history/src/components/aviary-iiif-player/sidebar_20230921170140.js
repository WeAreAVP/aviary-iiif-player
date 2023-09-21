import React, { useState, useRef, useEffect } from "react";
import { videoLoader } from "../../helpers/loaders";
import VideoCarousel from "../items/VideoCarousel";
import { getVideos } from "../../helpers/utils";
import Metadata from "../metadata/metadata";
import Transcripts from "../annotations/transcripts";
import queryString from 'query-string';


const Sidebar = (props) => {
  const [opentranscript, setOpenTranscript] = useState(false)
  const [openPlaylist, setOpenPlaylist] = useState(false)
  let parsed = queryString.parse(location.search);

  useEffect(() => {
    try {
      parsed = queryString.parse(location.search);
      console.log('parsed',parsed);
      if (parsed.tab === 'Annotations') {
        setOpenTranscript(true);
        setOpenPlaylist(false);
      }
      else if(parsed.tab === 'Items')
      {
        setOpenTranscript(false)
        setOpenPlaylist(true);
      }
      else
      {
        setOpenTranscript(false);
        setOpenPlaylist(false);
      }
    } catch (err) {
       
    }
  }, [props]);

  const setTag = (tag) => {
    parsed.tag = tag;
    const stringified = queryString.stringify(parsed);
    location.search = stringified;
  }
  
  const open = () => {
    setOpenTranscript(true);
    setOpenPlaylist(false);
    setTag("Annotations")
  }

  const openMeta = () => {
    setOpenTranscript(false);
    setOpenPlaylist(false);
    setTag("Metadata")
  }

  const openPlaylistTab = () => {
    setOpenTranscript(false)
    setOpenPlaylist(true);
    setTag("Items")
  }

  return (
    <div className="h-full px-5">
      <div className="flex tabs-list space-x-5 py-3 px-5 mb-5 border-b">
        <div className={`${!opentranscript && "active"} ${openPlaylist && "not-active"} cursor-pointer`} onClick={openMeta}>Metadata</div>
        <div className={`${opentranscript && "active"} cursor-pointer`} onClick={open}>Annotations</div>
        <div className={`${openPlaylist && "active"} cursor-pointer`} onClick={openPlaylistTab}>Items</div>
      </div>
      {openPlaylist ?
        <VideoCarousel data={props.data} />
        :
        opentranscript ? (
          <Transcripts data={props.data} />
        )
          :
          (
            <Metadata data={props.data} />
          )

      }

    </div>
  );
};

export default Sidebar;
