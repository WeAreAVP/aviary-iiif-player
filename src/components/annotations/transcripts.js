import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TranscriptData from "./TranscriptData";
import { descLoader } from '../../helpers/loaders'
import { getTranscripts, parseAnnotation } from "../../helpers/utils";
import Search from "./menu/search";

const Transcripts = (props) => {
    const selectedVideo = useSelector(state => state.selectedItem);
    const [dataError, setDataError] = useState(false)
    const [transcript, selectTranscript] = useState('1');
    const [annotations, setAnnotations] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const transcriptContainerRef = React.useRef(null);
    const [searchWords, setSearchWords] = useState([])
    let isMouseOver = false;
    const isMouseOverRef = React.useRef(isMouseOver);
    const setIsMouseOver = (state) => {
        isMouseOverRef.current = state;
        isMouseOver = state;
    };
    let textToHightlight = React.useRef("");

    useEffect(() => {
        try {
            var itemNo = selectedVideo?.videoCount ? parseInt(selectedVideo?.videoCount.replace('item-', '')) : 0;
            setAnnotations(getTranscripts(props.data, itemNo));
            setIsFetching(false);
        } catch (err) {
            console.log(err)
            setDataError(true)
            setIsFetching(false);
        }
    }, [props, selectedVideo]);

    const handleSelectTranscript = (e) => selectTranscript(e.target.value);

    const handleAutoScroll = (e) => {
        if (e.target.checked) {
            transcriptContainerRef.current.classList.add('autoscroll');
        } else {
            transcriptContainerRef.current.classList.remove('autoscroll');
        }
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

    useEffect(() => {
        if(transcriptContainerRef.current != null){
            // console.log(transcriptContainerRef.current.textContent);
            textToHightlight.current = transcriptContainerRef.current;
        }
    })


    if (isFetching) return descLoader();
    if (dataError) return <span>Annotation structure is not correct</span>;
    if (annotations.length <= 0) return <span>No annotation available for this file.</span>;

    return (
        <div>
            <Search setTokens={setSearchWords} tokens={searchWords} textToHightlight={textToHightlight.current}/>
            <div className="" onMouseOver={() => handleMouseOver(true)} onMouseLeave={() => handleMouseOver(false)}>
                <label><input type="checkbox" value="1" onChange={handleAutoScroll} /> Auto Scroll with Media</label>
                <div className="custom-select">
                    <label for="annotation">Annotation Sets</label>
                    <select className="px-4 pt-4 pb-3 border w-full rounded-md" value={transcript} onChange={handleSelectTranscript}>
                        {annotations.map((e, key) => {
                            return <option key={key} value={key + 1}>{e.label}</option>;
                        })}
                    </select>
                </div>
                <div className="custom-height scroll overflow-x-hidden overflow-y-auto mt-2 bg-white rounded-sm p-2" id="transcript_data" ref={transcriptContainerRef}>
                    <>
                        {annotations[parseInt(transcript) - 1].transcript.map((point, index) => {
                            return <TranscriptData point={point} index={index} autoScrollAndHighlight={autoScrollAndHighlight} key={index} searchWords={searchWords} />
                        }
                        )}
                    </>
                </div>
            </div>
        </div>

    );
};

export default Transcripts;