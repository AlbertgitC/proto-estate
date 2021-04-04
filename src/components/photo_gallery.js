import defaultImg from '../images/home-1294564_640.jpg';
import { useState, useRef, useEffect } from 'react';

function PhotoGallery(props) {
    const gallery = useRef(null);
    const [galleryWidth, setWidth] = useState(0);

    useEffect(() => {
        console.log(galleryWidth)
        function updateWidth() {
            setWidth(gallery.current.clientWidth - 14);
        };
        window.addEventListener('resize', updateWidth);
        updateWidth();
        return () => window.removeEventListener('resize', updateWidth);
    }, [galleryWidth]);

    return (
        <div className="photo-gallery" ref={gallery}>
            <div className="photo-gallery__main">
                <img 
                    className="photo-gallery__main-img" 
                    src={defaultImg} alt="listing" 
                    style={{ width: `${galleryWidth * 0.60975609}px`, height: `${galleryWidth * 0.36585365}px` }}
                />
                <div className="photo-gallery__arrow">arrow overlay</div>
                <div 
                    className="photo-gallery__imgs-wrapper"
                    style={{ height: `${galleryWidth * 0.14631465}px` }}
                >over view</div>
            </div>
            <div className="photo-gallery__side">
                <img 
                    src={defaultImg}
                    alt="listing"
                    style={{ width: `${galleryWidth * 0.3902439}px`, height: `${galleryWidth * 0.25609756}px` }}
                />
                <img
                    src={defaultImg}
                    alt="listing"
                    style={{ width: `${galleryWidth * 0.3902439}px`, height: `${galleryWidth * 0.25609756}px` }}
                />
            </div>
        </div>
    );
};

export default PhotoGallery;