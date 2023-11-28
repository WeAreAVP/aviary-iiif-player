import { parseManifest, AnnotationPage, Annotation } from 'manifesto.js';

export function getManifestCanvases(jsonData) {
    let manifest = parseManifest(jsonData);
    let canvases = manifest.getSequences()[0]?.getCanvases()?.map((canvas, index) => {
        let item = canvas.getContent()[0].getBody()[0].__jsonld;
        let label = canvas.getLabel()?.getValue();
        let media_info = '';
        if (label) {
            let info = label.split(/ - /);
            if (info.length > 1) {
                media_info = info[0];
                label = info.splice(1).join(' - ');
            }
        }
        let res = {
            ...item,
            thumbnail: canvas.getThumbnail()?.id,
            videoCount: "item-" + index,
            label: label,
            mediaInfo: media_info,
            manifestURL: manifest.id,
            is_3d: is_3d(canvas),
            captions: getCaptions(canvas)
        };
        if(manifest && 
            manifest.getSequences() &&
            manifest.getSequences().length > 0 &&
            manifest.getSequences()[0].items &&
            manifest.getSequences()[0].items.length > 0 &&
            manifest.getSequences()[0].items[0]?.__jsonld &&
            manifest.getSequences()[0].items[0]?.__jsonld?.accompanyingCanvas &&
            manifest.getSequences()[0].items[0]?.__jsonld?.accompanyingCanvas?.items &&
            manifest.getSequences()[0].items[0]?.__jsonld?.accompanyingCanvas?.items.length > 0 &&
            manifest.getSequences()[0].items[0]?.__jsonld?.accompanyingCanvas?.items[0]?.items &&
            manifest.getSequences()[0].items[0]?.__jsonld?.accompanyingCanvas?.items[0]?.items.length > 0 &&
            manifest.getSequences()[0].items[0]?.__jsonld?.accompanyingCanvas?.items[0]?.items[0]['body'] &&
            manifest.getSequences()[0].items[0]?.__jsonld?.accompanyingCanvas?.items[0]?.items[0]['body']['id']
        ){
            res.thumbnail = manifest.getSequences()[0].items[0].__jsonld.accompanyingCanvas.items[0].items[0]['body']['id'];
        }
        
        return res;
    });
    return canvases;
}

function is_3d(canvas) {
    let is_360 = false;
    canvas.getContent()[0].getMetadata()?.map((data) => {
        if (data.getLabel() == '360 Video') return is_360 = true;
    });
    return is_360;
}

function getCaptions(canvas) {
    let captions = [];
    let annotations = canvas.__jsonld.annotations;
    if (!annotations) return captions;
    for (let i = 0; i < annotations.length; i++) {
        let annotationPage = new AnnotationPage(annotations[i], {});
        if (!annotationPage) { continue; }
        let items = annotationPage.getItems();
        if (items) {
            let annotation = new Annotation(items[0], {});
            if (annotation.getMotivation() == 'subtitling') {
                captions.push({
                    label: annotationPage.getLabel()?.getValue(),
                    language: annotation.getBody()[0]?.__jsonld?.language,
                    src: annotation.getTarget(),
                    kind: 'captions'
                });
            }
        }
    }
    return captions;
}
