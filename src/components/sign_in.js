import React, { useState, useEffect, useContext } from 'react';
import { Auth } from 'aws-amplify';
// import ResendConfirm from './resend-confirm';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../util/actions/auth_actions';


function SignIn(props) {
    const initialState = {
        email: "",
        password: "",
        err: ""
    };
    const [state, updateState] = useState(initialState);
    const { email, password, err } = state;
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.email) {
            updateState(s => ({ ...s, email: props.email }));
        };
    }, [props]);

    async function signIn(e) {
        e.preventDefault();
        if (email === "" || password === "") {
            updateState({ ...state, err: "Email / 密碼錯誤" });
            return;
        };

        updateState({ ...state, err: "讀取中..." });

        try {
            await Auth.signIn(email, password).then(
                res => {
                    dispatch(AuthActions.signIn(res));
                }
            );
        } catch (error) {
            console.log('error signing in', error);
            updateState({ ...state, err: error.message });
        };
    };

    // function resendConfirm() {
    //     props.modalAction({
    //         component: <ResendConfirm
    //             modalAction={props.modalAction}
    //         />
    //     });
    // };

    function handleInput(e) {
        updateState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <div className="sign-in sign-in--show">
            <form onSubmit={signIn}>
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
                    placeholder='Password'
                    autoComplete="password"
                />
                <button className="sign-in__button">登入</button>
            </form>
            <div className="sign-in__msg">{err}</div>
            {/* <div onClick={resendConfirm}>Resend Confirmation</div> */}
        </div>
    );
};

export default SignIn;