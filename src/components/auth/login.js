import React,{useState, useEffect} from "react";
import axios from 'axios';

const Login = ({ service, setAuth, skipAuth }) => {
    const [failureMsg, setFailureMsg] = useState("");
    const [newTab, setNewTab] = useState(null);

    const handleTabClose = () => {
        // Handle tab close event here
        console.log('close',newTab)
        console.log('service',service.service[0]['@id'])
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('service',service)

        const tab = window.open(service['@id']+'?origin='+window.location.origin.toString(), '_blank');
        setNewTab(tab);
        const checkTabClosed = setInterval(() => {
            if (tab.closed) {
              console.log('Tab closed');
              clearInterval(checkTabClosed); // Stop the interval
              setNewTab(null); // Reset the state
              const iframe = document.createElement('iframe');
              iframe.src = service.service[0]['@id']+'?origin='+window.location.origin.toString();
              iframe.style.width = '600px';
              iframe.style.height = '400px';
              iframe.style.border = '1px solid black';
              document.body.appendChild(iframe);
              iframe.onload = () => {
                // Access the iframe's document
                const iframeDocument = iframe.contentWindow.document;
          
                // Get the content of the iframe
                const content = iframeDocument.body.innerHTML;
                setIframeContent(content);
                console.log('content',content)
                // Optionally, you can remove the iframe from the DOM
                // document.body.removeChild(iframe);
              };
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
