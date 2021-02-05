import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { ConfirmSignUp } from './sign_up';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../util/actions/auth_actions';
import NavLinks from './nav_links';


function SignIn(props) {
    const initialState = {
        email: "",
        password: "",
        err: ""
    };
    const [state, updateState] = useState(initialState);
    const { email, password, err } = state;
    const dispatch = useDispatch();
    const { setComponent } = props;

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
                setComponent(<NavLinks setComponent={setComponent}/>);})
            .catch(err => {
                console.log("sign in error:", err);
                updateState({ ...state, err: err.message });
            });
    };

    function resendConfirm() {
        setComponent(<ConfirmSignUp setComponent={setComponent}/>);
    };

    function handleInput(e) {
        updateState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <div className="sign-in sign-in--show">
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