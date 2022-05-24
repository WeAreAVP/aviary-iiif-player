import React, { useEffect, useState } from 'react'
import { mainLoader } from './helpers/loaders';
import axios from 'axios';
import { getAuthService } from './helpers/utils';
import Login from './components/auth/login';

import RootPlay from './components/player/RootPlay';
import RootDesc from './components/metadata/RootDesc';
import RootCar from './components/items/RootCar';
import RootTrans from './components/annotations/RootTrans';
import IIIFPlayer from './components/aviary-iiif-player/IIIFPlayer'

const Main = (props) => {
    const [error, setError] = useState(false)
    const [dataError, setDataError] = useState(false)
    const [data, setData] = useState({})
    const [isFetching, setIsFetching] = useState(true);
    const [service, setService] = useState({});
    const [authToken, setAuthToken] = useState({});
    const [skipAuth, setSkipAuth] = useState(false);


    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(props.manifest);
                try {
                    var authService = getAuthService(response.data)
                    setService(authService);
                    if (!authService) {
                        setData(response.data);
                    }
                } catch (err) {
                    console.log(err)
                    setDataError(true);
                }
            } catch (err) {
                setError(true);
            }
            setIsFetching(false);
        }
        fetching();
    }, []);

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(props.manifest, {
                    headers: authToken
                });
                try {
                    setData(response.data);
                } catch (err) {
                    console.log(err)
                    setDataError(true);
                }
            } catch (err) {
                setError(true);
            }
            setIsFetching(false);
        }
        if (Object.keys(authToken).length > 0) {
            setIsFetching(true);
            fetching();
        }
    }, [authToken]);

    if (isFetching) return <div className="px-4 py-2 pb-4">{mainLoader()}</div>;
    if (error) return <span data-testid='loading'>Error loading data</span>;
    if (dataError) return <span data-testid='struct'>Struct is not Correct</span>;
    
    return (
        <div className="min-h-screen w-full">
            {
                (service && Object.keys(authToken).length === 0 && skipAuth === false) ? <Login service={service} setAuth={setAuthToken} skipAuth={setSkipAuth}/> : 
                (Object.keys(data).length > 0) ? 
                    (props.component == "player") ? <RootPlay data={data} /> :
                    (props.component == "annotation") ? <RootTrans data={data} /> :
                    (props.component == "metadata") ? <RootDesc data={data} /> :
                    (props.component == "items") ? <RootCar data={data} /> : <IIIFPlayer data={data} />
                : (skipAuth === true) ? 'No public media found.' : ''
            }

        </div>
    );
}

export default Main;