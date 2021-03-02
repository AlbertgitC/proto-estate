import defaultImg from '../images/home-1294564_640.jpg';
import config from '../aws-exports';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config
// const urlPrefix = `http://localhost:20005/${bucket}/public/`;
const urlPrefix = `https://${bucket}.s3.${region}.amazonaws.com/public/`;

function ListingItem(props) {
    const { listing } = props;
    const imgWrapper = useRef(null);
    // live site url
    // const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${listing.photos[0]}`;

    // mock storage url
    // const url = `http://localhost:20005/${bucket}/public/${listing.photos[0]}`;

    let touchX;
    let touchEnd = true;
    let scrollEnd = true;

    function handleTouch(e) {
        if (listing.photos.length < 2) return;
        touchX = e.changedTouches[0].clientX;
        touchEnd = false;
    };

    function setIdx(e) {
        if (listing.photos.length < 2) return;
        let imgWidth = imgWrapper.current.scrollWidth / listing.photos.length;
        touchEnd = true;
        let distance = touchX - e.changedTouches[0].clientX;

        if (scrollEnd) {
            let curPos = imgWrapper.current.scrollLeft;
            let carry;
            if (distance < 0) {
                carry = (curPos % imgWidth / imgWidth) > 0.85 ? imgWidth : 0;
            } else {
                carry = (curPos % imgWidth / imgWidth) > 0.15 ? imgWidth : 0;
            }
            let nextPos = Math.floor(curPos / imgWidth) * imgWidth + carry;
            
            imgWrapper.current.scrollTo({
                top: 0,
                left: nextPos,
                behavior: 'smooth'
            });
        };
    };

    let timer = null;
    function drag() {
        if (listing.photos.length < 2) return;
        scrollEnd = false;
        let imgWidth = imgWrapper.current.scrollWidth / listing.photos.length;
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            scrollEnd = true;
            if (touchEnd) {
                let curPos = imgWrapper.current.scrollLeft;
                let carry = (curPos % imgWidth / imgWidth) > 0.5 ? imgWidth : 0;
                let nextPos = Math.floor(curPos / imgWidth) * imgWidth + carry;
                imgWrapper.current.scrollTo({
                    top: 0,
                    left: nextPos,
                    behavior: 'smooth'
                });
            };
        }, 150);
    };

    function clickForward() {
        let imgWidth = imgWrapper.current.scrollWidth / listing.photos.length;
        let curPos = imgWrapper.current.scrollLeft;
        let lastPos = imgWrapper.current.scrollWidth - imgWidth;
        let carry = (curPos % imgWidth / imgWidth) > 0.5 ? imgWidth : 0;
        let nextPos = Math.floor(curPos / imgWidth) * imgWidth + carry;
        if (lastPos - curPos < imgWidth*0.01) {
            imgWrapper.current.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        } else {
            imgWrapper.current.scrollTo({
                top: 0,
                left: nextPos + imgWidth,
                behavior: 'smooth'
            });
        };
    };

    function clickBackward() {
        let imgWidth = imgWrapper.current.scrollWidth / listing.photos.length;
        let curPos = imgWrapper.current.scrollLeft;
        let lastPos = imgWrapper.current.scrollWidth - imgWidth;
        let carry = (curPos % imgWidth / imgWidth) > 0.5 ? imgWidth : 0;
        let nextPos = Math.floor(curPos / imgWidth) * imgWidth + carry;
        if (curPos < imgWidth * 0.01) {
            imgWrapper.current.scrollTo({
                top: 0,
                left: lastPos,
                behavior: 'smooth'
            });
        } else {
            imgWrapper.current.scrollTo({
                top: 0,
                left: nextPos - imgWidth,
                behavior: 'smooth'
            });
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
            <div 
                className="listing-item__image-wrapper"
                ref={imgWrapper}
                onTouchStart={handleTouch}
                onTouchEnd={setIdx}
                onScroll={drag}
            >   
                {
                    listing.photos.length > 1 ? listing.photos.map((img, i) => {
                        return(
                            <div
                                key={i}
                                className="listing-item__image" 
                                style={{ backgroundImage: `url(${urlPrefix}${img})` }}
                            >
                                <div className="listing-item__tag">New</div>
                            </div>
                        );
                    }) : <div className="listing-item__image" style={{ backgroundImage: `url(${
                            listing.photos[0] ? urlPrefix + listing.photos[0] : defaultImg
                        })` }}>
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