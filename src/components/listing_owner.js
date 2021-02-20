import defaultImg from '../images/home-1294564_640.jpg';
import config from '../aws-exports';

const {
    aws_user_files_s3_bucket: bucket
} = config

export default function OwnerListing(props) {
    const { listing, callBack } = props;

    let imgUrl = listing.postPhoto ? `http://localhost:20005/${bucket}/public/${listing.postPhoto}` : defaultImg;

    return (
        <li className="rental-panel__item">
            <div className="rental-panel__img" style={{
                backgroundImage: `url(${imgUrl}), linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))`
            }}>
                <p>{listing.address}</p>
            </div>
            <button className="rental-panel__button" onClick={callBack}>Edit</button>
        </li>
    );
};