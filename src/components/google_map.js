import { useRef, useEffect, useState } from 'react';
import ListingItemMini from './listing_item_mini';
import React from 'react';

const GoogleMap = React.memo(function CreateGoogleMap(props) {
    const { listings, display, mode, oneListing } = props;
    const [selectedListing, setListing] = useState({ listing: null, animation: "" });
    const gMap = useRef(null);
    let defaultMode = mode === "mobileSingle" ? "google-map__map--mobile-single" : "";
    const [modeState, setModeState] = useState(defaultMode);

    useEffect(() => {
        if (!display) return;
        function createMap(options) {
            return new window.google.maps.Map(gMap.current, options);
        };

        /* centering Taipei City by default */
        const defaultPos = { lat: 25.0330, lng: 121.5654 };
        const options = {
            zoom: 13,
            maxZoom: 18,
            center: defaultPos,
            disableDefaultUI: true,
            clickableIcons: false
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

            if (mode === "mobile") {
                marker.addListener("click", (event) => {
                    setListing({ listing: listing, animation: "listing-mini--show" });
                });
            } else if (mode === "desktop") {
                // scroll to listing
            };

            return marker;
        };

        function drawMap(options) {
            const googleMap = createMap(options);
            if (listings && listings[0]) {
                const bounds = new window.google.maps.LatLngBounds();
                for (let listing of listings) {
                    let pos = JSON.parse(listing.geometry);
                    createMarker(googleMap, pos, listing);
                    bounds.extend(pos);
                };
                googleMap.fitBounds(bounds);
            } else if (oneListing) {
                let pos = JSON.parse(oneListing.geometry);
                createMarker(googleMap, pos, oneListing);
                googleMap.setCenter(pos);
                googleMap.setZoom(16);
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
    }, [listings, display, mode]);

    if (!display) return null;

    function removeListing() {
        if (selectedListing.listing === null) return;
        setListing({ ...selectedListing, animation: "listing-mini--hide" });
        setTimeout(() => {
            setListing({ listing: null, animation: "" });
        }, 400);
    };

    function handleClick() {
        if (mode === "mobile") {
            removeListing();
        } else if (mode === "mobileSingle") {
            if (modeState === "google-map__map--mobile-expand") {
                setModeState("google-map__map--mobile-single google-map__map--slideUp");
            } else {
                setModeState("google-map__map--mobile-expand");
            };
        };
    };

    return (
        <div className="google-map" onClick={handleClick}>
            <ListingItemMini listing={selectedListing.listing} animation={selectedListing.animation} />
            <div ref={gMap} className={`google-map__map ${modeState}`} />
        </div>
    );
});

export default GoogleMap;