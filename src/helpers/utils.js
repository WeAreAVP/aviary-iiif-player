import { getManifestCanvases } from './canvas';
import { parseManifest } from 'manifesto.js';
import { getManifestAnnotations } from './annotation';

export function getVideos(jsonData) {
    // console.log('rimi test');
    // console.log(getManifestAnnotations(jsonData, 0));
    // let videos = [];
    // for (let i = 0; i < jsonData.items.length; i++) {
    //     let video = { ...jsonData?.items[i]?.items[0]?.items[0]?.body };
    //     if ('id' in video){
    //         let label = jsonData?.items[i]?.label?.en[0];
    //         let info = label?.split(/ - /)
    //         video["thumbnail"] = jsonData?.items[i]?.thumbnail[0]?.id;
    //         video["videoCount"] = "item-" + i;
    //         video["manifestURL"] = jsonData.id;
    //         video["mediaInfo"] = (info.length > 0) ? info[0] : '';
    //         video["label"] = info?.splice(1).join(' - ');
    //         video['captions'] = getCaptions(jsonData, i);
    //         video['is_3d'] = is_3d(jsonData?.items[i]?.items[0])
    //         videos.push(video);
    //     }
        
    // }
    return getManifestCanvases(jsonData);
}

export function getPlayerInfo(jsonData) {
    let video = getVideos(jsonData)[0];
    video.value = true;
    let manifest = parseManifest(jsonData);
    let provider = manifest.getProperty('provider');
    let logoImage,pageLink;
    if (provider) {
        logoImage = provider[0]?.logo[0]?.id;
        pageLink = provider[0]?.homepage[0]?.id;
    }
    return {
        label: manifest.getLabel()?.getValue(),
        logoInformation: provider,
        logoImage: logoImage,
        pageLink: pageLink,
        firstVideo: video
    }
}

export function getTranscripts(data, itemNo) {
    // let annotations = [];
    // if (data?.items && data?.items[itemNo]?.annotations) {
    //     let items = data?.items[itemNo]?.annotations;
    //     for (let i = 0; i < items.length; i++) {
    //         if (items[i].items[0].motivation != 'subtitling')
    //             annotations.push({
    //                 label: items[i].label?.en[0],
    //                 transcript: formatIndexes(items[i].items)
    //             });
    //     }
    // }

    return getManifestAnnotations(data, itemNo);
}

export function getMetadata(data) {
    return data.metadata;
}

export function isType(type, val) {
    return val.constructor.name.toLowerCase() === type.toLowerCase();
}

export function getHHMMSSFromSeconds(totalSeconds) {
    if (!totalSeconds) {
        return "00:00:00";
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hhmmss =
        padTo2(hours) + ":" + padTo2(minutes) + ":" + padTo2(seconds);
    return hhmmss;
}

// function to convert single digit to double digit
function padTo2(value) {
    if (!value) {
        return "00";
    }
    return value < 10 ? String(value).padStart(2, "0") : value;
}

export function parseAnnotation(point) {
    let content = "";
    if (isType('array', point.body)) {
        let values = [];
        let label = point.body[0].label?.en[0];
        point.body.map(({ value }, key) => {
            if (['Keywords', 'Subjects'].includes(label)) {
                values.push('<span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-700 bg-gray-200 rounded">' + value + '</span>');
            } else if (label == "Title") {
                values.push('<strong>' + value + '</strong>')
            } else {
                values.push(value.replaceAll("\n", "<br/>"));
            }
        });
        content = values.join(" ");
        if (label && !['Title', 'Synopsis'].includes(label)) {
            content = '<strong>' + label + ': </strong>' + content;
        }
    } else {
        content = point.body.value.replaceAll("\n", "<br/>");
    }
    const hash = { text: content }
    const params = new URLSearchParams(point.target.split("#")[1]);
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
        if (point.motivation != 'subtitling') {
            let hash = parseAnnotation(point);
            (!newTranscript.hasOwnProperty(hash.starttime)) ?
                newTranscript[hash.starttime] = hash : newTranscript[hash.starttime]['text'] += "<br >" + hash["text"];
        }
    });
    return Object.values(newTranscript);
}

function getCaptions(data, itemNo) {
    let captions = [];
    if (data?.items && data?.items[itemNo]?.annotations) {
        let items = data?.items[itemNo]?.annotations;
        for (let i = 0; i < items.length; i++) {
            if (items[i].items[0].motivation == 'subtitling')
                captions.push({
                    label: items[i].label?.en[0],
                    language: items[i].items[0].body.language,
                    src: items[i].items[0].target,
                    kind: 'captions'
                });
        }
    }
    return captions;
}

function is_3d(item) {
    let metadata = item.metadata;
    let is_360 = false;
    if (metadata) {
        metadata.forEach(data => {
            if (data.label?.en[0] == '360 Video') return is_360 = true;
        });
    }
    return is_360;
}