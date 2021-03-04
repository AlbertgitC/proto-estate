import defaultImg from '../images/home-1294564_640.jpg';
import config from '../aws-exports';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket,
    aws_appsync_apiKey: apiKey
} = config

let urlPrefix;
if (false) {
    urlPrefix = `http://localhost:20005/${bucket}/public/`;
} else {
    urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/public/`;
};

export default function OwnerListing(props) {
    const { listing, callBack } = props;
    let imgUrl = listing.photos[0] ? `${urlPrefix}${listing.photos[0]}` : defaultImg;

    return (
        <li className="rental-panel__item">
            <div className="rental-panel__img" style={{
                backgroundImage: `url(${imgUrl}), linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))`
            }}>
                <p>{listing.address}</p>
            </div>
            <div className="rental-panel__options">
                <button className="rental-panel__button" onClick={callBack}>Edit</button>
            </div>
        </li>
    );
};