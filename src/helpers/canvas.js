import { parseManifest, AnnotationPage, Annotation } from 'manifesto.js';

export function getManifestCanvases(jsonData) {
    let manifest = parseManifest(jsonData);
    let canvases = manifest.getSequences()[0]?.getCanvases()?.map((canvas, index) => {
        let items = canvas.getContent()?.map((canvas_item, c_index) => {
            let item = canvas_item.getBody()[0].__jsonld;
            let label = canvas_item.getLabel()?.getValue();
            let media_info = '';
            if (label) {
                let info = label.split(/ - /);
                if (info.length > 1) {
                    media_info = info[0];
                    label = info.splice(1).join(' - ');
                }
            }
            else{
                if(label == null && manifest && manifest?.__jsonld &&  manifest?.__jsonld?.items && manifest?.__jsonld?.items.length>0 && manifest?.__jsonld?.items[index]?.label)
                {
                    label = manifest?.__jsonld?.items[index]?.label[Object.keys(manifest?.__jsonld?.items[index]?.label)[0]]
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
                captions: getCaptions(canvas),
                start_time: 0
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
            if(manifest &&
                manifest?.__jsonld &&
                manifest?.__jsonld?.start &&
                manifest?.__jsonld?.start?.selector &&
                manifest?.__jsonld?.start?.selector?.t
            ){
                res.start_time = manifest.__jsonld.start.selector.t;
            }
            return res;
        });
        return items;
    });
    return canvases.flat();
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
            if (annotation.getMotivation() == 'supplementing') {
                for (let j = 0; j < items.length; j++) {
                    if(items[j]?.body.label)
                    {
                        captions.push({
                            label: items[j]?.body.label[Object.keys(items[j]?.body.label)][0],
                            language: items[j]?.body?.language,
                            src: items[j]?.body?.id,
                            kind: 'captions'
                        });
                    }
                }
            }
        }
    }
    return captions;
}
