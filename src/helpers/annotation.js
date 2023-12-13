import { parseManifest, AnnotationPage, Annotation } from 'manifesto.js';
import { isType } from './utils'
import axios from 'axios';

export async function getManifestAnnotations(data, itemNo) {
    const canvas = parseManifest(data)
        .getSequences()[0]
        .getCanvases()[itemNo];
    let annotations = [];
    let annotationPage = null;
    if (canvas) {

        let canvas_annotations = canvas.__jsonld.annotations;
        let items = canvas.__jsonld.annotations;
        let rendering = canvas.__jsonld.rendering;
        let structures = data.structures;
        if(items)
        {
            items.forEach((item) => {
                item.items.forEach((canvas_annotations_item) => {
                    if(canvas_annotations_item?.body && canvas_annotations_item?.body?.type == "Choice")
                    {
                        canvas_annotations_item.body.items.forEach(async (annotate) => {
                            annotationPage = new AnnotationPage(annotate, {});
                            if (annotationPage?.__jsonld && annotationPage?.__jsonld?.format == "text/vtt") {
                                let point = [{body: annotationPage.__jsonld}]
                                let transcript = await formatIndexesNew(point)
                                if (transcript.length > 0) {
                                let label =  annotationPage.getLabel()?.getValue();
                                    annotations.push({
                                        label: label,
                                        transcript: transcript
                                    })
                                }
                            }
                        })
                    }
                })
            })
        }
        if(structures)
        {

            structures.forEach(async (annotate) => {
                annotationPage = new AnnotationPage(annotate, {});
                if (annotationPage.getItems() !== undefined) {
                    let transcript = formatIndexesItems(annotationPage.getItems());
                    if (transcript.length > 0) {
                        let label =  annotationPage.getLabel()?.getValue();
                        annotations.push({
                            label: label,
                            transcript: transcript
                        });
                    }
                }
            })
        }
        if(rendering)
        {

            for (let i = 0; i < rendering.length; i++) {
                if(rendering[i].label)
                {
                    let lang = Object.keys(rendering[i].label)
                    if(lang.length > 0)
                    {
                        let label = rendering[i].label[lang[0]][0];
                        annotations.push({
                            label: label,
                            language: lang[0],
                            src: rendering[i].id,
                            kind: 'text'
                        });
                    }
                }
            }
        }

        if (canvas_annotations) {

            canvas_annotations.forEach(async (annotate) => {
                annotationPage = new AnnotationPage(annotate, {});
                if (annotationPage.getItems() !== undefined) {
                    let transcript = formatIndexes(annotationPage.getItems());

                    if (transcript.length > 0) {
                        let label =  annotationPage.getLabel()?.getValue();
                        if(label == null)
                        {
                            transcript = await formatIndexesNew(annotationPage.getItems())
                        }
                        if(annotationPage.getItems()[0]?.body && annotationPage.getItems()[0]?.body.label)
                        {
                            let lang = Object.keys(annotationPage.getItems()[0]?.body?.label)
                            label =  annotationPage.getItems()[0]?.body?.label[lang][0];
                        }
                        if(label)
                        {
                            annotations.push({
                                label: label,
                                transcript: transcript
                            });
                        }
                    }
                } else {
                    let annot = await fetchJson(annotationPage.__jsonld?.id)
                    if (Object.keys(annot).length > 0) {
                        annotations.push(annot)
                    }
                }
            })
        }
    }
    return annotations;
}


export function parseAnnotation(annotation) {
    let content = "";
    const body = annotation.getBody();
    let values = [];
    let label = body[0]?.__jsonld?.label?.en[0];
    if (label) {
        for (let i = 0; i < body.length; i++) {
            let value = body[i]?.__jsonld?.value;
            if (['Keywords', 'Subjects'].includes(label)) {
                values.push('<span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-700 bg-gray-200 rounded">' + value + '</span>');
            } else if (label == "Title") {
                values.push('<strong>' + value + '</strong>')
            } else {
                if(value)
                values.push(value.replaceAll("\n", "<br/>"));
            }
            content = values.join(" ");
            if (label && !['Title', 'Synopsis'].includes(label)) {
                content = '<strong>' + label + ': </strong>' + content;
            }
        }

    } else {
        if(body[0]?.__jsonld?.value)
        content = body[0]?.__jsonld?.value.replaceAll("\n", "<br/>");
    }
    const hash = { text: content };
    const params = new URLSearchParams(annotation.getTarget().split("#")[1]);
    if (params.has("t")) {
        let time = params.get("t").split(",");
        hash.starttime = time[0];
        hash.endtime = time[1];
    }
    return hash;
}

