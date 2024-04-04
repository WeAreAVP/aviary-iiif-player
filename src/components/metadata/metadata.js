import React, { useEffect, useState } from 'react'
import { descLoader } from '../../helpers/loaders'
import { getMetadata } from '../../helpers/utils';
import ReactHtmlParser from 'react-html-parser';


const Metadata = (props) => {
    const [descriptionData, setDescriptionData] = useState([])
    const [dataError, setDataError] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        try {
            setDescriptionData(getMetadata(props.data,props.metadata));
            setIsFetching(false);
        } catch (err) {
            setDataError(true)
            setIsFetching(false);
        }
    }, [props])

    if (dataError) {
        return <span data-testid='struct'>Metadata Structure is not Correct</span>
    }

    if (isFetching) return descLoader();
    if (dataError) return <span>Annotation structure is not correct</span>;
    if (!descriptionData || descriptionData.length == 0) return <span>No metadata available.</span>;
    return (
        <div className="">
            <div className="scroll custom-height overflow-x-hidden overflow-y-auto">
                {descriptionData.map((desc, index) => (
                    <div key={"iiif-desc-" + index}>
                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', display: 'flex' }} className='mb-4 pb-4 flex'>
                            <div style={{ fontSize: '0.875rem', fontWeight: 'bold', width: '33.333333%' }} className='text-sm font-bold w-1/3'>{desc.label.en}: </div>
                            <div className='w-2/3'>{ReactHtmlParser(desc.value.en)}</div>
                        </div>

                    </div>
                ))}
            </div>
        </div >
    )
}

export default Metadata;
