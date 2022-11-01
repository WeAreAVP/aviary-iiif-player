import { getManifestCanvases } from './canvas';
import { parseManifest, Service } from 'manifesto.js';
import { getManifestAnnotations } from './annotation';

export function getVideos(jsonData) {
    let canvases = getManifestCanvases(jsonData)
    return (canvases) ? canvases : [{}];
}

export function getPlayerInfo(jsonData) {
    let video = getVideos(jsonData)[0];
    if (video) video.value = true;
    let manifest = parseManifest(jsonData);
    let provider = manifest.getProperty('provider');
    let logoImage,pageLink;
    if (jsonData.homepage === undefined && provider) {
        logoImage = provider[0]?.logo[0]?.id;
        pageLink = provider[0]?.homepage[0]?.id;
    }
    let playerRes = {
        label: manifest.getLabel()?.getValue(),
        logoInformation: provider,
        logoImage: logoImage,
        pageLink: pageLink,
        firstVideo: video
    }
    return playerRes
}

export async function getTranscripts(data, itemNo) {
    let annotations = await getManifestAnnotations(data, itemNo);
    console.log("utilssss->", annotations);
    return annotations;
}

export function getMetadata(data) {
    if (data?.homepage != undefined) {
        data.metadata = []
        let metadata = [];
        data.homepage.map((m, i) => {
            let homepageMetadata = {"label": {"en": ["Source URI"]}, "value": {"en": [ m?.label.en]}}
            metadata.push(homepageMetadata)
        })
        if (data.provider !== undefined) {
            data.provider.map((p, i) => {
                let provider = {"label": {"en": ["Provider"]}, "value": {"en": [ p?.label.en]}}
                metadata.push(provider)
            })
        }
        data.metadata = metadata
    }
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

export function getAuthService(jsonData) {
    return parseManifest(jsonData).getServices()[0]?.__jsonld;
}