function formatIndexes(transcript) {
    let newTranscript = {};
    transcript.map((point, index) => {
        let annotation = new Annotation(point, {});
        if (annotation.getMotivation() != 'subtitling') {
            let hash = parseAnnotation(annotation);
            (!newTranscript.hasOwnProperty(hash.starttime)) ?
                newTranscript[hash.starttime] = hash : newTranscript[hash.starttime]['text'] += "<br >" + hash["text"];
        }
    });
    return Object.values(newTranscript);
}

function convertVttToDpe(webvtt) {
    webvtt = webvtt.replaceAll('\r','\n')
    webvtt = webvtt.replaceAll('\n\n','\n')

    const lines = webvtt.split('\n');
  
    let dpeTranscription = {
      paragraphs: [],
    };
  
    lines.forEach((line, index) => {
      if (line.includes('-->')) {
        let title = "";
        if(lines[index-1].length > 0)
        {
            title = lines[index-1];
        }
        // Extract start and end time from WebVTT line
        const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})/);
        const startTime = timeMatch ? convertTimeToSeconds(timeMatch[1]) : 0;
        const endTime = timeMatch ? convertTimeToSeconds(timeMatch[2]) : 0;
        let speakerMatch = null;
        let speaker = null;
  
        // Determine speaker information
        if (lines[index + 1] && lines[index + 1].includes('<v')) {
          speakerMatch = lines[index + 1].match(/<v ([a-zA-Z0-9]+)>/);
          speaker = speakerMatch ? speakerMatch[1] : 'Add speaker';
        } else if (lines[index + 1] && lines[index + 2]) {
          const nextLine = lines[index + 2];
          const speakerLine = lines[index + 1];
  
          if (nextLine.includes(':')) {
            speakerMatch = nextLine.match(/([A-Z]+:)/);
            speaker = speakerMatch ? speakerLine + ' ' + speakerMatch[1] : 'Add speaker';
          } else {
            speakerMatch = speakerLine.match(/([A-Z]+:)/);
            speaker = speakerMatch ? speakerMatch[1] : 'Add speaker';
          }
        } else {
          speaker = 'Add speaker';
        }
  
        let content = '';
        let contentStarted = false;
  
        // Extract content from WebVTT lines
        for (let i = 1; lines[index + i]; i++) {
          const currentLine = lines[index + i];
          const nextLine = lines[index + i + 1] || '';
  
          if (contentStarted || (!nextLine.includes(':'))) {
            if (!contentStarted && currentLine.includes(':')) {
              content += currentLine.split(':')[1].trim();
              contentStarted = true;
            } else {
              content += ' ' + currentLine;
            }
          } else if (!currentLine.includes(':') && nextLine.includes(':')) {
            content += nextLine.split(':')[1].trim();
            contentStarted = true;
            i += 1;
          }
        }
  
        // Remove HTML tags and trailing spaces from content
        content = content.replace(/<[^>]*>/g, '').trim();
        if (content) {
            if(title != '')
            {
                content = "<strong>"+title+"</strong><br>"+content;
            }
          // Add paragraph to DPE transcription
          dpeTranscription.paragraphs.push({ start: startTime, end: endTime, speaker: speaker, text: content });
        }
      }
    });
  
    /**
     * Converts time in HH:MM:SS format to seconds.
     * @param {string} time - Time string in HH:MM:SS format.
     * @returns {number} - Time in seconds.
     */
    function convertTimeToSeconds(time) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 3600 + minutes * 60 + parseFloat(seconds);
    }
  
    return dpeTranscription;
}

