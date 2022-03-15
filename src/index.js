import React from 'react'
import RootPlay from './components/player/RootPlay';
import RootDesc from './components/metadata/RootDesc';
import { Provider } from 'react-redux';
// import { store } from './store';
import RootCar from './components/items/RootCar';
import RootTrans from './components/annotations/RootTrans';
import './assets/css/main.css'
import './assets/css/videojs.css'
import IIIFPlayer from './components/aviary-iiif-player/IIIFPlayer'
import store from './features/store'


export const Metadata = ({ manifest }) => {
    return (
        <>
        <Provider store={store}>
            <RootDesc link={manifest} />
        </Provider>
            

        </>
    )
}

export const Player = ({ manifest }) => {
    return (
        <>
            <Provider store={store}>
                <RootPlay link={manifest} />
            </Provider>

        </>
    )
}

export const Annotations = ({manifest}) => {
    return (
        <>
            <Provider store={store}>
                <RootTrans link={manifest} />
            </Provider>
        </>
    )
}

export const Items = ({manifest}) => {
    return (
        <>
            <Provider store={store}>
                <RootCar link={manifest} />
            </Provider>
        </>
    )
}

export const AviaryIIIFPlayer = ({manifest}) => {
    return(
        <>
            <Provider store={store}>
                <IIIFPlayer manifest={manifest} />
            </Provider>
        
        </>
    )
}