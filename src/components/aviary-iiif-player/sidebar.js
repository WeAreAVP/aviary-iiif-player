import React, { useState, useRef, useEffect } from "react";
import { videoLoader } from "../../helpers/loaders";
import VideoCarousel from "../items/VideoCarousel";
import { getVideos } from "../../helpers/utils";
import Metadata from "../metadata/metadata";
import Transcripts from "../annotations/transcripts";
import Tableofcontent from "../annotations/tableofcontent";
import queryString from 'query-string';


const Sidebar = (props) => {
  const [openmetadata, setOpenMetaData] = useState(true)
  const [opentranscriptdata, setOpenTranscriptData] = useState(true)
  const [opentocdata, setOpenTOCData] = useState(true)

  const [opentranscript, setOpenTranscript] = useState(false)
  const [openTOC, setOpenTOC] = useState(false)

  const parsed = queryString.parse(location.search);

  useEffect(() => {
    try {

      if (parsed.tab === 'Annotations') {
        open(0);
      }
      else if(parsed.tab === 'TOC')
      {
        openTOCTab(0);
      }
      else
      {
        if(parsed.metadata !== 'false') openMeta(0); 
      }

      if(parsed.metadata === 'false')
      {
        if(parsed.annotations !== 'false') open(0);
        if(parsed.annotations === 'false' && parsed.items !== 'false') openTOCTab(0);
        setOpenMetaData(false)
      }
      if(parsed.annotations === 'false')
      {
        if(parsed.metadata !== 'false') openMeta(0);
        if(parsed.metadata === 'false' && parsed.items !== 'false') openTOCTab(0);
        setOpenTranscriptData(false)
      }
      if(parsed.toc === 'false')
      {
        if(parsed.metadata !== 'false') openMeta(0); 
        if(parsed.metadata === 'false' && parsed.annotations !== 'false') open(0); 
        setOpenTOCData(false)
      }
      

    } catch (err) {
       
    }
  }, []);

  const setTag = (tab) => {
    parsed.tab = tab;
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set('manifest', parsed.manifest);
    searchParams.set('tab', tab);
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
    window.history.pushState({path: newurl}, '', newurl);
  }
  
  const open = (e) => {
    setOpenTranscript(true);
    setOpenTOC(false);
    if(e !== 0) setTag("Annotations")
  }

  const openMeta = (e) => {
    setOpenTranscript(false);
    setOpenTOC(false);

    if(e !== 0) setTag("Metadata")
  }
  const openTOCTab = (e) => {
    setOpenTranscript(false)
    setOpenTOC(true);
    if(e !== 0)setTag("TOC")
  }

  return (
   
    <div className="h-full px-5">
      <div className="flex tabs-list space-x-5 py-3 px-5 mb-5 border-b">
        {openmetadata ? (<div className={`${(!opentranscript && !openTOC)&& "active"} cursor-pointer`} onClick={openMeta}>Metadata</div>) : '' }
        {opentocdata ? (<div className={`${openTOC && "active"} cursor-pointer`} onClick={openTOCTab}>Table of Contents</div>) : '' }
        {opentranscriptdata ? (<div className={`${ (!openmetadata || opentranscript) && "active"} cursor-pointer`} onClick={open}>Annotations</div>) : '' }
      </div>
      { openTOC ? (
          <Tableofcontent data={props.data} />
        )
        :
        opentranscript ? (
          <Transcripts data={props.data} />
        )
        :
        openmetadata ? 
        (
          <Metadata data={props.data} />
        )
        :
        ""
      }

    </div>
  );
};

export default Sidebar;
