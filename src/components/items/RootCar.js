import React, { useState, useEffect } from "react";
import VideoCarousel from "./VideoCarousel";
import { videoLoader } from "../../helpers/loaders";

const RootCar = (props) => {
    const [data, setData] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [dataError, setDataError] = useState(false);

    useEffect(() => {
        try {
            setData(props.data)
            setIsFetching(false);
        } catch (err) {
            setDataError(true);
            setIsFetching(false);
        }
    }, []);

    if (isFetching) return videoLoader();
    if (dataError) return <span>Structure is not correct</span>;

    return (
        <div style={{ height: '100%', paddingLeft: '1.25rem', paddingRight: '1.25rem' }} className="h-full px-5">
            <VideoCarousel data={data} />
        </div>
    )
}

export default RootCar
