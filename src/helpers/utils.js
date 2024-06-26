import { getManifestCanvases } from './canvas';
import { parseManifest, Service } from 'manifesto.js';
import { getManifestAnnotations, getManifestStructures } from './annotation';

export function getVideos(jsonData) {
    let canvases = getManifestCanvases(jsonData)
    return (canvases) ? canvases : [{}];
}

export function getPlayerInfo(jsonData) {
    let video = getVideos(jsonData)[0];
    if (video) video.value = true;
    let manifest = parseManifest(jsonData);
    let provider = manifest.getProperty('provider');
    let logoImage, pageLink;
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
    return annotations;
}

export async function getStructures(data, itemNo) {
    let annotations = await getManifestStructures(data, itemNo);
    return annotations;
}

export function getMetadata(data, meta=[]) {
    let metadata = [];
    data.metadata = []

    if (meta.length > 0) {
        meta.map((m, i) => {
            let lang = Object.keys(m.label)[0]
            let homepageMetadata = { "label": { "en": m?.label[lang] }, "value": { "en": m?.value[lang] } }
            metadata.push(homepageMetadata)
        })
        data.metadata = metadata
    }
    if (data?.homepage != undefined) {
        data.homepage.map((m, i) => {
            let homepageMetadata = { "label": { "en": ["Source URI"] }, "value": { "en": [m?.label.en] } }
            metadata.push(homepageMetadata)
        })
        if (data.provider !== undefined) {
            data.provider.map((p, i) => {
                let provider = { "label": { "en": ["Provider"] }, "value": { "en": [p?.label.en] } }
                metadata.push(provider)
            })
        }
        data.metadata = metadata
    }
    if (data?.rights != undefined) {
        let rights = { "label": { "en": ["Rights"] }, "value": { "en": [data?.rights] } }
        metadata.push(rights)
    }
    if (data?.summary != undefined) {
        let lang = Object.keys(data?.summary)
        let summary = { "label": { "en": ["Summary"] }, "value": { "en": data?.summary[lang] } }
        metadata.push(summary)
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
