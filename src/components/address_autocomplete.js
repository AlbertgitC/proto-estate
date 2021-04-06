import { useEffect, useRef } from 'react';

function AddressAutocomplete(props) {
    const { handleAddress, setAdrState, adrState } = props;
    const addressAutoComplete = useRef(null);
    

    useEffect(() => {
        const options = {
            componentRestrictions: { country: "tw" },
            fields: ["address_components", "geometry", "formatted_address"],
            /* set origin to user's current localtion */
            // origin: userLocation,
            strictBounds: false,
            types: ["address"]
        };

        function onPlaceChanged(place) {
            if (!place.geometry) {
                /* user hit enter without picking from the results */
                setAdrState({ ...adrState, msg: "請在選單中選擇地址" });
            } else {
                handleAddress(place);
                setAdrState({ display: "none", msg: `地址: ${place.formatted_address.replace(/^[0-9]*/, "")}` });
            };
        };
        
        function createAutocomplete(options) {
            const autocomplete = new window.google.maps.places.Autocomplete(addressAutoComplete.current, options);
            autocomplete.addListener("place_changed", () => {
                let place = autocomplete.getPlace();
                onPlaceChanged(place);
            });
        };

        if (window.google) {
            createAutocomplete(options);
        } else {
            const googleScript = document.getElementById("google-api");
            googleScript.addEventListener('load', () => {
                createAutocomplete(options);
            });
        };
    }, [handleAddress, adrState, setAdrState]);

    return (
        <input 
            ref={addressAutoComplete} 
            id="address"
            placeholder="輸入地址"
            autoComplete="off"
            style={{ display: `${adrState.display}` }}
        />
    );
};

export default AddressAutocomplete;