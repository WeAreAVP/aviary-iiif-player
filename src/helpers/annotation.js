import { parseManifest, AnnotationPage, Annotation } from 'manifesto.js';
import { isType } from './utils'
import axios from 'axios';
import vttToJson from 'vtt-to-json'

export async function getManifestAnnotations(data, itemNo) {
    const canvas = parseManifest(data)
        .getSequences()[0]
        .getCanvases()[itemNo];
    let annotations = [];
    let annotationPage = null;
    if (canvas) {
        let canvas_annotations = canvas.__jsonld.annotations;
        
        let rendering = canvas.__jsonld.rendering;
        let structures = data.structures;
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
                        annotations.push({
                            label: label,
                            transcript: transcript
                        });
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
                        let result = await vttToJson(response.data);
                        result.forEach((item, iindex) => {
                            let start = parseFloat(item['start'] / 1000);
                            let end = parseFloat(item['end'] / 1000);
                            let text = item["part"].split("\r").filter(n => n).join("<br>");
                            let hash = {
                                endtime: end.toString(),
                                starttime: start.toString(),
                                text: text
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