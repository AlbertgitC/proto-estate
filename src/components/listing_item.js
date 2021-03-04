import defaultImg from '../images/home-1294564_640.jpg';
import config from '../aws-exports';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, useEffect } from 'react';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket,
    aws_appsync_graphqlEndpoint: endpoint
} = config

let urlPrefix;
if (endpoint.includes("20002/graphql")) {
    urlPrefix = `http://localhost:20005/${bucket}/public/`;
} else {
    urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/public/`;
};

function ListingItem(props) {
    const { listing } = props;
    const imgWrapper = useRef({ scrollWidth: null });
    const [swipeState, setSwipeState] = useState({ idx: 0, tx: 0, touchX: null, imgWidth: 0 });
    useEffect(() => {
        if (imgWrapper.current) setSwipeState(s => ({ 
            ...s, 
            imgWidth: imgWrapper.current.scrollWidth / listing.photos.length 
        }));
    }, [imgWrapper.current.scrollWidth, listing]);

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
        
        setSwipeState({ ...swipeState, tx: Math.round(e.changedTouches[0].clientX - swipeState.touchX)});
    };

    function clickForward() {
        if (swipeState.idx === listing.photos.length - 1) {
            setSwipeState({ ...swipeState, idx: 0 });
        } else {
            setSwipeState({ ...swipeState, idx: swipeState.idx + 1 });
        };
    };

    function clickBackward() {
        if (swipeState.idx === 0) {
            setSwipeState({ ...swipeState, idx: listing.photos.length - 1 });
        } else {
            setSwipeState({ ...swipeState, idx: swipeState.idx - 1 });
        };
    };

    return (
        <li className="listing-item">
            {
                listing.photos.length < 2 ? null :
                    <div className="listing-item__arrow-wrapper">
                        <button
                            className="listing-item__arrow"
                            type="button"
                            onClick={clickBackward}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button
                            className="listing-item__arrow"
                            type="button"
                            onClick={clickForward}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
            }
            {
                listing.photos.length < 2 ? null :
                    <small className="listing-item__img-idx">
                        {`${swipeState.idx + 1}/${listing.photos.length}`}
                    </small>
            }
            <div 
                className="listing-item__image-wrapper"
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
                        return(
                            <div
                                key={i}
                                className="listing-item__image" 
                                style={{ 
                                    backgroundImage: `url(${urlPrefix}${img})`,
                                    width: `${100 / listing.photos.length}%`
                                }}
                            >
                                <div className="listing-item__tag">New</div>
                            </div>
                        );
                    }) : <div 
                            className="listing-item__image" 
                            style={{ 
                                backgroundImage: `url(${listing.photos[0] ? urlPrefix + listing.photos[0] : defaultImg})`
                            }}
                        >
                            <div className="listing-item__tag">New</div>
                        </div>
                }
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