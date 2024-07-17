import React,{useState, useEffect} from "react";
import axios from 'axios';

const Login = ({ service, setAuth, skipAuth }) => {
    const [failureMsg, setFailureMsg] = useState("");
    const [newTab, setNewTab] = useState(null);

   
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('service',service.service[0].id)

        const tab = window.open(service.service[0].id+'?origin='+window.location.origin.toString(), '_blank');
        setNewTab(tab);
        const checkTabClosed = setInterval(() => {
            if (tab.closed) {
              console.log('Tab closed');
              clearInterval(checkTabClosed); // Stop the interval
              setNewTab(null); // Reset the state
              axios.get(service.service[0].service[0].id+'?origin='+window.location.origin.toString(), { withCredentials: true });
            }
        }, 1000); // Check every second
        
    }

    const handleSkip = (e) => {
        e.preventDefault();
        skipAuth(true);
    }

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
    )
}

export default Login;
