import { useState, useEffect } from 'react';

export default function OwnerListing(props) {
    const [imgLink, setLink] = useState("");
    const { listing, callBack } = props;

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed && !listing.postPhoto) {
            import("../images/home-1294564_640.jpg")
                .then(res => {
                    setLink(res.default);
                });
        } else if (isSubscribed && listing.postPhoto) {
            setLink(listing.postPhoto);
        };
        return () => (isSubscribed = false);
    }, [listing]);

    return (
        <li className="rental-panel__item">
            <div className="rental-panel__img" style={{
                backgroundImage: `url(${imgLink}), linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))`
            }}>
                <p>{listing.address}</p>
            </div>
            <button className="rental-panel__button" onClick={callBack}>Edit</button>
        </li>
    );
};