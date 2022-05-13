import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getPlayerInfo } from '../../helpers/utils';
import { mainLoader } from '../../helpers/loaders';
import { setItem } from '../../features';
import axios from 'axios';
import Sidebar from './sidebar';
import Player from '../player/player';

const IIIFPlayer = (props) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(false)
    const [dataError, setDataError] = useState(false)
    const [playerInfo, setPlayerInfo] = useState({})
    const [data, setData] = useState({})
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(props.manifest);
                try {
                    setData(response.data);
                    setPlayerInfo(getPlayerInfo(response.data));
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
    }, [props]);

    useEffect(() => {
        if (Object.keys(playerInfo).length > 0) {
            dispatch(setItem(playerInfo.firstVideo));
            document.title = `Aviary | ${playerInfo.label}`
        }
    }, [playerInfo]);

    if (isFetching) return <div className="px-4 py-2 pb-4">{mainLoader()}</div>;
    if (error) return <span data-testid='loading'>Error loading data</span>;
    if (dataError) return <span data-testid='struct'>Struct is not Correct</span>;
    
    return (
        <div className="min-h-screen w-full">
            <div className="xl:flex md:block bg-white min-h-screen flex-wrap">
                <div className="w-full lg:w-full xl:w-2/3">
                    <div id="player_desc" className="w-full flex flex-col justify-between h-full">
                        <Player data={data} label={playerInfo.label} />
                        {
                            (playerInfo.logoInformation) ?
                                <div className="">
                                    <div className='flex items-center space-x-3 py-3 px-5 border-t'>
                                        <p
    
                                            className="text-sm"
                                        >
                                            About the Provider:
                                        </p>
                                        <div className=''>
                                            <div className='flex items-center'>
                                                <a href={playerInfo.pageLink}>
                                                    <img alt='' className=' object-contain w-5 h-5 mr-2' src={playerInfo.logoImage} />
                                                </a>
                                                <div>
                                                    {playerInfo.logoInformation.map(({ label }) => (
                                                        <div key={"provider-" + label.en}>
                                                            <p className='font-bold text-sm'>{label.en}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            : ""
                        }
                    </div>
                </div>
                <div className="w-full lg:w-full xl:w-1/3 sidebar-holder border-l">
                    <Sidebar data={data} />
                </div>
            </div>
        </div>
    );
}

export default IIIFPlayer;