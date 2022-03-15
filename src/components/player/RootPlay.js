import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Player from './player';
import { setItem } from '../../features';
import axios from 'axios'
import { getPlayerInfo } from '../../helpers/utils';
import { mainLoader } from '../../helpers/loaders';


const RootPlay = ({ link }) => {
    const dispatch = useDispatch()
    const [error, setError] = useState(false)
    const [dataError, setDataError] = useState(false)
    const [playerInfo, setPlayerInfo] = useState({})
    const [data, setData] = useState({});
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(link);
                try {
                    setData(response.data);
                    setPlayerInfo(getPlayerInfo(response.data));

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

    useEffect(() => {
        if(Object.keys(playerInfo).length > 0) {
            document.title = `Aviary | ${playerInfo.label}`
            dispatch(setItem(playerInfo.firstVideo));
        }
        
    }, [playerInfo])

    if (isFetching) return <div style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '1rem' }} className="px-4 py-2 pb-4">{mainLoader()}</div>;
    if (error) return <span data-testid='loading'>Error loading data</span>;
    if (dataError) return <span data-testid='struct'>Struct is not Correct</span>;

    return (
        <div style={{ minHeight: '100vh', width: '100%' }} className="min-h-screen w-full">
            <div style={{ minHeight: '100vh', display: 'flex', background: 'white', flexWrap: 'wrap' }} className="xl:flex md:block bg-white min-h-screen flex-wrap">
                <div style={{ width: '100%' }} className="w-full lg:w-full xl:w-2/3">
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} id="player_desc" className="w-full flex flex-col justify-between h-full">
                        <Player data={data} />
                        <div className="">
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.75rem', marginRight: '0.75rem', paddingBottom: '0.75rem', paddingTop: '0.75rem', paddingLeft: '1.25rem', paddingRight: '1.25rem', borderTopWidth: '1px' }} className='flex items-center space-x-3 py-3 px-5 border-t'>
                                <p style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}

                                    className="text-sm"
                                >
                                    About the Provider:
                                </p>
                                <div className=''>
                                    <div style={{ display: 'flex', alignItems: 'center' }} className='flex items-center'>
                                        <a href={playerInfo.pageLink}>
                                            <img alt='' style={{ objectFit: 'contain', width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} className=' object-contain w-5 h-5 mr-2' src={playerInfo.logoImage} />
                                        </a>
                                        <div>
                                            {playerInfo.logoInformation.map(({ id, label, homepage }) => (
                                                <div key={"provider-" + label.en}>
                                                    <p style={{ fontWeight: 'bold', fontSize: '0.875rem', lineHeight: '1.25rem' }} className='font-bold text-sm'>{label.en}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RootPlay
