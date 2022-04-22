import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Modal from './header_modal';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../util/actions/auth_actions';
import { useHistory, useLocation } from 'react-router-dom';
import NavLinks from './nav_links';
import SignIn from './sign_in';
import { SignUpForm } from './sign_up';

function Header() {
    const user = useSelector(state => state.user);
    const [modalState, setModal] = useState({ 
        show: false, 
        animation: "modal__wrapper--hide"
    });
    const [modalComponet, setModalComponent] = useState({
        component: NavLinks,
        props: {}
    });
    const [optionState, setOptionState] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();
    const pathname = useLocation().pathname;
    const Component = modalComponet.component;
    const componentProps = modalComponet.props;
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

    function toggleModal() {
        if (!modalState.show) {
            setModal({ show: true, animation: "modal__wrapper--show" });
            setModalComponent({ component: NavLinks, props: {} });
        } else {
            setModal({ ...modalState, animation: "modal__wrapper--hide" });
            setTimeout(() => {
                setModal({ ...modalState, show: false });
            }, 300);
        };
    };

    function closeModal() {
        setModal({ ...modalState, show: false });
    };

    return (
        <header className="header">
            <Link to="/" className="header__logo">PState</Link>
            <nav className="nav__desktop">
                <ul className="nav__ul">
                    <li className="nav__li">
                        {
                            pathname === "/rental-listings" ? <span className="nav__link nav__link--active">租房</span> :
                                <Link to="/rental-listings" className="nav__link">租房</Link>
                        }
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }} className="nav__link">買房</p>
                    </li>
                    <li className="nav__li">
                        {
                            pathname === "/rental-panel" ? <span className="nav__link nav__link--active">出租</span> :
                                <Link to="/list-rental-promo" className="nav__link">出租</Link>
                        }
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }} className="nav__link">賣房</p>
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }} className="nav__link">找仲介</p>
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }} className="nav__link">廣告</p>
                    </li>
                    <li className="nav__li">
                        <p style={{ textDecoration: "line-through" }} className="nav__link">幫助</p>
                    </li>
                    <li className={`nav__li ${displaySignIn}`}>
                        <button 
                            className="nav__button" 
                            type="button"
                            onClick={() => { 
                                setModal({ show: true, animation: "", desktop: true });
                                setModalComponent({ component: SignIn, props: { desktop: true } });
                            }}
                        >登入</button>
                    </li>
                    <li className={`nav__li ${displaySignIn}`}>
                        <button 
                            className="nav__button" 
                            type="button"
                            onClick={() => {
                                setModal({ show: true, animation: "", desktop: true });
                                setModalComponent({ component: SignUpForm, props: {} });
                            }}
                        >註冊</button>
                    </li>
                </ul>
                <div className={`nav__user-options ${displayUser}`}>
                    <p onMouseEnter={() => { setOptionState("nav__user-wrapper--show") }}>
                        {user ? user.name : ""}
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
                onClick={toggleModal}
            />
            <Modal modalState={modalState} toggleModal={toggleModal} closeModal={closeModal}>
                <Component 
                    setModalComponent={setModalComponent} 
                    toggleModal={toggleModal}
                    closeModal={closeModal}
                    { ...componentProps }
                />
            </Modal>
        </header>
    );
}

export default Header;