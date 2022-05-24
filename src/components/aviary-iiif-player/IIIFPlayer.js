import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getPlayerInfo } from '../../helpers/utils';
import { mainLoader } from '../../helpers/loaders';
import { setItem } from '../../features';
import axios from 'axios';
import Sidebar from './sidebar';
import Player from '../player/player';
import { getAuthService } from '../../helpers/utils';
import Login from '../auth/login';

const IIIFPlayer = (props) => {
    const dispatch = useDispatch();
    const [dataError, setDataError] = useState(false)
    const [playerInfo, setPlayerInfo] = useState({})
    const [data, setData] = useState({});
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        try {
            setData(props.data);
            setPlayerInfo(getPlayerInfo(props.data));
            setIsFetching(false);
        } catch (err) {
            console.log(err)
            setDataError(true);
            setIsFetching(false);
        }
    }, [props]);

    useEffect(() => {
        if (Object.keys(playerInfo).length > 0) {
            dispatch(setItem(playerInfo.firstVideo));
            document.title = `Aviary | ${playerInfo.label}`
        }
    }, [playerInfo]);

    if (isFetching) return <div style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '1rem' }} className="px-4 py-2 pb-4">{mainLoader()}</div>;
    if (dataError) return <span data-testid='struct'>Struct is not Correct</span>;
 
    return (
        <div className="min-h-screen w-full">
            {(playerInfo.label) ? <div className="xl:flex md:block bg-white min-h-screen flex-wrap">
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
                </div> : ''
            }

        </div>
    );
}

export default IIIFPlayer;