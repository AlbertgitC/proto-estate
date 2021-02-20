import defaultImg from '../images/home-1294564_640.jpg';

export default function OwnerListing(props) {
    const { listing, callBack } = props;

    let imgLink = listing.postPhoto ? listing.postPhoto : defaultImg;

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