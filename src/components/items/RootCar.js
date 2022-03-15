import React, { useState, useEffect } from "react";
import VideoCarousel from "./VideoCarousel";
import { videoLoader } from "../../helpers/loaders";
import axios from 'axios';

const RootCar = ({ link }) => {
    const [data, setData] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [dataError, setDataError] = useState(false);
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(link);
                try {
                    setData(response.data);
                } catch (err) {
                    setDataError(true);
                }
            } catch (err) {
                setError(true)
            }
            setIsFetching(false);
        }
        fetchData();
    }, []);

    if (isFetching) return videoLoader();
    if (error) return <span data-testid='loading'>Error loading data</span>;
    if (dataError) return <span>Structure is not correct</span>;

    return (
        <div style={{ height: '100%', paddingLeft: '1.25rem', paddingRight: '1.25rem' }} className="h-full px-5">
            <VideoCarousel data={data} />
        </div>
    )
}

export default RootCar
