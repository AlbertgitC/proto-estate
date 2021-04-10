import { useRef, useEffect, useState } from 'react';
import ListingItemMini from './listing_item_mini';
import React from 'react';
import { useHistory } from 'react-router-dom';

const GoogleMap = React.memo(function CreateGoogleMap(props) {
    const { listings, mode, oneListing, setSelectedId, extendMobileMap } = props;
    const [markers, setMarkers] = useState([]);
    const [selectedListing, setListing] = useState({ listing: null, animation: "" });
    const gMap = useRef(null);
    const history = useHistory();

    useEffect(() => {
        if (!gMap.current) return;

        setListing({ listing: null, animation: "" });

        function createMap(options) {
            return new window.google.maps.Map(gMap.current, options);
        };

        /* centering Taipei City by default, should change to user's location later */
        const defaultPos = { lat: 25.0330, lng: 121.5654 };
        const options = {
            zoom: 13,
            maxZoom: 16,
            center: defaultPos,
            disableDefaultUI: true,
            clickableIcons: false
        };

        function createMarker(map, listing) {
            let pos = JSON.parse(listing.geometry);
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

        function drawMap() {
            let map = createMap(options);
            if (listings && listings[0]) {
                const bounds = new window.google.maps.LatLngBounds();
                let newMarkers = [];
                for (let listing of listings) {
                    let pos = JSON.parse(listing.geometry);
                    newMarkers.push(createMarker(map, listing));
                    bounds.extend(pos);
                };
                map.fitBounds(bounds);
                setMarkers(newMarkers);
            } else if (oneListing) {
                let pos = JSON.parse(oneListing.geometry);
                let marker = createMarker(map, oneListing);
                setMarkers([marker]);
                map.setCenter(pos);
                map.setZoom(16);
            };
        };

        if (window.google) {
            drawMap();
        } else {
            const googleScript = document.getElementById("google-api");
            googleScript.addEventListener('load', () => {
                drawMap();
            });
        };
    }, [listings, oneListing]);

    function removeListing() {
        if (selectedListing.listing === null) return;
        setListing({ ...selectedListing, animation: "listing-mini--hide" });
        setTimeout(() => {
            setListing({ listing: null, animation: "" });
        }, 400);
    };

    /* add event listener to markers */
    useEffect(() => {
        if (markers[0]) {
            for (let i = 0; i < markers.length; i++) {
                window.google.maps.event.clearInstanceListeners(markers[i]);
                if (mode === "mobile") {
                    markers[i].addListener("click", () => {
                        if (selectedListing.listing && selectedListing.listing.id === listings[i].id) {
                            history.push(`/rental-listings/${listings[i].id}`);
                        } else {
                            setListing({ listing: listings[i], animation: "listing-mini--show" });
                        };
                    });
                } else if (mode === "desktop") {
                    markers[i].addListener("click", () => {
                        setSelectedId(listings[i].id);
                    });
                } else if (mode === "mobileSingle") {
                    markers[i].addListener("click", () => {
                        extendMobileMap();
                    });
                };
            };
        };
    }, [markers, selectedListing.listing, history, mode, listings, setSelectedId, extendMobileMap]);

    return (
        <div className="google-map" onClick={removeListing}>
            <div ref={gMap} className="google-map__map" />
            {
                selectedListing.listing ?
                    <ListingItemMini listing={selectedListing.listing} animation={selectedListing.animation} />
                    : null
            }
        </div>
    );
});

export default GoogleMap;