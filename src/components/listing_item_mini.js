import defaultImg from '../images/home-1294564_640.jpg';
import config from '../aws-exports';
import { useRef, useState, useEffect } from 'react';

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

function ListingItemMini(props) {
    const { listing, animation } = props;
    const imgWrapper = useRef({ scrollWidth: null });
    const [swipeState, setSwipeState] = useState({ idx: 0, tx: 0, touchX: null, imgWidth: 0 });
    useEffect(() => {
        if (listing === null) return;
        if (imgWrapper.current && listing.photos[0]) setSwipeState(s => ({
            ...s,
            imgWidth: imgWrapper.current.scrollWidth / listing.photos.length
        }));

        return(() => {
            setSwipeState({ idx: 0, tx: 0, touchX: null, imgWidth: 0 });
        });
    }, [listing]);

    if (listing === null) return null;

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

    return (
        <div className={`listing-mini ${animation}`}>
            <div className="listing-mini__tag">New</div>
            <div className="listing-mini__info">
                {
                    listing.photos.length < 2 ? null :
                        <small className="listing-mini__img-idx">
                            {`${swipeState.idx + 1}/${listing.photos.length}`}
                        </small>
                }
                <p>
                    <span className="listing-mini__price">{listing.monthlyRent}</span>元/月，
                {listing.numberRooms}房 {listing.areaPin ? `${listing.areaPin}坪` : ""}<br />
                    {listing.address}
                </p>
            </div>
            <div
                className="listing-mini__image-wrapper"
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
                                className="listing-mini__image"
                                style={{
                                    backgroundImage: `url(${urlPrefix}${img})`,
                                    width: `${100 / listing.photos.length}%`
                                }}
                            >
                            </div>
                        );
                    }) : <div
                            className="listing-mini__image"
                            style={{
                                backgroundImage: `url(${listing.photos[0] ? urlPrefix + listing.photos[0] : defaultImg})`
                            }}
                        />
                }
            </div>
        </div>
    );
};

export default ListingItemMini;