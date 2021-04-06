import defaultImg from '../images/home-1294564_640.jpg';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function PhotoGallery(props) {
    const { photos } = props;
    const gallery = useRef(null);
    const [galleryWidth, setWidth] = useState(0);
    const imgsWrapper = useRef(null);
    const [hoverClass, setHoverClass] = useState("");
    const [imgIndex, setImgIndex] = useState({ one: 0, two: 0, three: 0 });

    useEffect(() => {
        function updateWidth() {
            setWidth(gallery.current.clientWidth - 14);
        };
        window.addEventListener('resize', updateWidth);
        updateWidth();
        return () => window.removeEventListener('resize', updateWidth);
    }, [galleryWidth]);

    useEffect(() => {
        let scrollTarget = imgsWrapper.current;

        function horizontalScroll(event) {
            event.preventDefault();
            const toLeft = event.deltaY < 0 && scrollTarget.scrollLeft > 0;
            const toRight = event.deltaY > 0 && scrollTarget.scrollLeft < scrollTarget.scrollWidth - scrollTarget.clientWidth;

            if (toLeft || toRight) {
                scrollTarget.scrollLeft += event.deltaY;
            };
        };

        let imgs = document.getElementsByClassName("photo-gallery__img-small");

        for (let img of imgs) {
            img.addEventListener("mousewheel", horizontalScroll, { passive: false });
        };

        scrollTarget.addEventListener("mousewheel", horizontalScroll, { passive: false });

        return () => {
            scrollTarget.removeEventListener("mousewheel", horizontalScroll);

            for (let img of imgs) {
                img.removeEventListener("mousewheel", horizontalScroll);
            };
        };
    }, []);

    useEffect(() => {
        if (photos.length === 2) {
            setImgIndex({ one: 0, two: 1, three: 0 });
        } else if (photos.length > 2) {
            setImgIndex({ one: 0, two: 1, three: 2 });
        };
    }, [photos]);

    function setIndex(idx) { 
        let maxIdx = photos.length - 1;
        let one = idx;
        let two = idx + 1;
        let three = idx + 2;
        if (one > -1) {
            if (one > maxIdx) {
                one = 0;
                two = 1 > maxIdx ? 0 : 1;
                three = 2 > maxIdx ? 0 : 2;
            } else if (two > maxIdx) {
                two = 0;
                three = 1 > maxIdx ? 0 : 1;
            } else if (three > maxIdx) {
                three = 0;
            };
        } else {
            one = maxIdx;
            three = 1 > maxIdx ? 0 : 1;
        };
        setImgIndex({ one, two, three });
    };

    return (
        <div className="photo-gallery" ref={gallery}>
            <div className="photo-gallery__main">
                <div 
                    className="photo-gallery__main-img"
                    style={{ 
                        width: `${galleryWidth * 0.60975609}px`,
                        height: `${galleryWidth * 0.36585365}px`,
                        backgroundImage: `url(${photos[0] ? photos[imgIndex.one] : defaultImg})`
                    }}
                    onMouseEnter={() => { setHoverClass("photo-gallery__main-img--hover") }}
                    onMouseLeave={() => { setHoverClass("") }}
                >   
                    {
                        photos[0] ?
                            <div className={`photo-gallery__arrow-wrapper ${hoverClass}`}>
                                <button
                                    className="photo-gallery__arrow"
                                    type="button"
                                    style={{ fontSize: `${Math.trunc(galleryWidth * 0.03968253)}px` }}
                                    onClick={() => { setIndex(imgIndex.one - 1) }}
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <button
                                    className="photo-gallery__arrow"
                                    type="button"
                                    style={{ fontSize: `${Math.trunc(galleryWidth * 0.03968253)}px` }}
                                    onClick={() => { setIndex(imgIndex.one + 1) }}
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div> 
                            : null
                    }
                    <p className={`photo-galler__index ${hoverClass}`}>{photos[0] ? `${imgIndex.one + 1}/${photos.length}` : ""}</p>
                </div>
                <div 
                    className="photo-gallery__imgs-wrapper"
                    style={{ width: `${galleryWidth * 0.60975609}px`, height: `${galleryWidth * 0.14631465}px` }}
                    ref={imgsWrapper}
                >
                    {
                        photos[0] ? photos.map((photo, i) => 
                            <div
                                key={i}
                                className="photo-gallery__img-small"
                                style={{ 
                                    minWidth: `${galleryWidth * 0.13228746}px`,
                                    backgroundImage: `url(${photo})`
                                }}
                                onClick={() => { setIndex(i); }}
                            />) :
                            <div
                                className="photo-gallery__img-small"
                                style={{
                                    minWidth: `${galleryWidth * 0.13228746}px`,
                                    backgroundImage: `url(${defaultImg})`
                                }}
                            />
                    }
                </div>
            </div>
            <div className="photo-gallery__side">
                <div
                    className="photo-gallery__2nd-img"
                    style={{ 
                        width: `${galleryWidth * 0.3902439}px`, 
                        height: `${galleryWidth * 0.25609756}px`,
                        backgroundImage: `url(${photos[0] ? photos[imgIndex.two] : defaultImg})`
                    }}
                    onClick={() => { setIndex(imgIndex.two); }}
                />
                <div
                    className="photo-gallery__3rd-img"
                    style={{
                        width: `${galleryWidth * 0.3902439}px`,
                        height: `${galleryWidth * 0.25609756}px`,
                        backgroundImage: `url(${photos[0] ? photos[imgIndex.three] : defaultImg})`
                    }}
                    onClick={() => { setIndex(imgIndex.three); }}
                />
            </div>
        </div>
    );
};

export default PhotoGallery;