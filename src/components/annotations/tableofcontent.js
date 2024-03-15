import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableofcontentData from "./TableofcontentData";
import { descLoader } from '../../helpers/loaders'

import { getStructures } from "../../helpers/utils";

import Search from "./menu/search";
import Select from 'react-select';
import axios from 'axios';

const Tableofcontent = (props) => {
    const selectStyles = {
        control: (base) => ({
          ...base,
          padding: '6px 5px',
          maxHeight: '75px',
          minHeight: '45px',
          overflow: 'auto',
      }),
     
    }
    const selectedVideo = useSelector(state => state.selectedItem);
    const [dataError, setDataError] = useState(false)
    const [structures, setStructures] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const transcriptContainerRef = React.useRef(null);
    const [searchWords, setSearchWords] = useState([]);
    let isMouseOver = false;
    const isMouseOverRef = React.useRef(isMouseOver);
    const [transcriptPoints, selectTranscriptPoints] = useState([])
    const [transcriptText, setTranscriptText] = useState("")
    const setIsMouseOver = (state) => {
        isMouseOverRef.current = state;
        isMouseOver = state;
    };

    useEffect(() => {
        const promiseThen = new Promise((resolve, reject) => {
            try {
                let itemNo = selectedVideo?.videoCount ? parseInt(selectedVideo?.videoCount.replace('item-', '')) : 0;
                let data = getStructures(props.data, itemNo);
                setTimeout(() => {
                    resolve(data);
                }, 2000);
            } catch (err) {
                console.log(err)
            }
        });
        promiseThen
            .then((val) => {
                setStructures(val);
                processTranscripts(val)
                setIsFetching(false);
            })
            .catch((err) => {
                console.log(err)
                setDataError(true)
                setIsFetching(false);
            });



    }, [props, selectedVideo]);

    const processTranscripts = async (val) => {
        let ann = JSON.parse(JSON.stringify(val));
        let transcripts = []
        ann.map(async (item,i) => {
            if(item && item.transcript){
                item.transcript.map( (transcript,i) => { item.transcript[i].text = `${item.transcript[i].text}` } )
                transcripts = transcripts.concat(item.transcript)
            }
            if(item && item.kind && item.kind == "text"){
                const response = await axios.get(item.src);
                setTranscriptText(response.data)
            }
        })        
        // let arrObj = transcripts.sort((a, b) => (parseFloat(a.starttime) > parseFloat(b.starttime)) ? 1 : -1)
        selectTranscriptPoints(transcripts)
    }

    const autoScrollAndHighlight = (currentTime, tr) => {
        if (!tr) {
            return;
        }

        // Highlight clicked/current time's transcript text
        let textTopOffset = 0;
        const start = tr.getAttribute('starttime');
        const end = tr.getAttribute('endtime');
        if (!start || !end) {
            return;
        }
        if (currentTime >= start && currentTime <= end && transcriptContainerRef.current.classList.contains('autoscroll')) {
            tr.classList.add('active');
            textTopOffset = tr.offsetTop;
        } else {
            tr.classList.remove('active');
        }

        if (isMouseOverRef.current) {
            return;
        }

        // Auto scroll the transcript
        if (transcriptContainerRef.current.classList.contains('autoscroll')) {
            let parentTopOffset = transcriptContainerRef.current.offsetTop;
            transcriptContainerRef.current.scrollTo({
                top: textTopOffset - parentTopOffset,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseOver = (state) => {
        setIsMouseOver(state);
    };

    useEffect(() => {
        // Clean up state on component unmount
        return () => {
            isMouseOver = false;
        };
    }, []);


    if (isFetching) return descLoader();
    if (dataError) return <span>Annotation structure is not correct</span>;
    if (structures.length <= 0) return <span id="no_annotation">No Table of Contents available for this file.</span>;
    
    return (
        <div>
            <Search setTokens={setSearchWords} tokens={searchWords} annotation={transcriptPoints} placeholder={"Search this TOC"}/>
            <div className="" onMouseOver={() => handleMouseOver(true)} onMouseLeave={() => handleMouseOver(false)}>
                <div className="mt-3">
                    {structures.map((point) => {
                        return <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-gray-700 bg-gray-200 rounded ml-1"  data-tooltip-id="my-tooltip" data-tooltip-content={point.label}>{point.label}</span>
                    }
                    )}
                        
                </div>
                
                <div className="custom-height scroll overflow-x-hidden overflow-y-auto mt-2 bg-white rounded-sm p-2" id="transcript_data" ref={transcriptContainerRef}>
                    <>
                        {transcriptPoints.map((point, index) => {
                            return <TableofcontentData point={point} index={index} autoScrollAndHighlight={autoScrollAndHighlight} key={index} searchWords={searchWords} />
                        }
                        )}
                        {transcriptText ? transcriptText : ''}
                    </>
                </div>
            </div>
        </div>

    );
};

export default Tableofcontent;