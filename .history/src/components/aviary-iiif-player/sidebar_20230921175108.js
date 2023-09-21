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
  const parsed = queryString.parse(location.search);

  useEffect(() => {
    console.log('parsed',parsed,parsed.tab,parsed.tab == 'Annotations')
    try {
      if (parsed.tab === 'Annotations') {
        open(0);
      }
      else if(parsed.tab === 'Items')
      {
        openPlaylistTab(0);
      }
      else
      {
        openMeta(0);
      }
    } catch (err) {
       
    }
  }, []);

  const setTag = (tab) => {
    parsed.tab = tab;
    // const stringified = queryString.stringify(parsed);
    // console.log('stringified',stringified)
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set('manifest', parsed.manifest);
    searchParams.set('tab', tab);
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
    window.history.pushState({path: newurl}, '', newurl);
    // location.search = stringified;
  }
  
  const open = (e) => {
    setOpenTranscript(true);
    setOpenPlaylist(false);
    if(e !== 0) setTag("Annotations")
  }

  const openMeta = (e) => {
    setOpenTranscript(false);
    setOpenPlaylist(false);
    if(e !== 0) setTag("Metadata")
  }

  const openPlaylistTab = (e) => {
    setOpenTranscript(false)
    setOpenPlaylist(true);
    if(e !== 0)setTag("Items")
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
