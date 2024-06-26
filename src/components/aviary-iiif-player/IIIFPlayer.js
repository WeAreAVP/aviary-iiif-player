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
import queryString from 'query-string';

const IIIFPlayer = (props) => {

    const dispatch = useDispatch();
    const [dataError, setDataError] = useState(false)
    const [playerInfo, setPlayerInfo] = useState({})
    const [data, setData] = useState({});
    const [isFetching, setIsFetching] = useState(true);
    const parsed = queryString.parse(location.search);
    const [fullDisplay, setFullDisplay] = useState(false);

    useEffect(() => {
        if(parsed.metadata === 'false' && parsed.annotations === 'false')
        {
            setFullDisplay(true)
        }
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
        if (Object.keys(playerInfo).length > 0 && playerInfo.firstVideo) {
            dispatch(setItem(playerInfo.firstVideo));
            document.title = `Aviary | ${playerInfo.label}`
        }
    }, [playerInfo]);

    if (isFetching) return <div style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '1rem' }} className="px-4 py-2 pb-4">{mainLoader()}</div>;
    if (dataError) return <span data-testid='struct'>Struct is not Correct</span>;

    return (
        <div className="min-h-screen w-full">
            {
                (playerInfo.label && typeof playerInfo.firstVideo != "undefined") ?
                    <div className="xl:flex md:block bg-white min-h-screen flex-wrap">
                        <div className={`w-full lg:w-full ${fullDisplay ? "" : "xl:w-3/5"}`}>
                            <div id="player_desc" className="w-full flex flex-col justify-between h-full">
                                <Player data={data} label={playerInfo.label} />
                                

                            </div>
                        </div>
                        {!fullDisplay ? (<div className="w-full lg:w-full xl:w-2/5 sidebar-holder border-l">
                            <Sidebar data={data} metadata={props.metadata} playerInfo={playerInfo}/>
                        </div>) : ''}
                        
                    </div> : 'No public media found.'
            }

        </div>
    );
}

export default IIIFPlayer;
