import defaultImg from '../images/home-1294564_640.jpg';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function PhotoGallery(props) {
    const { photos } = props;
    const gallery = useRef(null);
    const [galleryWidth, setWidth] = useState(0);
    const imgsWrapper = useRef(null);

    useEffect(() => {
        console.log(galleryWidth)
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

    return (
        <div className="photo-gallery" ref={gallery}>
            <div className="photo-gallery__main">
                <img 
                    className="photo-gallery__main-img" 
                    src={photos[0] ? photos[0] : defaultImg} alt="listing" 
                    style={{ width: `${galleryWidth * 0.60975609}px`, height: `${galleryWidth * 0.36585365}px` }}
                />
                <div className="photo-gallery__arrow-wrapper">
                    <button
                        className="photo-gallery__arrow"
                        type="button"
                        style={{ fontSize: `${Math.trunc(galleryWidth * 0.03968253)}px` }}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                        className="photo-gallery__arrow"
                        type="button"
                        style={{ fontSize: `${Math.trunc(galleryWidth * 0.03968253)}px` }}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <p className="photo-galler__index">{photos[0] ? `1/${photos.length}` : ""}</p>
                <div 
                    className="photo-gallery__imgs-wrapper"
                    style={{ width: `${galleryWidth * 0.60975609}px`, height: `${galleryWidth * 0.14631465}px` }}
                    ref={imgsWrapper}
                >
                    {
                        photos[0] ? photos.map((photo, i) => 
                            <img
                                key={i}
                                className="photo-gallery__img-small"
                                src={photo} alt="listing"
                                style={{ minWidth: `${galleryWidth * 0.13228746}px` }}
                            />) :
                            <img
                                className="photo-gallery__img-small"
                                src={defaultImg} alt="listing"
                                style={{ minWidth: `${galleryWidth * 0.13228746}px` }}
                            />
                    }
                    <img
                        className="photo-gallery__img-small"
                        src={photos[0] ? photos[0] : defaultImg} alt="listing"
                        style={{ minWidth: `${galleryWidth * 0.13228746}px` }}
                    />
                    <img
                        className="photo-gallery__img-small"
                        src={photos[0] ? photos[0] : defaultImg} alt="listing"
                        style={{ minWidth: `${galleryWidth * 0.13228746}px` }}
                    />
                    <img
                        className="photo-gallery__img-small"
                        src={photos[0] ? photos[0] : defaultImg} alt="listing"
                        style={{ minWidth: `${galleryWidth * 0.13228746}px` }}
                    />
                    <img
                        className="photo-gallery__img-small"
                        src={photos[0] ? photos[0] : defaultImg} alt="listing"
                        style={{ minWidth: `${galleryWidth * 0.13228746}px` }}
                    />
                    <img
                        className="photo-gallery__img-small"
                        src={photos[0] ? photos[0] : defaultImg} alt="listing"
                        style={{ minWidth: `${galleryWidth * 0.13228746}px` }}
                    />
                </div>
            </div>
            <div className="photo-gallery__side">
                <img
                    className="photo-gallery__2nd-img"
                    src={photos[0] ? photos[0] : defaultImg}
                    alt="listing"
                    style={{ width: `${galleryWidth * 0.3902439}px`, height: `${galleryWidth * 0.25609756}px` }}
                />
                <img
                    className="photo-gallery__3rd-img"
                    src={photos[0] ? photos[0] : defaultImg}
                    alt="listing"
                    style={{ width: `${galleryWidth * 0.3902439}px`, height: `${galleryWidth * 0.25609756}px` }}
                />
            </div>
        </div>
    );
};

export default PhotoGallery;