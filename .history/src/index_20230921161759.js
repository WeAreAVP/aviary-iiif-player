import React from 'react'
import { Provider } from 'react-redux';
import './assets/css/main.css'
import './assets/css/videojs.css'
import store from './features/store'
import Main from './main';
import queryString from 'query-string';


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
    const parsed = queryString.parse(location.search);
    console.log('parsed',parsed);
    return (
        <>
            <Provider store={store}>
                <Main manifest={manifest} tab={parsed.tab} component="all" />
            </Provider>

        </>
    )
}
