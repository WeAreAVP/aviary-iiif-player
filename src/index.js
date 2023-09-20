import React from 'react'
import { Provider } from 'react-redux';
import './assets/css/main.css'
import './assets/css/videojs.css'
import store from './features/store'
import Main from './main';


export const Metadata = ({ manifest }) => {
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="metadata" />
            </Provider>


        </>
    )
}

export const Player = ({ manifest }) => {
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="player" />
            </Provider>

        </>
    )
}

export const Annotations = ({ manifest }) => {
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="annotation" />
            </Provider>
        </>
    )
}

export const Items = ({ manifest }) => {
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="items" />
            </Provider>
        </>
    )
}

export const AviaryIIIFPlayer = ({ manifest }) => {
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="all" />
            </Provider>

        </>
    )
}
