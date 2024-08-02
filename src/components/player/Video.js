import React, {useEffect, useState, useRef} from "react";
import { useSelector } from "react-redux";
import VideoJS from './VideoJS'
import { videoLoader } from "../../helpers/loaders";
import Login from '../auth/login';
import axios from 'axios';
import DashPlayer from './DashJS'


const Video = () => {
  const [service, setService] = useState({});
  const [probe, setProbe] = useState("");
  const [authUrl, setAuthUrl] = useState("");
  const [resourcesUrl, setResourcesUrl] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [authToken, setAuthToken] = useState({});
  const [skipAuth, setSkipAuth] = useState(false);
  const [loadToken, setLoadToken] = useState(false);
  const iframeRef = useRef(null);
  const [src, setSrc] = useState('');
  const tokenType = "AuthProbeService2"
  let messages = {};
  const messageIds = MessageIdGenerator();

  const carouselID = useSelector(state => state.selectedItem);
  useEffect(() => {
    if(carouselID?.service)
      setService(carouselID?.service[0]);
    if(carouselID?.service[0]?.type == tokenType)
    { 
      setProbe(carouselID?.service[0]?.id)
      setServiceType(carouselID?.service[0]?.type)
      if(carouselID?.service[0]?.service[0] && carouselID?.service[0]?.service[0]?.service[0])
      {
        setAuthUrl(carouselID?.service[0]?.service[0]?.service[0]?.id)
      }
    }
    setResourcesUrl(carouselID.id)
  }, [carouselID])

  useEffect(async() => {
    let res =  await fetchData("");
    if(res?.substitute?.id)
    {
      carouselID.id = res?.substitute?.id
      setResourcesUrl(res?.substitute?.id)
    }

    console.log('res',res)
  }, [skipAuth])

  const [isRange, setIsRange] = useState(false);
  const videoJsOptions = {
    autoplay: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    controls: true,
    responsive: true,
    aspectRatio: '16:9',
    youtube: { autohide: 1, autoplay: false },
    poster: carouselID?.poster,
    sources: [{
      src: carouselID?.id
    }]
  };

  if (carouselID?.format?.includes("audio/")) {
    videoJsOptions.aspectRatio = '1:0';
    videoJsOptions.controlBar = {
      "fullscreenToggle": false,
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = carouselID.format
    videoJsOptions.inactivityTimeout = 0;
  } else if (carouselID?.format?.includes("youtube")) {
    videoJsOptions.controlBar = {
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = 'video/youtube';
  } else if (carouselID?.format?.includes("vimeo")) {
    videoJsOptions.controlBar = {
      'pictureInPictureToggle': false
    };
    videoJsOptions.sources[0].type = 'video/vimeo'
  } else if (carouselID?.format?.includes("application")) {
    videoJsOptions.sources[0].type = carouselID?.format
  }
  else {
    videoJsOptions.sources[0].type = carouselID?.format
  }
  useEffect(() => {
    const url = carouselID.id; // Replace with the URL of the file you want to check
    // Ensure the URL is properly formatted
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.error('Invalid URL format. URL should start with "http://" or "https://".');
      return;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Range': 'bytes=0-999'
      }
    })
    .then(response => {
      if (response.status === 206) {
        const contentRange = response.headers.get('Content-Range');
        if (contentRange) {
          console.log('Byte-range request supported:', contentRange);
        } else {
          console.log('Byte-range request not supported: Content-Range header missing.');
        }
      } else {
        console.log(`Byte-range request not supported: Server responded with status ${response.status}`);
        setIsRange(true)
      }
    })
    .catch(error => {
      console.error('Error making byte-range request:', error.message);
    });

  }, []);


  function receiveMessage(event) {
    console.log("Event received, origin=" + event.origin);
    console.log(JSON.stringify(event.data));

    if (event.data.hasOwnProperty("messageId")) {
        console.log("Received message with id " + event.data.messageId);
        const message = messages[event.data.messageId];

        console.log("Trusted message received, resolving promise");
        message.resolve(event.data);
        delete messages[event.data.messageId];
    }
}

function* MessageIdGenerator() {
    let messageId = 1; // Don't start at 0, it's false-y
    while (true) yield messageId++;
}

function getOrigin(url) {
    let urlHolder = window.location;
    if (url) {
        urlHolder = document.createElement('a');
        urlHolder.href = url;
    }
    return urlHolder.protocol + "//" + urlHolder.hostname + (urlHolder.port ? ':' + urlHolder.port : '');
}

function openTokenService() {
    return new Promise((resolve, reject) => {
        const serviceOrigin = getOrigin(carouselID?.id);
        const messageId = messageIds.next().value;
        messages[messageId] = {
            resolve: resolve,
            reject: reject,
            serviceOrigin: serviceOrigin
        };

        const tokenUrl = authUrl + '?origin=' + window.location.origin.toString()+ `&messageId=${messageId}`;
        document.getElementById("commsFrame").src = tokenUrl;

        const postMessageTimeout = 5000;
        setTimeout(() => {
            if (messages[messageId]) {
                console.log("Message unhandled after timeout, rejecting");
                messages[messageId].reject(
                    "Message unhandled after " + postMessageTimeout + "ms, rejecting"
                );
                delete messages[messageId];
            }
        }, postMessageTimeout);

    });
}

const fetchData = async (access_token) => {
  try {
    const token = access_token;
    const response = await axios.get(probe, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
};

useEffect(() => {
    // Event listener for messages from the iframe
    window.addEventListener('message', receiveMessage, false);
    // Function to handle iframe load and trigger the message
    const handleIframeLoad = () => {
        openTokenService()
            .then(async (data)=> {
                console.log('Token service resolved:', data);
                let iframeCur = iframeRef.current;
                // Cleanup event listeners on unmount
                window.removeEventListener('message', receiveMessage);
                iframeCur.removeEventListener('load', handleIframeLoad);
                await fetchData(data.accessToken);
                setAuthToken({
                    'access-token': data.accessToken,
                    'expires-in': data.expiresIn,
                });
            })
            .catch(error => {
                console.error('Token service rejected:', error);
            });
    };

    // Set up load event listener on the iframe
    const iframe = iframeRef.current;
    if (iframe) {
        iframe.addEventListener('load', handleIframeLoad);
    }

    // Cleanup event listeners on unmount
    return () => {
        window.removeEventListener('message', receiveMessage);
        if (iframe) {
            iframe.removeEventListener('load', handleIframeLoad);
        }
    };
}, [loadToken]);

  return (<div>
    <iframe
                id="commsFrame"
                width="0px"
                height="0px"
                src={src}
                ref={iframeRef}
            ></iframe>
    {service && Object.keys(authToken).length === 0 && skipAuth === false ? <Login service={service} setAuth={setAuthToken} skipAuth={setSkipAuth} setIframeSrc={setSrc} setIframeLoadToken={setLoadToken} /> :
    <div className={carouselID?.format?.includes("audio/") ? "sticky_div" : "" } >
      {isRange ? <div className="text-danger">Byte-range request not supported</div> : ""}
      <div key={carouselID?.id}>
        {
          carouselID?.id ? ( serviceType === tokenType ? (<DashPlayer url={resourcesUrl} carouselID={carouselID} />):(<VideoJS options={videoJsOptions} auth={authToken} />) ):( <div className=""><h5 className="pl-4">No Media Found</h5></div>)
        }
      </div>
       
    </div>}
    </div>
  );
};

export default Video;
