import React, { useEffect, useState } from 'react'
import Metadata from "./metadata"
import axios from 'axios'
import { descLoader } from '../../helpers/loaders'

const RootDesc = ({link}) => {
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState(false)
    const [dataError, setDataError] = useState(false)
    const [data, setData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(link);
                try {
                    setData(response.data)
                } catch (err) {
                    setDataError(true);
                }
            } catch (err) {
                setError(true)
            }
            setIsFetching(false);
        }
        fetchData();
    }, [])

    if (isFetching) return descLoader();
    if (error) return <span data-testid='loading'>Error loading data</span>;
    if (dataError) return <span>Structure is not correct</span>;

    return (
        <Metadata data={data} />
    )
}

export default RootDesc
