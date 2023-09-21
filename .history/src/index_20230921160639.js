import React from 'react'
import { Provider } from 'react-redux';
import './assets/css/main.css'
import './assets/css/videojs.css'
import store from './features/store'
import Main from './main';


export const Metadata = ({ manifest }) => {
    console.log("here 1")
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="metadata" />
            </Provider>


        </>
    )
}

export const Player = ({ manifest }) => {
    console.log("here 2")
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="player" />
            </Provider>

        </>
    )
}

export const Annotations = ({ manifest }) => {
    console.log("here 3")
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="annotation" />
            </Provider>
        </>
    )
}

export const Items = ({ manifest }) => {
    console.log("here 4")
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} component="items" />
            </Provider>
        </>
    )
}

export const AviaryIIIFPlayer = ({ manifest, tab }) => {
    console.log("here 5")
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} tab={tab} component="all" />
            </Provider>

        </>
    )
}
