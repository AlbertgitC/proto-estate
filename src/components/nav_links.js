import SignIn from './sign_in';
import { SignUpForm } from './sign_up';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../util/actions/auth_actions';
import { Link } from "react-router-dom";

function NavLinks(props) {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { setComponent, closeModal } = props;
    const initialState = { navAuth: "", navLi: "nav--hide" };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (user) setState({ navAuth: "nav--hide", navLi: "" });
    }, [user]);

    function clickSignIn() {
        setComponent(<SignIn setComponent={setComponent} animation="sign-in--show" closeModal={closeModal}/>);
    };

    function clickSignUp() {
        setComponent(<SignUpForm setComponent={setComponent} animation="sign-up--show"/>);
    };

    async function signOut() {
        closeModal();
        setState(initialState);
        try {
            await Auth.signOut();
            dispatch(AuthActions.signOut());
        } catch (error) {
            console.log('error signing out: ', error);
        };
    };

    return (
        <div className="nav">
            <div className={`nav__auth ${state.navAuth}`}>
                <button className="nav__button" onClick={clickSignIn}>登入</button>
                <button className="nav__button" onClick={clickSignUp}>註冊</button>
            </div>
            <ul className="nav__ul">
                <li className="nav__li">
                    <p>租房</p>
                </li>
                <li className="nav__li">
                    <p>買房</p>
                </li>
                <li className="nav__li">
                    <Link to="/list-rental-promo" onClick={closeModal}>出租</Link>
                </li>
                <li className="nav__li">
                    <p>賣房</p>
                </li>
                <li className="nav__li">
                    <p>找仲介</p>
                </li>
                <li className="nav__li">
                    <p>廣告</p>
                </li>
                <li className="nav__li">
                    <p>幫助</p>
                </li>
                <li className={`nav__li ${state.navLi}`}>
                    <p>帳號設定</p>
                </li>
                <li className={`nav__li ${state.navLi}`} onClick={signOut}>
                    <p>登出</p>
                </li>
            </ul>
        </div>
    );
}

export default NavLinks;