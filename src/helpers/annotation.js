import { parseManifest, AnnotationPage, Annotation } from 'manifesto.js';

export function getManifestAnnotations(data, itemNo) {
    const canvas = parseManifest(data)
        .getSequences()[0]
        .getCanvases()[itemNo];
    let annotations = [];
    let annotationPage = null;
    if (canvas) {
        let canvas_annotations = canvas.__jsonld.annotations;
        if (canvas_annotations) {
            canvas_annotations.forEach(annotate => {
                annotationPage = new AnnotationPage(annotate, {});
                if (!annotationPage) { return false }
                console.log(annotationPage.getLabel()?.getValue());
                let items = annotationPage.getItems();
                formatIndexes(items);
            })
        }
       
    }
    return annotations;
}


// export function parseAnnotation(point) {
//     let content = "";
//     if (isType('array', point.body)) {
//         let values = [];
//         let label = point.body[0].label?.en[0];
//         point.body.map(({ value }, key) => {
//             if (['Keywords', 'Subjects'].includes(label)) {
//                 values.push('<span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-700 bg-gray-200 rounded">' + value + '</span>');
//             } else if (label == "Title") {
//                 values.push('<strong>' + value + '</strong>')
//             } else {
//                 values.push(value.replaceAll("\n", "<br/>"));
//             }
//         });
//         content = values.join(" ");
//         if (label && !['Title', 'Synopsis'].includes(label)) {
//             content = '<strong>' + label + ': </strong>' + content;
//         }
//     } else {
//         content = point.body.value.replaceAll("\n", "<br/>");
//     }
//     const hash = { text: content }
//     const params = new URLSearchParams(point.target.split("#")[1]);
//     if (params.has("t")) {
//         let time = params.get("t").split(",");
//         hash.starttime = time[0];
//         hash.endtime = time[1];
//     }
//     return hash;
// }

function formatIndexes(transcript) {
    // let newTranscript = {};
    transcript.map((point, index) => {
        let annotation = new Annotation(point, {});
        console.log(annotation.getMotivation())
        // if (point.motivation != 'subtitling') {
        //     let hash = parseAnnotation(point);
        //     (!newTranscript.hasOwnProperty(hash.starttime)) ?
        //         newTranscript[hash.starttime] = hash : newTranscript[hash.starttime]['text'] += "<br >" + hash["text"];
        // }
    });
    // return Object.values(newTranscript);
}