function formatIndexesItems(transcript) {
    let newTranscript = {};
    let last_endtime = '';
    transcript.map((point, index) => {
        
        let annotation = new Annotation(point, {});
        let point_hash = {
            endtime: "",
            starttime: "",
            child: [],
            text: ""
        };
        let lang = Object.keys(point.label)
        let label = point.label[lang[0]]
        point_hash.text = label.join(" ")
        if(annotation?.__jsonld?.items)
        {
            annotation.__jsonld.items.map((item, iindex) => {
                if(item.items && item.items[0]?.id)
                {
                    let child_hash = {
                        endtime: "",
                        starttime: "",
                        text: ""
                    }
                    const params = new URLSearchParams(item.items[0]?.id.split("#")[1]);
                    if (params.has("t")) {
                        let time = params.get("t").split(",");
                        if(last_endtime == '') point_hash.starttime = time[0]; 
                        child_hash.starttime = time[0]
                        point_hash.endtime = time[1]; 
                        child_hash.endtime = time[1];
                        let ilang = Object.keys(item.label)
                        let ilabel = item.label[lang[0]]
                        child_hash.text = item.label[ilang[0]].join(" ")
                        point_hash.child.push(child_hash)
                        last_endtime = point_hash.endtime;
                    }
                }
                else if(item?.id)
                {
                    const params = new URLSearchParams(item?.id.split("#")[1]);
                    if (params.has("t")) {
                        let time = params.get("t").split(",");
                        if(time.length == 1)
                        {
                            point_hash.starttime = last_endtime;   
                            point_hash.endtime = time[0]; 
                        }
                    }
                }
            });
            
        }
        newTranscript[point_hash.starttime] = point_hash;
    });
    return Object.values(newTranscript);
}

const formatIndexesNew = async (transcript) => {
    let newTranscript = {};
    const promises = [];

    for (const [index, point] of transcript.entries()) {
        let promise;

        if (point.body && point.body.format == "text/vtt") {
            promise = axios.get(point.body.id)
                .then(async (response) => {
                    try {
                        let result = await convertVttToDpe(response.data);
                        result?.paragraphs.forEach((item, iindex) => {
                            let hash = {
                                endtime: item.end.toString(),
                                starttime: item.start.toString(),
                                text: item.text
                            };
                            if (!newTranscript[hash.starttime]) {
                                newTranscript[hash.starttime] = hash;
                            } else {
                                newTranscript[hash.starttime]['text'] += "<br>" + hash["text"];
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }).catch(function (error) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log('Error',error.response.data);
                       
                      } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser 
                        // and an instance of http.ClientRequest in node.js
                        setTimeout(function() {
                            var element =  document.getElementById('no_annotation');
                            if (typeof(element) != 'undefined' && element != null)
                            {
                                document.getElementById("no_annotation").innerHTML= 'Invalid URL for transcript, please check again.'
                            }
                        }, 2000);

                        
                        console.log('Error',error.message);

                      } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                      }
                });
        }
        promises.push(promise);
    }

    await Promise.all(promises);
    return Object.values(newTranscript);
};


function formatJsonIndexes(transcript) {
    let newTranscript = {};
    transcript.map((point, index) => {
        let annotation = new Annotation(point, {});
        if (annotation.getMotivation()?.indexOf('subtitling') == -1) {
            let hash = parseJsonAnnotation(annotation);
            (!newTranscript.hasOwnProperty(hash.starttime)) ?
                newTranscript[hash.starttime] = hash : newTranscript[hash.starttime]['text'] += "<br >" + hash["text"];
        }
    });
    return Object.values(newTranscript);
}

export function parseJsonAnnotation(annotation) {
    let content = "";
    const body = annotation.getBody();
    let values = [];
    let label = body[0]?.__jsonld?.label?.en[0];
    if (label) {
        for (let i = 0; i < body.length; i++) {
            let value = body[i]?.__jsonld?.value;
            if (['Keywords', 'Subjects'].includes(label)) {
                values.push('<span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-700 bg-gray-200 rounded">' + value + '</span>');
            } else if (label == "Title") {
                values.push('<strong>' + value + '</strong>')
            } else {
                values.push(value.replaceAll("\n", "<br/>"));
            }
            content = values.join(" ");
            if (label && !['Title', 'Synopsis'].includes(label)) {
                content = '<strong>' + label + ': </strong>' + content;
            }
        }

    } else {
        content = body[0]?.__jsonld?.value.replaceAll("\n", "<br/>");
    }
    const hash = { text: content };
    const target = annotation.getTarget();
    const time = target.selector?.t?.split(",");
    if (time) {
        hash.starttime = time[0];
        hash.endtime = time[1];
    }
    return hash;
}

const fetchJson = async (jsonPath) => {
    let annotationPage = null;
    let annotation = {};
    try {
        const response = await axios.get(jsonPath);
        try {
            annotationPage = new AnnotationPage(response.data, {});
            if (annotationPage.getItems() !== undefined) {
                let transcript = formatJsonIndexes(annotationPage.getItems());
                if (transcript.length > 0) {
                    annotation = {
                        label: annotationPage.getLabel()?.getValue(),
                        transcript: transcript
                    }
                }
            }
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
    return annotation;
}