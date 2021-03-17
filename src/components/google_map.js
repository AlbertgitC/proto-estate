import { useRef, useEffect } from 'react';

function GoogleMap(props) {
    const { listings } = props;
    const gMap = useRef(null);

    useEffect(() => {
        function createMap(options) {
            return new window.google.maps.Map(gMap.current, options);
        };

        /* centering Taipei City by default */
        const defaultPos = { lat: 25.0330, lng: 121.5654 };
        const options = {
            zoom: 13,
            center: defaultPos,
            disableDefaultUI: true
        };

        function createMarker(map, pos, listing) {
            let rent = listing.monthlyRent;
            if (rent > 9999) {
                let num = (rent / 10000).toFixed(1).toString();
                if (num[num.length - 1] === "0") num = num.slice(0, num.length - 2);
                rent = `${num}萬`;
            } else {
                let num = (rent / 1000).toFixed(1).toString();
                if (num[num.length - 1] === "0") num = num.slice(0, num.length - 2);
                rent = `${num}千`;
            };
            return new window.google.maps.Marker({
                // icon: icon,
                position: pos,
                label: {
                    text: `$${rent}`,
                    // color: "white"
                },
                map: map
            });
        };

        function drawMap(options) {
            const googleMap = createMap(options);
            if (listings[0]) {
                const bounds = new window.google.maps.LatLngBounds();
                for (let listing of listings) {
                    let pos = JSON.parse(listing.geometry);
                    createMarker(googleMap, pos, listing);
                    bounds.extend(pos);
                };
                googleMap.fitBounds(bounds);
            };
        };

        if (window.google) {
            drawMap(options);
        } else {
            const googleScript = document.getElementById("google-api");
            googleScript.addEventListener('load', () => {
                drawMap(options);
            });
        };
    }, [listings]);

    return (
        <div ref={gMap} className="google-map">

        </div>
    );
};

export default GoogleMap;