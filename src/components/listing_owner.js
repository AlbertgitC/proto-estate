

export default function OwnerListing(props) {
    const { listing, callBack } = props;
    return (
        <li className="rental-panel__item">
            <div className="rental-panel__img">
                <p>{listing.address}</p>
            </div>
            <button className="rental-panel__button" onClick={callBack}>Edit</button>
        </li>
    );
};