import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { ConfirmSignUp } from './sign_up';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../util/actions/auth_actions';
import NavLinks from './nav_links';
import { useHistory } from "react-router-dom";


function SignIn(props) {
    const initialState = {
        email: "",
        password: "",
        err: ""
    };
    const [state, updateState] = useState(initialState);
    const { email, password, err } = state;
    const dispatch = useDispatch();
    const { setComponent, setAuthPage, location, closeModal } = props;
    const animation = props.animation ? props.animation : "";
    const history = useHistory();

    useEffect(() => {
        if (props.email) {
            updateState(s => ({ ...s, email: props.email }));
        };
    }, [props]);

    function signIn(e) {
        e.preventDefault();
        if (email === "" || password === "") {
            updateState({ ...state, err: "Email / 密碼錯誤" });
            return;
        };

        updateState({ ...state, err: "讀取中..." });

        Auth.signIn(email, password)
            .then(res => {
                dispatch(AuthActions.signIn(res));
                if (setComponent) setComponent(<NavLinks setComponent={setComponent} closeModal={closeModal}/>);
                if (location) {
                    if (!location.state) {
                        history.push("/");
                    } else {
                        let previousPath = location.state.from.pathname;
                        switch (previousPath) {
                            case "/list-rental-promo":
                                history.push("/rental-panel");
                                return;
                            default:
                                history.push("/");
                                return;
                        }
                    };
                };
            })
            .catch(err => {
                console.log("sign in error:", err);
                updateState({ ...state, err: err.message });
            });
    };

    function resendConfirm() {
        if (setComponent) setComponent(<ConfirmSignUp setComponent={setComponent}/>);
        if (setAuthPage) setAuthPage(<ConfirmSignUp setAuthPage={setAuthPage} location={location}/>);
    };

    function handleInput(e) {
        updateState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <div className={`sign-in ${animation}`}>
            <form className="sign-in__form" onSubmit={signIn}>
                <input
                    className="sign-in__input"
                    name='email'
                    type='email'
                    onChange={handleInput}
                    value={email}
                    placeholder='Email'
                    autoComplete="username"
                />
                <input
                    className="sign-in__input"
                    name='password'
                    type='password'
                    onChange={handleInput}
                    value={password}
                    placeholder='密碼'
                    autoComplete="password"
                />
                <button className="sign-in__button">登入</button>
            </form>
            <div onClick={resendConfirm} className="sign-in__resend">重新寄出驗證碼</div>
            <div>{err}</div>
        </div>
    );
};

export default SignIn;