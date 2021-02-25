import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Modal from './header_modal';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function Header() {
    const user = useSelector(state => state.user);
    const [modalState, setModal] = useState({ show: false, animation: "modal__wrapper--hide" });
    let display;
    if (user) {
        display = "nav--hidden";
    } else {
        display = "";
    };

    function toggleNavLinks() {
        if (!modalState.show) {
            setModal({ show: true, animation: "modal__wrapper--show" });
        } else {
            setModal({ ...modalState, animation: "modal__wrapper--hide" });
            setTimeout(() => {
                setModal({ ...modalState, show: false });
            }, 300);
        };
    };

    return (
        <header className="header">
            <Link to="/" className="header__logo">PState</Link>
            <nav className="nav__desktop">
                <ul className="nav__ul">
                    <li className="nav__li">
                        <Link to="/rental-listings">租房</Link>
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }}>買房</p>
                    </li>
                    <li className="nav__li">
                        <Link to="/list-rental-promo">出租</Link>
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }}>賣房</p>
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }}>找仲介</p>
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }}>廣告</p>
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }}>幫助</p>
                    </li>
                    <li className={`nav__li ${display}`}>
                        <button className="nav__button" type="button">登入</button>
                    </li>
                    <li className={`nav__li ${display}`}>
                        <button className="nav__button" type="button">註冊</button>
                    </li>
                </ul>
                <div className="nav__user-options">
                    <p>{user ? user.attributes.name : ""}</p>
                    <ul className="nav__user-ul">
                        <li className="nav__li">
                            <p style={{ textDecoration: "line-through" }}>帳號設定</p>
                        </li>
                        <li className="nav__li">
                            <p>登出</p>
                        </li>
                    </ul>
                </div>
            </nav>
            <FontAwesomeIcon 
                icon={faBars} 
                transform="down-3" 
                className="header__nav"
                onClick={toggleNavLinks}
            />
            <Modal modalState={modalState} toggleNavLinks={toggleNavLinks}/>
        </header>
    );
}

export default Header;