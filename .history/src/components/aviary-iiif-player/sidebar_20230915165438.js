import React, { useState, useRef, useEffect } from "react";
import { videoLoader } from "../../helpers/loaders";
import VideoCarousel from "../items/VideoCarousel";
import { getVideos } from "../../helpers/utils";
import Metadata from "../metadata/metadata";
import Transcripts from "../annotations/transcripts";


const Sidebar = (props) => {
  const [opentranscript, setOpenTranscript] = useState(false)
  const [openPlaylist, setOpenPlaylist] = useState(false)

  const open = () => {
    setOpenTranscript(true);
    setOpenPlaylist(false);

  }

  const openMeta = () => {
    setOpenTranscript(false);
    setOpenPlaylist(false);
  }

  const openPlaylistTab = () => {
    setOpenTranscript(false)
    setOpenPlaylist(true);
  }
  
  return (
    <div className="h-full px-5">
      <div className="flex tabs-list space-x-5 py-3 px-5 mb-5 border-b">
        <div className={`${!opentranscript && "active"} ${openPlaylist && "not-active"} cursor-pointer`} onClick={openMeta}>Metadata</div>
        <div className={`${opentranscript && "active"} cursor-pointer`} onClick={open}>Annotations here</div>
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
