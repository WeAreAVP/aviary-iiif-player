import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TranscriptData from "./TranscriptData";
import { descLoader } from '../../helpers/loaders'
import { getTranscripts } from "../../helpers/utils";
import Search from "./menu/search";
import Select from 'react-select';

const Transcripts = (props) => {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
      ];
    const [selectedOption, setSelectedOption] = useState(null);

    const selectedVideo = useSelector(state => state.selectedItem);
    const [dataError, setDataError] = useState(false)
    const [transcript, selectTranscript] = useState(['1']);
    const [annotations, setAnnotations] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const transcriptContainerRef = React.useRef(null);
    const [searchWords, setSearchWords] = useState([]);
    let isMouseOver = false;
    const isMouseOverRef = React.useRef(isMouseOver);
    const [transcriptNames, selectTranscriptNames] = useState([])
    const [transcriptPoints, selectTranscriptPoints] = useState([])
    const [tagsColors] = useState(['#A2849A','#C6A5AC','#DC9A83','#E1BE90','#CED1AB'])
    const setIsMouseOver = (state) => {
        isMouseOverRef.current = state;
        isMouseOver = state;
    };

    useEffect(() => {
        const promiseThen = new Promise((resolve, reject) => {
            try {
                let itemNo = selectedVideo?.videoCount ? parseInt(selectedVideo?.videoCount.replace('item-', '')) : 0;
                let data = getTranscripts(props.data, itemNo);
                setTimeout(() => {
                    resolve(data);
                }, 2000);
            } catch (err) {
                console.log(err)
            }
        });
        promiseThen
            .then((val) => {
                setAnnotations(val);
                processTranscripts(['1'],val)
                setIsFetching(false);
            })
            .catch((err) => {
                console.log(err)
                setDataError(true)
                setIsFetching(false);
            });

    }, [props, selectedVideo]);

    const processTranscripts = (ids,val) => {
        let ann = JSON.parse(JSON.stringify(val));
        let names = [];
        let transcripts = []
        for (let key in ids) {
            let colorCode = transcriptColor(key);
            let item = ann[parseInt(ids[key]) - 1]
            item.transcript.map( (transcript,i) => { item.transcript[i].text = `${item.transcript[i].text}<div class="text-right"><span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-gray-700 bg-gray-200 rounded" style="background-color:${colorCode}">${item.label}</span></div>` } )
            console.log('item',item)
            transcripts = transcripts.concat(item.transcript)
            names.push([colorCode,item.label])
        }
        let arrObj = transcripts.sort((a, b) => (parseFloat(a.starttime) > parseFloat(b.starttime)) ? 1 : -1)
        selectTranscriptNames(names)
        selectTranscriptPoints(arrObj)
        console.log('processTranscripts',transcripts,arrObj)

    }

    const transcriptColor = (id) => {
        let val = parseInt(id)%5;
        return tagsColors[val];
    }

    const handleSelectTranscript = (e) => {
        let ids = transcript
        if(ids.includes(e.target.value))
        {
            ids.splice(ids.indexOf(e.target.value), 1); 
        }
        else
        {
            ids.push(e.target.value);
        }
        selectTranscript(ids);   
        processTranscripts(ids,annotations);
    }

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


    if (isFetching) return descLoader();
    if (dataError) return <span>Annotation structure is not correct</span>;
    if (annotations.length <= 0) return <span>No annotation available for this file.</span>;
    
    return (
        <div>
            <Search setTokens={setSearchWords} tokens={searchWords} />
            <div className="" onMouseOver={() => handleMouseOver(true)} onMouseLeave={() => handleMouseOver(false)}>
                <div className="auto-scroll-holder">
                    <input type="checkbox" value="1" id="autoscrollchange" onChange={handleAutoScroll} />
                    <label htmlFor="autoscrollchange">Auto Scroll with Media</label>
                </div>
                <div className="custom-select">
                    <label htmlFor="annotation">Annotation Sets</label>
                    <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
                    <select className="px-4 pt-4 pb-3 border w-full rounded-md" value={transcript} onChange={handleSelectTranscript} multiple>
                        {annotations.map((e, key) => {
                            return <option key={key} value={key + 1}>{e.label}</option>;
                        })}
                    </select>
                    <div>
                        {transcriptNames.map((point) => {
                            return <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-gray-700 bg-gray-200 rounded" style={{backgroundColor: point[0]}}>{point[1]}</span>
                        }
                        )}
                        
                    </div>
                </div>
                <div className="custom-height scroll overflow-x-hidden overflow-y-auto mt-2 bg-white rounded-sm p-2" id="transcript_data" ref={transcriptContainerRef}>
                    <>
                        {transcriptPoints.map((point, index) => {
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