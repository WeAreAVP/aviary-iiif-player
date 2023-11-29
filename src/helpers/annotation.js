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
        
        let rendering = canvas.__jsonld.rendering;
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
                        annotations.push({
                            label: annotationPage.getLabel()?.getValue(),
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
