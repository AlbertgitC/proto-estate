import { useState, useEffect } from 'react';

function ListingItem(props) {
    const [imgLink, setLink] = useState("");
    const { listing, imgFile } = props;

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            import(`../images/${imgFile}`)
                .then(res => {
                    setLink(res.default);
                });
        };
        return () => (isSubscribed = false);
    }, [imgFile]);

    return (
        <li className="listing-item">
            <div className="listing-item__image" style={{ backgroundImage: `url(${imgLink})` }}>
                <div className="listing-item__tag">New</div>
            </div>
            <div className="listing-item__info">
                <p>
                    <span className="listing-item__price">{listing.monthlyRent}</span> 元/月<br />
                    {listing.numberRooms}房 {listing.areaPin}坪<br />
                    {listing.address}
                </p>
            </div>
        </li>
    );
};

export default ListingItem;