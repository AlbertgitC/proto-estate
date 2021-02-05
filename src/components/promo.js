import { useState, useEffect } from 'react';

function Promo(props) {
    const [imgLink, setLink] = useState("");
    const { imgFile, title, content } = props;

    useEffect(() => {
        import(`../images/${imgFile}`)
            .then(res => {
                setLink(res.default);
            });
    },[imgFile]);
    
    return (
        <div className="promo">
            <img className="promo__img" src={imgLink} alt="promo img"></img>
            <h2>{title}</h2>
            <p>{content}</p>
            <button className="promo__button">Link to Promo</button>
        </div>
    );
};

export default Promo;