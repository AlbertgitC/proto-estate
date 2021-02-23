import defaultImg from '../images/home-1294564_640.jpg';
import config from '../aws-exports';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config

function ListingItem(props) {
    const { listing } = props;
    // live site url
    // const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${listing.postPhoto}`;

    // mock storage url
    // const url = `http://localhost:20005/${bucket}/public/${listing.postPhoto}`;
    let imgUrl = listing.postPhoto ? `http://localhost:20005/${bucket}/public/${listing.postPhoto}` : defaultImg;

    return (
        <li className="listing-item">
            <div className="listing-item__image" style={{ 
                backgroundImage: `url(${imgUrl})` }}>
                <div className="listing-item__tag">New</div>
            </div>
            <div className="listing-item__info">
                <p>
                    <span className="listing-item__price">{listing.monthlyRent}</span> 元/月<br />
                    {listing.numberRooms}房 {listing.areaPin ? `${listing.areaPin}坪` : ""}<br />
                    {listing.address}
                </p>
            </div>
        </li>
    );
};

export default ListingItem;