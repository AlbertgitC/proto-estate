import { useRef, useEffect } from 'react';

function GoogleMap() {
    const gMap = useRef(null);

    useEffect(() => {
        const options = {
            zoom: 16,
            center: {
                lat: 43.642567,
                lng: -79.387054,
            },
            disableDefaultUI: true
        };
        new window.google.maps.Map(gMap.current, options);
    }, []);

    return (
        <div ref={gMap} className="google-map">

        </div>
    );
};

export default GoogleMap;