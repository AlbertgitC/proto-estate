import { useState, useEffect } from 'react';

function Promo(props) {
    const [imgLink, setLink] = useState("");
    const { imgFile, title, content } = props;

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            import(`../images/${imgFile}`)
                .then(res => {
                    setLink(res.default);
                });
        };
        return () => (isSubscribed = false);
    },[imgFile]);
    
    return (
        <div className="promo">
            <div className="promo__img" style={{ backgroundImage: `url(${imgLink})` }} />
            <div className="promo__content-wrapper">
                <div className="promo__content">
                    <h2>{title}</h2>
                    <p>{content}</p>
                </div>
                <button className="promo__button" type="button">Link to Promo</button>
            </div>
        </div>
    );
};

export default Promo;