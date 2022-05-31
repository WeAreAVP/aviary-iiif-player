import React, { useEffect, useState } from 'react'
import Metadata from "./metadata"
import { descLoader } from '../../helpers/loaders'

const RootDesc = (props) => {
    const [isFetching, setIsFetching] = useState(true)
    const [dataError, setDataError] = useState(false)
    const [data, setData] = useState({})

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
    if (dataError) return <span>Structure is not correct</span>;

    return (
        <Metadata data={data} />
    )
}

export default RootDesc
