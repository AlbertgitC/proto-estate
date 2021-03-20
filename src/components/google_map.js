import { useRef, useEffect, useState } from 'react';
import ListingItemMini from './listing_item_mini';

function GoogleMap(props) {
    const { listings, display } = props;
    const [selectedListing, setListing] = useState({ listing: null, animation: "" });
    const gMap = useRef(null);

    useEffect(() => {
        if (display === "none") return;

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

            let marker = new window.google.maps.Marker({
                // icon: icon,
                position: pos,
                label: {
                    text: `$${rent}`,
                    // color: "white"
                },
                map: map
            });

            marker.addListener("click", () => {
                setListing({ listing: listing, animation: "listing-mini--show" });
            });

            return marker;
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
    }, [listings, display]);

    if (display === "none") return null;

    function removeListing() {
        if (selectedListing.listing === null) return;
        setListing({ ...selectedListing, animation: "listing-mini--hide" });
        setTimeout(() => {
            setListing({ listing: null, animation: "" });
        }, 400);
    };

    return (
        <div className="google-map">
            <ListingItemMini listing={selectedListing.listing} animation={selectedListing.animation} />
            <div ref={gMap} className="google-map__map" onClick={removeListing} />
        </div>
    );
};

export default GoogleMap;