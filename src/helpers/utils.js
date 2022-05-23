import { getManifestCanvases } from './canvas';
import { parseManifest, Service } from 'manifesto.js';
import { getManifestAnnotations } from './annotation';

export function getVideos(jsonData) {
    let canvases = getManifestCanvases(jsonData)
    return (canvases) ? canvases : [{}];
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

export function getAuthService(jsonData) {
    return parseManifest(jsonData).getServices()[0]?.__jsonld;
}