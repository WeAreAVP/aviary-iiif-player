import React, { useEffect, useState } from 'react'
import Transcripts from './transcripts'
import axios from 'axios'
import { descLoader } from '../../helpers/loaders'

const RootTrans = ({ link }) => {
    const [error, setError] = useState(false)
    const [dataError, setDataError] = useState(false)
    const [data, setData] = useState({})
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const fetching = async () => {
            try {
                const res = await axios.get(link);
                try {
                    setData(res.data)
                    
                } catch (err) {
                    setDataError(true);
                }
            } catch (err) {
                setError(true);
            }
            setIsFetching(false);
        }
        fetching();
    }, [])

    if (isFetching) return descLoader();
    if (error) return <span data-testid='loading'>Error loading data</span>;
    if (dataError) return <span data-testid='struct'>Struct is not Correct</span>;
    
    return (
        <Transcripts data={data} />

    )
}

export default RootTrans
