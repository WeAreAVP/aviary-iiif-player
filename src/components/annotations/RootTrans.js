import React, { useEffect, useState } from 'react'
import Transcripts from './transcripts'
import { descLoader } from '../../helpers/loaders'

const RootTrans = (props) => {
    const [dataError, setDataError] = useState(false)
    const [data, setData] = useState({})
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        try {
            setData(props.data)
            setIsFetching(false);
        } catch (err) {
            setDataError(true);
            setIsFetching(false);
        }
    }, [])

    if (isFetching) return descLoader();
    if (dataError) return <span data-testid='struct'>Struct is not Correct</span>;
    
    return (
        <Transcripts data={data} />

    )
}

export default RootTrans
