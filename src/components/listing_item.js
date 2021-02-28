import defaultImg from '../images/home-1294564_640.jpg';
import config from '../aws-exports';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config
const urlPrefix = `http://localhost:20005/${bucket}/public/`;

function ListingItem(props) {
    // const [imgSet, setImgSet] = useState([]);
    // const [imgSelect, setImg] = useState("");
    const { listing } = props;
    const imgContainer = useRef(null);
    // live site url
    // const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${listing.postPhoto}`;

    // mock storage url
    // const url = `http://localhost:20005/${bucket}/public/${listing.postPhoto}`;
    // let imgUrl = listing.postPhoto ? `http://localhost:20005/${bucket}/public/${listing.postPhoto}` : defaultImg;

    // useEffect(() => {
        // console.log(imgContainer.current.scrollWidth / listing.photos.length)
        // if (listing.photos.length < 2) {
        //     let url = listing.photos[0] ? `${urlPrefix}${listing.photos[0]}`
        //         : defaultImg;
        //     setImgSet([{ idx: null, url: url }]);
        // } else {
        //     makeSet(0);
        // };
    // }, []);

    // useEffect(() => {
    //     let inc = imgContainer.current.scrollWidth / 3;
    //     imgContainer.current.scrollLeft = inc;
    // }, [imgSet]);

    // function makeSet(i) {
        // if (!listing.photos || listing.photos.length === 0) {
        //     let url = listing.photos[0] ? `${urlPrefix}${listing.photos[0]}`
        //         : defaultImg;
        //     setImgSet([url, url, url]);
        //     return;
        // };
    //     let prevImg = i === 0 ? { idx: listing.photos.length - 1, url: `${urlPrefix}${listing.photos[listing.photos.length - 1]}` }
    //         : { idx: i - 1, url: `${urlPrefix}${listing.photos[i - 1]}` };

    //     let currentImg = { idx: i, url: `${urlPrefix}${listing.photos[i]}` };

    //     let nextImg = i === listing.photos.length - 1 ? { idx: 0, url: `${urlPrefix}${listing.photos[0]}` }
    //         : { idx: i + 1, url: `${urlPrefix}${listing.photos[i + 1]}` };

    //     setImgSet([prevImg, currentImg, nextImg]);
    // };

    let touchX;
    // let idx = 0;
    let touchEnd = true;
    let scrollEnd = true;

    function handleTouch(e) {
        if (listing.photos.length < 2) return;
        touchX = e.changedTouches[0].clientX;
        touchEnd = false;
    };

    function setIdx(e) {
        if (listing.photos.length < 2) return;
        let imgWidth = imgContainer.current.scrollWidth / listing.photos.length;
        // let totalWidth = imgContainer.current.scrollWidth;
        touchEnd = true;
        let distance = touchX - e.changedTouches[0].clientX;
        // if (distance === 0) {
        //     imgContainer.current.scrollTo({
        //         top: 0,
        //         left: imgWidth,
        //         behavior: 'smooth'
        //     });
        // } else 
        // if (distance < 0 && idx !== 0) {
        //     idx--;
            // imgContainer.current.scrollTo({
            //     top: 0,
            //     left: idx * imgWidth,
            //     behavior: 'smooth'
            // });
            // setTimeout(() => {makeSet(imgSet[0].idx)}, 350);
            // makeSet(imgSet[0].idx);
        // } else if (distance > 0 && idx !== listing.photos.length - 1) {
        //     idx++;
            // imgContainer.current.scrollTo({
            //     top: 0,
            //     left: idx * imgWidth,
            //     behavior: 'smooth'
            // });
            // setTimeout(() => {makeSet(imgSet[2].idx)}, 350);
            // makeSet(imgSet[2].idx);
        // };

        if (scrollEnd) {
            let curPos = imgContainer.current.scrollLeft;
            let carry;
            if (distance < 0) {
                carry = (curPos % imgWidth / imgWidth) > 0.85 ? imgWidth : 0;
            } else {
                carry = (curPos % imgWidth / imgWidth) > 0.15 ? imgWidth : 0;
            }
            let nextPos = Math.floor(curPos / imgWidth) * imgWidth + carry;
            
            imgContainer.current.scrollTo({
                top: 0,
                left: nextPos,
                behavior: 'smooth'
            });
        };
        

        // console.log(idx)

        // imgContainer.current.scrollTo({
        //     top: 0,
        //     left: imgContainer.current.scrollWidth,
        //     behavior: 'smooth'
        // });
    };
    let timer = null;
    function drag() {
        if (listing.photos.length < 2) return;
        scrollEnd = false;
        let imgWidth = imgContainer.current.scrollWidth / listing.photos.length;
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            scrollEnd = true;
            if (touchEnd) {
                let curPos = imgContainer.current.scrollLeft;
                let carry = (curPos % imgWidth / imgWidth) > 0.5 ? imgWidth : 0;
                let nextPos = Math.floor(curPos / imgWidth) * imgWidth + carry;
                console.log(nextPos)
                imgContainer.current.scrollTo({
                    top: 0,
                    left: nextPos,
                    behavior: 'smooth'
                });
            };
        }, 150);
    };

    // function drag(e) {
    //     // e.preventDefault();
    //     // console.log(e.changedTouches[0].clientX)
    //     console.log(touchX)
    //     if (touchX || touchX === 0) {
    //         let inc = touchX - e.changedTouches[0].clientX;
    //         let s = Math.sign(inc);
    //         console.log(inc)
    //         imgContainer.current.scrollLeft += s;
    //     };
    //         // _C.style.setProperty('--tx', `${Math.round(unify(e).clientX - x0)}px`)
    //     // touchX = null
        
    // };

    return (
        <li className="listing-item">
            <div 
                className="listing-item__image-container"
                ref={imgContainer}
                onTouchStart={handleTouch}
                onTouchEnd={setIdx}
                onScroll={drag}
            >
                {
                    listing.photos[0] ? listing.photos.map((img, i) => {
                        return(
                            <div
                                key={i}
                                className="listing-item__image" 
                                style={{ backgroundImage: `url(${urlPrefix}${img})` }}
                            >
                                <div className="listing-item__tag">New</div>
                            </div>
                        );
                    }) : <div className="listing-item__image" style={{ backgroundImage: `url(${defaultImg})` }}>
                            <div className="listing-item__tag">New</div>
                        </div>
                }
            </div>
            {/* <div className="listing-item__image" style={{ 
                backgroundImage: `url(${imgUrl})` }}>
                <div className="listing-item__tag">New</div>
                <div>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </div> */}
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