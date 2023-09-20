import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setItem } from '../../features';
import moment from 'moment'

const File = (props) => {

    const dispatch = useDispatch();
    const [value, setValue] = useState(false)

    const videoOne = () => {
        setValue(true)
        dispatch(setItem({ ...props }));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }} id={props.videoCount} className='flex items-center mb-5 playlist-box' onClick={videoOne}>
            <div style={{ marginRight: '1.25rem', position: 'relative' }} className="mr-5 relative image-holder">
                <img
                    alt=''
                    style={{ cursor: 'pointer', objectFit: 'cover', borderRadius: '0.375rem' }}
                    className="cursor-pointer object-cover rounded-md"
                    src={props.thumbnail}
                />
                <span style={{ position: 'absolute', right: '0.25rem', bottom: '0.25rem', fontWeight: 'bold', fontSize: '0.75rem', lineHeight: '1rem', background: 'black', color: 'white', paddingLeft: '0.25rem', paddingRight: '0.25rem', borderRadius: '0.25rem' }} className="absolute right-1 bottom-1 font-bold text-xs bg-black text-white px-1 rounded">{moment.utc(props.duration * 1000).format('HH:mm:ss')}</span>
            </div>
            <div className="">
                <div style={{ fontWeight: '600', display: 'block', fontSize: '0.875rem', lineHeight: '1.25rem' }} className="custom-title font-semibold block text-sm">{props.mediaInfo}</div>
                <div className="font-normal text-sm">{props.label}</div>
            </div>
        </div>
    )
}

export default File
