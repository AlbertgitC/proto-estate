import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { API } from 'aws-amplify';
import * as queries from '../graphql/queries';
import defaultImg from '../images/home-1294564_640.jpg';
import config from '../aws-exports';
import ErrBoundary from '../util/error_boundary';
import GoogleMap from './google_map';
import PhotoGallery from './photo_gallery';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config

let urlPrefix;
if (process.env.NODE_ENV === "development") {
    urlPrefix = `http://localhost:20005/${bucket}/public/`;
} else {
    urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/public/`;
};

function RentalListing() {
    const { listingId } = useParams();
    const publicRentalListings = useSelector(state => state.publicRentalListings);
    const [listing, setListing] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const imgWrapper = useRef(null);
    const [swipeState, setSwipeState] = useState({ idx: 0, tx: 0, touchX: null, imgWidth: 0 });
    const [mapModal, setMapModal] = useState("");

    useEffect(() => {
        let curListing = null;
        for (let listing of publicRentalListings.listings) {
            if (listing.id === listingId) curListing = listing;
        };
        if (!curListing) {
            API.graphql({
                query: queries.getRentalListing,
                authMode: "AWS_IAM",
                variables: {
                    id: listingId
                }
            })
                .then(res => {
                    let listing = res.data.getRentalListing;
                    setListing(listing);
                    setLoading(false);
                    if (listing && listing.photos[0]) {
                        let photos = [];
                        for (let photo of listing.photos) {
                            photos.push(urlPrefix + photo);
                        };
                        setPhotos(photos);
                    };
                })
                .catch(err => {
                    console.log("fetch rental listing error:", err);
                    setLoading(false);
                });
        } else {
            setListing(curListing);
            setLoading(false);
            if (curListing.photos[0]) {
                let photos = [];
                for (let photo of curListing.photos) {
                    photos.push(urlPrefix + photo);
                };
                setPhotos(photos);
            };
        };
    }, [listingId, publicRentalListings.listings]);

    useEffect(() => {
        if (imgWrapper.current && listing) {
            setSwipeState(s => ({
                ...s,
                imgWidth: imgWrapper.current.scrollWidth / listing.photos.length
            }));
        };
    }, [listing]);

    function handleTouch(e) {
        if (listing.photos.length < 2) return;
        setSwipeState({ ...swipeState, touchX: e.changedTouches[0].clientX });
    };

    function setImg(e) {
        if (listing.photos.length < 2) return;

        let dx = e.changedTouches[0].clientX - swipeState.touchX,
            s = Math.sign(dx),
            f = +(s * dx / swipeState.imgWidth).toFixed(2);

        if ((swipeState.idx > 0 || s < 0) && (swipeState.idx < listing.photos.length - 1 || s > 0) && f > .15) {
            setSwipeState({ ...swipeState, idx: swipeState.idx - s, tx: 0, touchX: null });
        } else if (f <= .15) {
            setSwipeState({ ...swipeState, tx: 0, touchX: null });
        } else {
            if (swipeState.idx - s < 0) {
                setSwipeState({ ...swipeState, idx: 0, tx: 0, touchX: null });
            } else {
                setSwipeState({ ...swipeState, idx: listing.photos.length - 1, tx: 0, touchX: null });
            };
        };
    };

    function drag(e) {
        if (listing.photos.length < 2) return;

        setSwipeState({ ...swipeState, tx: Math.round(e.changedTouches[0].clientX - swipeState.touchX) });
    };

    function parseNum(num) {
        let rentStr = Math.trunc(num).toString();
        let parsed = "";
        let count = 0;
        for (let i = rentStr.length - 1; i >= 0; i--) {
            parsed = rentStr[i] + parsed;
            count++;
            if (count === 3 && i !== 0) {
                parsed = "," + parsed;
                count = 0;
            };
        };
        return parsed;
    };

    // function mapModal() {
    //     console.log("map clicked")
    // };

    if (loading) {
        return (
            <div className="rental-listing">
                <p>讀取中...</p>
            </div>
        );
    } else if (!listing) {
        return (
            <div className="rental-listing">
                <p>資料不存在:(</p>
            </div>
        );
    } else {
        return (
            <div className="rental-listing">
                <div className="rental-listing__image-slide">
                    <div
                        className="rental-listing__image-wrapper"
                        ref={imgWrapper}
                        onTouchStart={handleTouch}
                        onTouchMove={drag}
                        onTouchEnd={setImg}
                        style={{
                            width: `${listing.photos.length > 0 ?
                                listing.photos.length * 100 : 100}%`,
                            transform: `translate(${swipeState.idx * -swipeState.imgWidth + swipeState.tx}px)`
                        }}
                    >
                        {
                            listing.photos.length > 1 ? listing.photos.map((img, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="rental-listing__image"
                                        style={{
                                            backgroundImage: `url(${urlPrefix}${img})`,
                                            width: `${100 / listing.photos.length}%`
                                        }}
                                    />
                                );
                            }) : <div
                                className="rental-listing__image"
                                style={{
                                    backgroundImage: `url(${listing.photos[0] ? urlPrefix + listing.photos[0] : defaultImg})`
                                }}
                            />
                        }
                    </div>
                    <div className="rental-listing__tag">New</div>
                    {
                        listing.photos.length < 2 ? null :
                            <small className="rental-listing__img-idx">
                                {`${swipeState.idx + 1}/${listing.photos.length}`}
                            </small>
                    }
                </div>
                <PhotoGallery photos={photos} />
                <div className="rental-listing__info-wrapper">
                    <div className="rental-listing__info">
                        <p className="rental-listing__details--important">{listing.address}</p>
                        {listing.subAddress ? <p>{listing.subAddress}</p> : null}
                        <div className="rental-listing__details">
                            <div className="rental-listing__detail">
                                <p>
                                    <span className="rental-listing__details--important">
                                        {parseNum(listing.monthlyRent)}
                                    </span> 元/月
                                </p>
                            </div>
                            <div className="rental-listing__detail">
                                <p className="rental-listing__details--important">{listing.numberRooms}房</p>
                            </div>
                            {
                                listing.areaPin ?
                                    <div className="rental-listing__detail">
                                        <p className="rental-listing__details--important">{parseNum(listing.areaPin)}坪</p>
                                    </div>
                                    : null
                            }
                            <div className="rental-listing__detail">
                                <p className="rental-listing__details--important">{listing.propertyType}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rental-listing__map-wrapper" onClick={() => { setMapModal("rental-listing__modal--show"); }}>
                        <ErrBoundary>
                            <GoogleMap
                                oneListing={listing}
                                display={true}
                                mode="desktopSingle"
                            />
                        </ErrBoundary>
                    </div>
                </div>
                <div className="rental-listing__mobile-map-wrapper">
                    <ErrBoundary>
                        <GoogleMap
                            oneListing={listing}
                            display={true}
                            mode="mobileSingle"
                        />
                    </ErrBoundary>
                </div>
                <div className="rental-listing__description">
                    <h2 className="rental-listing__description-header">屋況介紹</h2>
                    <p>{listing.description}</p>
                </div>
                <div className={`rental-listing__modal ${mapModal}`} onClick={() => { setMapModal(""); }}>
                    <div className="rental-listing__modal-map-wrapper" onClick={e => e.stopPropagation()}>
                        <ErrBoundary>
                            <GoogleMap
                                oneListing={listing}
                                display={true}
                                mode="desktopModal"
                            />
                        </ErrBoundary>
                        <button 
                            type="button" 
                            className="rental-listing__modal-close"
                            onClick={() => { setMapModal(""); }}
                        >X</button>
                    </div>
                </div>
            </div>
        );
    };
};

export default RentalListing;