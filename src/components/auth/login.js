import React, { useState, useEffect, useRef } from "react";

const Login = ({ service, setAuth, skipAuth, setIframeSrc, setIframeLoadToken }) => {
    const [failureMsg, setFailureMsg] = useState("");
    const [newTab, setNewTab] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        let request_service = service;

        if (request_service?.service) {
            request_service = request_service.service;
        }
        if (request_service.length > 0) {
            request_service = request_service[0];
        }
        let id = request_service.id;
        if (service["@id"]) {
            id = service["@id"];
        }

        const tab = window.open(id + '?origin=' + window.location.origin.toString(), '_blank');
        setNewTab(tab);
        const checkTabClosed = setInterval(() => {
            if (tab.closed) {
                console.log('Tab closed');

                clearInterval(checkTabClosed); // Stop the interval
                setNewTab(null); // Reset the state
                let iid = "";
                if (request_service?.service) {
                    iid = request_service.service[0].id;
                } else {
                    iid = service.service[0]["@id"];
                }
                setIframeSrc(iid + '?origin=' + window.location.origin.toString());
                setIframeLoadToken(true)
            }
        }, 1000); // Check every second
    };

    const handleSkip = (e) => {
        e.preventDefault();
        skipAuth(true);
    };
    return (
        <div className='login-form-holder'>
            <div className='login-form'>
                <h2>{(service.header) ? service.header : 'Please Login'}</h2>
                <p>{(service.description) ? service.description : ''}</p>
                <span className="error-message">{failureMsg}</span>
                <form>
                    <button className='login-button p-3' onClick={handleSubmit}>{(service.confirmLabel) ? service.confirmLabel : 'Login'}</button>
                    <button className='skip-button p-3' onClick={handleSkip}>Skip</button>
                </form>
            </div>
           
        </div>
    );
};

export default Login;