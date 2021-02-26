import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Modal from './header_modal';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../util/actions/auth_actions';
import { useHistory } from 'react-router-dom';

function Header() {
    const user = useSelector(state => state.user);
    const [modalState, setModal] = useState({ show: false, animation: "modal__wrapper--hide" });
    const [optionState, setOptionState] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();
    let displaySignIn;
    let displayUser;
    if (user) {
        displaySignIn = "nav--hidden";
        displayUser = "";
    } else {
        displaySignIn = "";
        displayUser = "nav__user-options--hidden";
    };

    async function signOut() {
        history.push("/");
        try {
            await Auth.signOut();
            dispatch(AuthActions.signOut());
        } catch (error) {
            console.log('error signing out: ', error);
        };
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
                    <li className={`nav__li ${displaySignIn}`}>
                        <button 
                            className="nav__button" 
                            type="button"
                            onClick={() => { 
                                
                            }}
                        >登入</button>
                    </li>
                    <li className={`nav__li ${displaySignIn}`}>
                        <button className="nav__button" type="button">註冊</button>
                    </li>
                </ul>
                <div className={`nav__user-options ${displayUser}`}>
                    <p onMouseEnter={() => { setOptionState("nav__user-wrapper--show") }}>
                        {user ? user.attributes.name : ""}
                    </p>
                    <div 
                        className={`nav__user-wrapper ${optionState}`} 
                        onMouseLeave={() => { setOptionState("") }}
                    >
                        <ul className="nav__user-ul">
                            <li className="nav__user-li">
                                <p style={{ textDecoration: "line-through" }}>帳號設定</p>
                            </li>
                            <li className="nav__user-li" onClick={signOut}>
                                <p>登出</p>
                            </li>
                        </ul>
                    </div>
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