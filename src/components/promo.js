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
            <img className="promo__img" src={imgLink} alt="promo img"></img>
            <div className="promo__content">
                <h2>{title}</h2>
                <p>{content}</p>
            </div>
            <button className="promo__button">Link to Promo</button>
        </div>
    );
};

export default Promo;